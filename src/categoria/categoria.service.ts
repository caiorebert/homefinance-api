import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CategoriaDto } from './dto/categoria.dto';

@Injectable()
export class CategoriaService {
    constructor (
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {}

    async getAllCategorias(): Promise<Categoria[]> {
        return this.categoriaRepository.find();
    }

    async getCategoriaById(id: number): Promise<Categoria> {
        if (!id) {
            throw new Error('ID da categoria não fornecido.');
        }

        const categoria = await this.categoriaRepository.findOne({ where: { id } });

        if (!categoria) {
            throw new Error(`Categoria com ID ${id} não encontrada.`);
        }

        return categoria;
    }

    async create(categoriaDTO: CategoriaDto): Promise<Categoria> {
        const novaCategoria = this.categoriaRepository.create(categoriaDTO);
        return await this.categoriaRepository.save(novaCategoria);
    }

    async deleteCategoria(id: number): Promise<void> {
        if (!id) {
            throw new Error('ID da categoria não fornecido.');
        }

        const categoria = await this.getCategoriaById(id);
        if (!categoria) {
            throw new Error(`Categoria com ID ${id} não encontrada.`);
        }

        await this.categoriaRepository.remove(categoria);
    }
}
