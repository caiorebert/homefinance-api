import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conta } from './conta.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ContaDto } from './dto/conta.dto';
import { CreateContaDto } from './dto/createConta.dto';

@Injectable()
export class ContaService {
    constructor (
        @InjectRepository(Conta)
        private readonly contaRepository: Repository<Conta>,
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    async getById(id: number): Promise<Conta> {
        if (!id) {
            throw new Error('ID da conta não fornecido.');
        }

        const conta = await this.contaRepository.findOne({ where: { id } });
        if (!conta) {
            throw new Error(`Conta com ID ${id} não encontrada.`);
        }

        return conta;
    }

    async getContaByUserId(user_id: number): Promise<Conta> {
        if (!user_id) {
            throw new Error('ID do usuário não fornecido.');
        }

        const user = await this.userService.getUserById(user_id);
        if (!user) {
            throw new Error(`Usuário com ID ${user_id} não encontrado.`);
        }

        const conta = await this.contaRepository.findOne({ where: { user: { id: user_id } } });
        if (!conta) {
            throw new Error(`Conta não encontrada para o usuário com ID ${user_id}.`);
        }

        return conta;
    }

    async create(contaDTO: CreateContaDto): Promise<Conta> {
        const conta = this.contaRepository.create(contaDTO);
        const user = await this.userService.getUserById(contaDTO.user_id);
        if (!user) {
            throw new Error(`Usuário com ID ${contaDTO.user_id} não encontrado.`);
        }
        conta.user = user;
        return await this.contaRepository.save(conta);
    }

    async update(id: number, contaDTO: ContaDto): Promise<Conta> {
        if (!id) {
            throw new Error('ID da conta não fornecido.');
        }

        const conta = await this.getById(id);
        if (!conta) {
            throw new Error(`Conta com ID ${id} não encontrada.`);
        }

        Object.assign(conta, contaDTO);
        return await this.contaRepository.save(conta);
    }
}
