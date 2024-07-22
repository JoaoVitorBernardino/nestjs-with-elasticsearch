import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ProductModule,
        SalesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
