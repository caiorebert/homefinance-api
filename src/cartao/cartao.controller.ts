import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { CartaoService } from './cartao.service';
import { CreateCartaoDto } from './dto/createCartao.dto';
import { UpdateCartaoDto } from './dto/updateCartao.dto';

@Controller('cartao')
export class CartaoController {
    constructor(
        @Inject()
        private readonly cartaoService: CartaoService
    ) {}

    @Get()
    findAll() {
        return this.cartaoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cartaoService.findOne(+id);
    }

    @Post()
    create(@Body() createCartaoDto: CreateCartaoDto) {
        return this.cartaoService.create(createCartaoDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCartaoDto: UpdateCartaoDto) {
        return this.cartaoService.update(+id, updateCartaoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cartaoService.remove(+id);
    }
}
