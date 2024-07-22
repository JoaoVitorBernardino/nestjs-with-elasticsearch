import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductService {
    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly prisma: PrismaService,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = await this.prisma.product.create({ data: createProductDto });

        await this.elasticsearchService.index({
            index: 'products',
            id: product.id,
            document: product,
        });

        return product;
    }

    findAll(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    findOne(id: string): Promise<Product> {
        return this.prisma.product.findUnique({
            where: { id }
        });
    }

    async searchProducts(query: string): Promise<Product[]> {
        const { hits } = await this.elasticsearchService.search<Product>({
            index: 'products',
            query: {
                match: { name: query },
            },
        });

        return hits.hits.map(hit => hit._source as Product);
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });

        await this.elasticsearchService.update({
            index: 'products',
            id: id,
            doc: updateProductDto,
        });

        return updatedProduct;
    }

    remove(id: string) {
        return `This action removes a #${id} product`;
    }
}
