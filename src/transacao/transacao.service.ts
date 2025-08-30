import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transacao } from './transacao.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { TransacaoDto } from './dto/transacao.dto';
import { UserService } from 'src/user/user.service';
import { ContaService } from 'src/conta/conta.service';
import { CreateTransacaoDto } from './dto/createTransacao.dto';
import { CategoriaService } from 'src/categoria/categoria.service';
import { Conta } from 'src/conta/conta.entity';
import { UpdateTransacaoDto } from './dto/updateTransacao.dto';

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
        
        const transacao = await this.transacaoRepository.findOne({ 
            where: { id },
            relations: ['categoria', 'conta'] 
        });
        
        if (!transacao) {
            throw new Error(`Transação com ID ${id} não encontrada.`);
        }

        return transacao;
    }

    async getTransacoesByUsuarioId(user_id: number, mesReferencia?: number, anoReferencia?: number): Promise<Transacao[]> {
        if (!user_id) {
            throw new Error('ID do usuário não fornecido.');
        }
        const contaUser = await this.contaService.getContaByUserId(user_id);
        if (!contaUser) {
            throw new Error(`Conta não encontrada para o usuário com ID ${user_id}.`);
        }

        let dataInicio: Date | undefined = undefined;
        let dataFim: Date | undefined = undefined;

        if (mesReferencia && anoReferencia) {
            dataInicio = new Date(anoReferencia, mesReferencia - 1, 1);
            dataFim = new Date(anoReferencia, mesReferencia, 0, 23, 59, 59, 999);
        }

        const query = this.transacaoRepository.createQueryBuilder('transacao')
                        .select([
                            'transacao.id',
                            'transacao.valor',
                            'transacao.data',
                            'transacao.descricao',
                            'transacao.tipo'
                        ])
                        .orderBy('transacao.data', 'DESC')
                        .where('transacao.conta_id = :contaId', { contaId: contaUser.id });

        if (dataInicio != undefined) {
            query.andWhere('transacao.data >= :dataInicio', { dataInicio });
        }

        if (dataFim != undefined) {
            query.andWhere('transacao.data <= :dataFim', { dataFim });
        }

        return await query.getMany();
    }

    async getValorSaidas(conta_id: number, mesReferencia?:number, anoReferencia?:number): Promise<number> {
        if (!conta_id) {
            throw new Error('ID da conta não fornecido.');
        }

        const whereConditions: any = { conta: { id: conta_id }, tipo: TipoTransacao.SAIDA };
        if (mesReferencia && anoReferencia) {
            const dataInicio = new Date(anoReferencia, mesReferencia - 1, 1);
            const dataFim = new Date(anoReferencia, mesReferencia, 0, 23, 59, 59, 999);
            whereConditions.data = MoreThan(dataInicio);
            whereConditions.data = LessThan(dataFim);
        }

        const transacoes = await this.transacaoRepository.find({
            select: ['valor'],
            where: whereConditions,
        });

        return transacoes.reduce((total, transacao) => total + parseFloat(transacao.valor.toString()), 0);
    }

    async getValorEntradas(conta_id: number, mesReferencia?: number, anoReferencia?: number): Promise<number> {
        if (!conta_id) {
            throw new Error('ID da conta não fornecido.');
        }

        const whereConditions = { conta: { id: conta_id }, tipo: TipoTransacao.ENTRADA };
        
        if (mesReferencia && anoReferencia) {
            const dataInicio = new Date(anoReferencia, mesReferencia - 1, 1);
            const dataFim = new Date(anoReferencia, mesReferencia, 0, 23, 59, 59, 999);
            Object.assign(whereConditions, { data: MoreThan(dataInicio) });
            Object.assign(whereConditions, { data: LessThan(dataFim) });
        }
        
        const transacoes = await this.transacaoRepository.find({
            select: ['valor'],
            where: whereConditions,
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
            fixo: transacaoDTO.fixo || false,
        });

        let saldoAtualizado = parseFloat(conta.saldo.toString());

        saldoAtualizado += transacaoDTO.tipo === TipoTransacao.ENTRADA ? parseFloat(transacaoDTO.valor.toString()) : -parseFloat(transacaoDTO.valor.toString());
        
        conta.saldo = saldoAtualizado;
        
        await this.contaService.update(conta.id, conta);

        return await this.transacaoRepository.save(novaTransacao);
    }

    async update(id: number, updateTransacaoDto: UpdateTransacaoDto) {
        const transacao = await this.getTransacaoById(id);
        if (!transacao) {
            throw new Error(`Transação com ID ${id} não encontrada.`);
        }

        if (updateTransacaoDto.categoria_id) {
            const categoria = await this.categoriaService.getCategoriaById(updateTransacaoDto.categoria_id);
            if (!categoria) {
                throw new Error(`Categoria com ID ${updateTransacaoDto.categoria_id} não encontrada.`);
            }
            transacao.categoria = categoria;
        }

        if (updateTransacaoDto.data) {
            transacao.data = updateTransacaoDto.data;
        }

        if (updateTransacaoDto.descricao) {
            transacao.descricao = updateTransacaoDto.descricao;
        }

        if (updateTransacaoDto.tipo) {
            transacao.tipo = updateTransacaoDto.tipo;
        }

        if (updateTransacaoDto.valor) {
            transacao.valor = updateTransacaoDto.valor;
        }
        
        if (updateTransacaoDto.fixo !== undefined) {
            transacao.fixo = updateTransacaoDto.fixo;
        }

        await this.transacaoRepository.save(transacao);

        await this.calculoConta(transacao.conta.id);

        return transacao;
    }

    async delete(id: number): Promise<void> {
        if (!id) {
            throw new Error('ID da transação não fornecido.');
        }
        const transacao = await this.getTransacaoById(id);
        if (!transacao) {
            throw new Error(`Transação com ID ${id} não encontrada.`);
        }

        await this.transacaoRepository.softDelete(id);

        await this.calculoConta(transacao.conta.id);
    }

    async calculoConta(contaId: number) {
        const transacoes = await this.transacaoRepository.find({
            where: { deletedAt: undefined, conta: { id: contaId } },
        });
        const conta = await this.contaService.getById(contaId);
        if (!conta) {
            throw new Error(`Conta com ID ${contaId} não encontrada.`);
        }

        conta.saldo = transacoes.reduce((saldo, transacao) => {
            return transacao.tipo === TipoTransacao.ENTRADA ? saldo + parseFloat(transacao.valor.toString()) : saldo - parseFloat(transacao.valor.toString());
        }, 0);
        await this.contaService.update(conta.id, conta);
    }

    async getTransacoesFixas(conta_id:number): Promise<Object> {
        if (!conta_id) {
            throw new Error('ID da conta não fornecido.');
        }

        const conta = await this.contaService.getById(conta_id);
        if (!conta) {
            throw new Error(`Conta com ID ${conta_id} não encontrada.`);
        }

        const transacoes = await this.transacaoRepository.find({
            where: { conta: { id: conta_id }, fixo: true, deletedAt: undefined },
            order: { data: 'DESC' }
        });

        return {
            data: transacoes,
            message: 'Transações fixas encontradas com sucesso'
        }
    }
    
}
