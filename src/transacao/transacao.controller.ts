import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { TransacaoDto } from './dto/transacao.dto';
import { CreateTransacaoDto } from './dto/createTransacao.dto';
import { UpdateTransacaoDto } from './dto/updateTransacao.dto';

@Controller('transacao')
export class TransacaoController {
    constructor(
        private readonly transacaoService: TransacaoService
    ) {}

    @Get('/')
    getTransacoes(): Object {
        return {};
    }

    @Get('/:id')
    getTransacaoById(@Param('id') id: number): Object {
        return this.transacaoService.getTransacaoById(id);
    }

    @Post('/')
    createTransacao(@Body() createTransacaoDTO: CreateTransacaoDto): Object {
        try {
            return this.transacaoService.create(createTransacaoDTO);
        } catch (error) {
            return { message: error.message };
        }
    }

    @Put('/:id')
    updateTransacao(@Param("id") id: number, @Body() updateTransacao: UpdateTransacaoDto): Object {
        try {
            return this.transacaoService.update(id, updateTransacao);
        } catch (error) {
            return { message: error.message };
        }
    }

    @Delete('/:id')
    deleteTransacao(@Param("id") id: number): Object {
        try {
            return this.transacaoService.delete(id);
        } catch (error) {
            return { message: error.message };
        }
    }
}
