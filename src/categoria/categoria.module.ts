import { forwardRef, Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { Categoria } from './categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransacaoModule } from 'src/transacao/transacao.module';

@Module({
    controllers: [CategoriaController],
    providers: [CategoriaService],
    exports: [CategoriaService],
    imports: [
        TypeOrmModule.forFeature([Categoria]),
        forwardRef(() => TransacaoModule)
    ],
})
export class CategoriaModule {}
