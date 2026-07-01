import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body('idToken') idToken: string) {
        const decodedToken = await this.authService.verifyToken(idToken);

        const user = await this.authService.createOrUpdateUser(
            decodedToken.uid,
            decodedToken.email!,
            decodedToken.name || '',
            decodedToken.picture
        );

        return { user, firebaseToken: idToken };
    }
}