import { Injectable, UnauthorizedException } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {
        // Initialize Firebase Admin
        if (!getApps().length) {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        }
    }

    async verifyToken(idToken: string) {
        try {
            const decodedToken = await getAuth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async createOrUpdateUser(uid: string, email: string, name: string, photoURL?: string) {
        let user = await this.userService.findByFirebaseUid(uid);

        if (!user) {
            user = await this.userService.createFromFirebase({
                firebaseUid: uid,
                email,
                name: name || email.split('@')[0],
                avatar: photoURL,
            });
        }

        return user;
    }
}