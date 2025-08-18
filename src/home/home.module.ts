import { forwardRef, Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TransacaoModule } from 'src/transacao/transacao.module';
import { ContaModule } from 'src/conta/conta.module';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [
    forwardRef(() => TransacaoModule),
    forwardRef(() => ContaModule)
  ],
})
export class HomeModule {}
