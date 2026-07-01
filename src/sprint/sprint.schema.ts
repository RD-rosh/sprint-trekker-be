import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sprint extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    goal?: string;

    @Prop({ type: Date })
    startDate: Date;

    @Prop({ type: Date })
    endDate: Date;

    @Prop({ enum: ['planning', 'active', 'completed'], default: 'planning' })
    status: string;

    @Prop({ type: String, ref: 'Project' })
    project: string;

    @Prop({ type: [{ type: String, ref: 'Issue' }] })
    issues: string[];
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);