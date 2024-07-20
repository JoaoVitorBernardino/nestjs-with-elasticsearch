import { Module } from '@nestjs/common';
import { CustomElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [CustomElasticsearchModule, PrismaModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule { }
