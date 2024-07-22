import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSaleDto {
    @IsOptional()
    @IsString()
    productId?: string;

    @IsOptional()
    @IsInt()
    quantity?: number
}
