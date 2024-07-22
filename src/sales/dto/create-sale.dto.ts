import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateSaleDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsInt()
    quantity: number;
}
