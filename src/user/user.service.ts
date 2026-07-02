import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createFromFirebase(data: {
        firebaseUid: string;
        email: string;
        name: string;
        avatar?: string;
    }) {
        const user = new this.userModel({
            firebaseUid: data.firebaseUid,
            email: data.email.toLowerCase(),
            name: data.name,
            avatar: data.avatar,
        });

        return user.save();
    }

    async findByFirebaseUid(firebaseUid: string) {
        return this.userModel.findOne({ firebaseUid });
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email: email.toLowerCase() });
    }

    async findById(id: string) {
        return this.userModel.findById(id).select('-__v');
    }

    async addOrganization(userId: string, orgId: string) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $push: { organizations: orgId } },
            { new: true },
        );
    }
}