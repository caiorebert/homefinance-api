import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './home/home.module';
import { TransacaoModule } from './transacao/transacao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContaModule } from './conta/conta.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'homefinance',
      type: 'postgres',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ]
    }),
    HomeModule,
    TransacaoModule,
    AuthModule,
    UserModule,
    ContaModule,
    CategoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    HomeModule,
    TransacaoModule,
    AuthModule,
    UserModule,
    ContaModule,
    CategoriaModule,
  ],
})
export class AppModule {}
