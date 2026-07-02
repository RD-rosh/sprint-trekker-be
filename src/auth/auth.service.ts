import { Injectable, UnauthorizedException } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {
        // Initialize Firebase Admin
        if (!getApps().length) {
            try {
                const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
                if (!privateKey || !privateKey.includes('BEGIN PRIVATE KEY')) {
                    throw new Error('FIREBASE_PRIVATE_KEY is missing or is not a valid PEM private key string.');
                }
                initializeApp({
                    credential: cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey,
                    }),
                });
            } catch (error: any) {
                console.warn('⚠️ Firebase Admin SDK was not initialized:', error.message);
                console.warn('⚠️ Authentication verification endpoints will fail, but the server will boot.');
            }
        }
    }

    async verifyToken(idToken: string) {
        try {
            if (!getApps().length) {
                throw new Error('Firebase Admin SDK is not initialized');
            }
            const decodedToken = await getAuth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error: any) {
            throw new UnauthorizedException(error.message || 'Invalid token');
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