import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: [{ type: String, ref: 'User' }] })
    members: string[];           // Array of User IDs

    @Prop({ type: String, ref: 'User' })
    owner: string;               // Firebase User ID

    @Prop({ type: [{ type: String, ref: 'Project' }] })
    projects: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);