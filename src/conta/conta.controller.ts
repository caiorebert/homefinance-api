import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ContaService } from './conta.service';
import { CreateContaDto } from './dto/createConta.dto';

@Controller('conta')
export class ContaController {

    constructor(
        @Inject(ContaService)
        private readonly contaService: ContaService
    ) {}

    @Post('/')
    getConta(@Body() createContaDTO: CreateContaDto): Object {
        return this.contaService.create(createContaDTO);
    }
}
