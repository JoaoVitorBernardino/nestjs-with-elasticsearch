import { Module } from '@nestjs/common';
import { CustomElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
    imports: [CustomElasticsearchModule, PrismaModule],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule { }
