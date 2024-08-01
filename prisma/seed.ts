import { Client } from "@elastic/elasticsearch";
import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { Product } from "src/product/interfaces/product.interface";
import { Sale } from "src/sales/interfaces/sale.interface";

const configService = new ConfigService();
const prisma = new PrismaClient();
const client = new Client({
    node: `https://${configService.get<string>('ELASTIC_HOST')}:${configService.get<string>('ELASTIC_PORT')}`,
    auth: {
        apiKey: configService.get<string>('ELASTIC_KEY')
    },
    tls: {
        ca: readFileSync('./http_ca.crt'),
        rejectUnauthorized: false,
    }
});

async function main() {
    try {
        const productIds: string[] = [];
        const productsData: Product[] = [];

        for (let i = 0; i < 500000; i++) {
            const productData = {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                quantity: faker.number.int({ min: 1, max: 100 }),
                price: parseFloat(faker.commerce.price()),
            };

            const product = await prisma.product.create({
                data: productData,
            });

            await client.index({
                index: 'products',
                id: product.id,
                document: product,
            });

            productIds.push(product.id);
            productsData.push(product);
        }

        console.log('Indexed products in Elasticsearch');

        const salesData: Sale[] = [];

        for (let i = 0; i < 500000; i++) {
            const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
            const saleData = {
                quantity: faker.number.int({ min: 1, max: 100 }),
                productId: randomProductId,
            };

            const sale = await prisma.sale.create({
                data: saleData,
            });

            const product = await prisma.product.findUnique({
                where: {
                    id: randomProductId
                },
            });

            if (product) {
                await client.index({
                    index: 'sales',
                    id: sale.id,
                    document: {
                        ...sale,
                        product: product,
                    },
                });

                salesData.push(sale);
            }
        }

        console.log('Indexed sales in Elasticsearch with product details');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
