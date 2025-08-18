import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateContaDto {

    @IsNotEmpty()
    @IsString()
    tipo: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}