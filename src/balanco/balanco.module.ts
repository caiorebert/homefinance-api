import { forwardRef, Module } from '@nestjs/common';
import { BalancoService } from './balanco.service';
import { BalancoController } from './balanco.controller';
import { TransacaoModule } from 'src/transacao/transacao.module';
import { ContaModule } from 'src/conta/conta.module';

@Module({
  imports: [
    forwardRef(() =>TransacaoModule),
    forwardRef(() => ContaModule)
  ],
  providers: [BalancoService],
  controllers: [BalancoController],
})
export class BalancoModule {}
