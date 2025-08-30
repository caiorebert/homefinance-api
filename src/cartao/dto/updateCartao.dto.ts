import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCartaoDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsNumber()
    @IsPositive()
    limite: number;

    @IsNumber()
    @IsPositive()
    saldoUtilizado?: number;

    @IsNumber()
    @IsNotEmpty()
    contaId: number;
}