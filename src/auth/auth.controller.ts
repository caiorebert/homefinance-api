import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('')
export class AuthController {

    constructor(
        @Inject()
        private readonly authService: AuthService
    ) {}

    @Post('/login')
    login(@Body() loginDto: LoginDto): Object {
        try {
            return this.authService.signIn(loginDto);
        } catch (error) {
            return { message: error.message };
        }
    }

    @Post('/register')
    register(@Body() registerDTO: RegisterDto): Object {
        try {
            return this.authService.register(registerDTO);
        } catch (error) {
            return { message: error.message };
        }
    }
}
