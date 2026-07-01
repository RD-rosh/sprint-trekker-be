import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    avatar?: string;

    @Prop({ type: [{ type: String, ref: 'Organization' }] })
    organizations: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);