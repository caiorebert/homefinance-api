import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { BalancoService } from './balanco.service';

@Controller('balanco')
export class BalancoController {
    constructor(
        @Inject()
        private readonly balancoService: BalancoService,
    ) {}

    @Post('/')
    async calcularBalanco(@Body() body): Promise<Object> {
        try {
            return await this.balancoService.calcularBalanco(body.user_id, body.month, body.year);
        } catch (error) {
            return { message: error.message };
        }
    }
}
