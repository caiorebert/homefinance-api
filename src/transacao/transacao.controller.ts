import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { TransacaoDto } from './dto/transacao.dto';
import { CreateTransacaoDto } from './dto/createTransacao.dto';

@Controller('transacao')
export class TransacaoController {
    constructor(
        private readonly transacaoService: TransacaoService
    ) {}

    @Get('/')
    getTransacoes(): Object {
        return {};
    }

    @Get('/{id}')
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
}
