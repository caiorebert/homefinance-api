import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cartao } from './cartao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartaoService {

    constructor (
        @InjectRepository(Cartao)
        private cartaoRepository: Repository<Cartao>,
    ) {}

    async create(cartaoData: Partial<Cartao>): Promise<Cartao> {
        const cartao = this.cartaoRepository.create(cartaoData);
        return await this.cartaoRepository.save(cartao);
    }

    async findAll(): Promise<Cartao[]> {
        return await this.cartaoRepository.find();
    }

    async findOne(id: number): Promise<Cartao> {
        const cartao = await this.cartaoRepository.findOne({ where: { id } });
        if (!cartao) {
            throw new Error('Cartão não encontrado');
        }
        return cartao;
    }

    async update(id: number, cartaoData: Partial<Cartao>): Promise<Cartao> {
        await this.cartaoRepository.update(id, cartaoData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.cartaoRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Cartão não encontrado');
        }
    }
}
