import { Module } from '@nestjs/common';
import { CartaoController } from './cartao.controller';
import { CartaoService } from './cartao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cartao } from './cartao.entity';

@Module({
  exports: [CartaoService],
  controllers: [CartaoController],
  providers: [CartaoService],
  imports: [
    TypeOrmModule.forFeature([Cartao])
  ],
})
export class CartaoModule {}
