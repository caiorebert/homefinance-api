import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum TipoTransacao {
    RECEITA = 'RECEITA',
    DESPESA = 'DESPESA'
}

export class TransacaoDto {
    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    valor: number;

    @IsNotEmpty()
    @IsDateString()
    data: string;

    @IsNotEmpty()
    @IsEnum(TipoTransacao)
    tipo: TipoTransacao;

    @IsOptional()
    @IsString()
    categoria?: string;

    @IsOptional()
    @IsString()
    observacoes?: string;
}