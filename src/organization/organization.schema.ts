import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: [{ type: String, ref: 'User' }] })
    members: string[];

    @Prop({ type: [{ type: String, ref: 'Project' }] })
    projects: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);