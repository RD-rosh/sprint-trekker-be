import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const idToken = authHeader.split('Bearer ')[1];

        try {
            const decodedToken = await this.authService.verifyToken(idToken);
            const user = await this.authService.createOrUpdateUser(
                decodedToken.uid,
                decodedToken.email!,
                decodedToken.name || '',
                decodedToken.picture
            );

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }
}