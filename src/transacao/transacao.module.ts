import { forwardRef, Module } from '@nestjs/common';
import { TransacaoController } from './transacao.controller';
import { TransacaoService } from './transacao.service';
import { UserModule } from 'src/user/user.module';
import { ContaModule } from 'src/conta/conta.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './transacao.entity';
import { CategoriaModule } from 'src/categoria/categoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transacao]),
    UserModule,
    forwardRef(() => ContaModule),
    forwardRef(() => CategoriaModule)
  ],
  controllers: [TransacaoController],
  providers: [TransacaoService],
  exports: [
    TransacaoService
  ]
})
export class TransacaoModule {}
