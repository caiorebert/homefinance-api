import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { CategoriaDto } from './dto/categoria.dto';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {

    constructor(
        @Inject(CategoriaService)
        private readonly categoriaService: CategoriaService
    ) {}

    @Get('/')
    getCategorias(): Object {
        return [];
    }

    @Get('/{id}')
    getCategoriaById(id: number): Object {
        return {};
    }

    @Get('/{id}/transacoes')
    getTransacoesByCategoriaId(id: number): Object {
        return [];
    }

    @Post('/')
    createCategoria(@Body() CategoriaDto: CategoriaDto): Object {
        return this.categoriaService.create(CategoriaDto);
    }

    @Delete('/{id}')
    deleteCategoria(id: number): Object {
        return { message: `Categoria com ID ${id} deletada com sucesso` };
    }
}
