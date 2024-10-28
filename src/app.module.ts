import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';

@Module({
    imports: [
        PrismaModule,
        ProductModule,
        SalesModule
    ]
})
export class AppModule { }
