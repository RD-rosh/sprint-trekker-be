import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: { email: string; password: string; name: string }) {
        const existingUser = await this.userService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new UnauthorizedException('User with this email already exists');
        }

        const user = await this.userService.create(createUserDto);

        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
}