import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/user.entity';
import { ContaService } from 'src/conta/conta.service';
import { Conta } from 'src/conta/conta.entity';

@Injectable()
export class AuthService {

    constructor(
        @Inject()
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly contaService: ContaService
    ) {}

    async signIn(LoginDto : LoginDto): Promise<{ access_token: string, user: Object }> {
        const user = await this.userService.getUserByEmail(LoginDto.email);
        if (!user) {
            throw new Error('User not found');
        }

        const payload = { email: user.email, sub: user.id };

        const conta = await this.contaService.getContaByUserId(user.id);

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                algo: "teste",
                conta: conta
            },
        }
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.getUserByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            email: registerDto.email,
            password: hashedPassword,
            name: registerDto.name,
        });

        if (user) {
            await this.contaService.create({
                user_id: user.id,
                descricao: 'Conta Padrão',
                tipo: 'corrente',
            });
            return user;
        }

        throw new Error('Error creating user');
    }
}
