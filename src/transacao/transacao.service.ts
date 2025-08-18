import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transacao } from './transacao.entity';
import { Repository } from 'typeorm';
import { TransacaoDto } from './dto/transacao.dto';
import { UserService } from 'src/user/user.service';
import { ContaService } from 'src/conta/conta.service';
import { CreateTransacaoDto } from './dto/createTransacao.dto';
import { CategoriaService } from 'src/categoria/categoria.service';
import { Conta } from 'src/conta/conta.entity';

export enum TipoTransacao {
    ENTRADA = 'entrada',
    SAIDA = 'saída'
}

@Injectable()
export class TransacaoService {
    constructor(
        @InjectRepository(Transacao)
        private readonly transacaoRepository: Repository<Transacao>,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(forwardRef(() => ContaService))
        private readonly contaService: ContaService,
        @Inject(forwardRef(() => CategoriaService))
        private readonly categoriaService: CategoriaService,
    ) {}

    async getTransacoes(): Promise<Transacao[]> {
        return this.transacaoRepository.find();
    }

    async getTransacaoById(id: number): Promise<Transacao> {
        if (!id) {
            throw new Error('ID da transação não fornecido.');
        }
        
        const transacao = await this.transacaoRepository.findOne({ where: { id } });
        
        if (!transacao) {
            throw new Error(`Transação com ID ${id} não encontrada.`);
        }

        return transacao;
    }

    async getTransacoesByUsuarioId(user_id: number): Promise<Transacao[]> {
        if (!user_id) {
            throw new Error('ID do usuário não fornecido.');
        }
        const contaUser = await this.contaService.getContaByUserId(user_id);
        if (!contaUser) {
            throw new Error(`Conta não encontrada para o usuário com ID ${user_id}.`);
        }
        return this.transacaoRepository.find({ where: { conta: { id: contaUser.id } }});
    }

    async getValorSaidas(conta_id: number): Promise<number> {
        if (!conta_id) {
            throw new Error('ID da conta não fornecido.');
        }

        const transacoes = await this.transacaoRepository.find({
            select: ['valor'],
            where: { conta: { id: conta_id }, tipo: TipoTransacao.SAIDA },
        });

        return transacoes.reduce((total, transacao) => total + parseFloat(transacao.valor.toString()), 0);
    }

    async getValorEntradas(conta_id: number): Promise<number> {
        if (!conta_id) {
            throw new Error('ID da conta não fornecido.');
        }

        const transacoes = await this.transacaoRepository.find({
            where: { conta: { id: conta_id }, tipo: TipoTransacao.ENTRADA },
        });

        return transacoes.reduce((total, transacao) => total + parseFloat(transacao.valor.toString()), 0);
    }

    async create(transacaoDTO: CreateTransacaoDto): Promise<Transacao> {
        let conta:Conta;
        
        if (transacaoDTO.conta_id) {
            conta = await this.contaService.getById(transacaoDTO.conta_id);
        } else {
            if (!transacaoDTO.user_id) {
                throw new Error('ID do usuário não fornecido para criação de transação sem conta.');
            }
            const user = await this.userService.getUserById(transacaoDTO.user_id);
            
            conta = await this.contaService.getContaByUserId(user.id);
        }

        const categoria = await this.categoriaService.getCategoriaById(transacaoDTO.categoria_id);
        if (!categoria) {
            throw new Error(`Categoria com ID ${transacaoDTO.categoria_id} não encontrada.`);
        }

        const novaTransacao = this.transacaoRepository.create({
            valor: transacaoDTO.valor,
            tipo: transacaoDTO.tipo,
            data: transacaoDTO.data,
            categoria: categoria,
            conta: conta, 
            descricao: transacaoDTO.descricao,
        });

        let saldoAtualizado = parseFloat(conta.saldo.toString());

        saldoAtualizado += transacaoDTO.tipo === TipoTransacao.ENTRADA ? parseFloat(transacaoDTO.valor.toString()) : -parseFloat(transacaoDTO.valor.toString());
        
        conta.saldo = saldoAtualizado;
        
        await this.contaService.update(conta.id, conta);

        return await this.transacaoRepository.save(novaTransacao);
    }

    async deleteTransacao(id: number): Promise<void> {
        if (!id) {
            throw new Error('ID da transação não fornecido.');
        }

        await this.transacaoRepository.delete(id);
    }

    
}
