import { BadRequestException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly prisma: PrismaService,
    ) { }

    async create(createSaleDto: CreateSaleDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: createSaleDto.productId },
        });

        if (product.quantity < createSaleDto.quantity) {
            throw new BadRequestException('Insufficient quantity in stock')
        }

        const updateProduct = await this.prisma.product.update({
            where: { id: createSaleDto.productId },
            data: { quantity: product.quantity - createSaleDto.quantity },
        });

        const sale = await this.prisma.sale.create({ data: createSaleDto });

        await this.elasticsearchService.update({
            index: 'products',
            id: createSaleDto.productId,
            doc: { quantity: updateProduct.quantity },
        });

        return sale;
    }

    findAll() {
        return this.prisma.sale.findMany();
    }

    findOne(id: string) {
        return this.prisma.sale.findUnique({
            where: { id }
        });
    }

    update(id: string, updateSaleDto: UpdateSaleDto) {
        return `This action updates a #${id} sale`;
    }

    remove(id: string) {
        return `This action removes a #${id} sale`;
    }
}
