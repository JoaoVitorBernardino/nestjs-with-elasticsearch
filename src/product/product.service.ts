import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly prisma: PrismaService,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const product = await this.prisma.product.create({ data: createProductDto });

        await this.elasticsearchService.index({
            index: 'products',
            id: product.id.toString(),
            document: product,
        });

        return product;
    }

    findAll() {
        return this.prisma.product.findMany();
    }

    findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id }
        });
    }

    async searchProducts(query: string) {
        const { hits } = await this.elasticsearchService.search({
            index: 'products',
            query: {
                match: { name: query },
            },
        });

        return hits.hits;
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
