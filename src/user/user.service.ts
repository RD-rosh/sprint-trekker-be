import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(createUserDto: { email: string; password: string; name: string }) {
        const { email, password, name } = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
        });

        return user.save();
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email: email.toLowerCase() });
    }

    async findById(id: string) {
        return this.userModel.findById(id).select('-password');
    }

    async addOrganization(userId: string, orgId: string) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $push: { organizations: orgId } },
            { new: true },
        );
    }
}