import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartaoDto {
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