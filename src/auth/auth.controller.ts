import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: { email: string; password: string; name: string }) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto.email, loginDto.password);
    }
}