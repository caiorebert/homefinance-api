import { TipoTransacao } from "../transacao.entity";

export class UpdateTransacaoDto {
    valor?: number;
    data?: Date;
    categoria_id?: number;
    tipo?: TipoTransacao;
    fixo?: boolean;
    conta_id?: number;
    user_id?: number;
    descricao?: string;
}