import { TipoTransacao } from "../transacao.entity";

export class CreateTransacaoDto {
    valor: number;
    data: Date;
    categoria_id: number;
    tipo: TipoTransacao;
    conta_id?: number;
    user_id?: number;
    descricao?: string;
}