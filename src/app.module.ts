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
      url: process.env.POSTGRES_URL || 'postgres://postgres:1234@localhost:5432/homefinance',
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '1234',
      database: process.env.POSTGRES_DATABASE || 'homefinance',
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC === 'true' || true,
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
