import { Module } from '@nestjs/common';
import { ContaService } from './conta.service';
import { ContaController } from './conta.controller';
import { Conta } from './conta.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conta]),
    UserModule
  ],
  providers: [ContaService],
  controllers: [ContaController],
  exports: [ContaService],
})
export class ContaModule {}
