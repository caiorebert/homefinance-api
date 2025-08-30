import { Inject, Injectable, Logger } from '@nestjs/common';
import { ContaService } from 'src/conta/conta.service';
import { Transacao } from 'src/transacao/transacao.entity';
import { TransacaoService } from 'src/transacao/transacao.service';

@Injectable()
export class BalancoService {

    constructor(
        @Inject(TransacaoService)
        private readonly transacaoService: TransacaoService,
        @Inject(ContaService)
        private readonly contaService: ContaService,
    ) {}

    async calcularBalanco(user_id:number, month?: number, year?: number): Promise<Object> {

        const conta = await this.contaService.getContaByUserId(user_id);

        const lancamentos = await this.transacaoService.getTransacoesByUsuarioId(user_id, month, year);

        const entradas = await this.transacaoService.getValorEntradas(conta.id, month, year);

        const saidas = await this.transacaoService.getValorSaidas(conta.id, month, year);

        let saldoCalculo = 0;

        saldoCalculo = entradas - saidas;

        Logger.log(`Entradas: ${entradas}, Saídas: ${saidas}, Saldo: ${saldoCalculo}`);

        const balanco = {
            conta: conta,
            entradas: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entradas),
            gastos: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saidas),
            saldo: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoCalculo),
            lancamentos: lancamentos
        };
        return {
            data: balanco,
            message: 'Balanço calculado com sucesso'
        };
    }
}
