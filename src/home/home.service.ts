import { Inject, Injectable } from '@nestjs/common';
import { ContaService } from 'src/conta/conta.service';
import { TransacaoService } from 'src/transacao/transacao.service';

@Injectable()
export class HomeService {

    constructor (
        @Inject(TransacaoService)
        private readonly transacaoService: TransacaoService,
        @Inject(ContaService)
        private readonly contaService: ContaService
    ) {}

    async getHome(user_id:number): Promise<Object> {
        
        const conta = await this.contaService.getContaByUserId(user_id);        

        const transacoes = await this.transacaoService.getTransacoesByUsuarioId(user_id);

        const entradas = await this.transacaoService.getValorEntradas(conta.id);

        const saidas = await this.transacaoService.getValorSaidas(conta.id);

        return {
            data: {
                saldoTotal: parseFloat(conta.saldo.toString()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                transacoes: transacoes || [],
                despesas: saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                receitas: entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            },
            message: 'Dados encontrado com sucesso'
        };
    }
}
