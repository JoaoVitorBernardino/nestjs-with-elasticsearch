import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { readFileSync } from "fs";

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                node: `https://${configService.get<string>('ELASTIC_HOST')}:${configService.get<string>('ELASTIC_PORT')}`,
                auth: {
                    username: 'elastic',
                    password: configService.get<string>('ELASTIC_PASSWORD'),
                },
                tls: {
                    ca: readFileSync('./http_ca.crt'),
                    rejectUnauthorized: false,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [ElasticsearchModule],
})
export class CustomElasticsearchModule { }