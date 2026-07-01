import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Issue extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'], default: 'BACKLOG' })
    status: string;

    @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' })
    priority: string;

    @Prop({ type: String, ref: 'Project' })
    project: string;

    @Prop({ type: String, ref: 'Sprint' })
    sprint?: string;

    @Prop({ type: String, ref: 'User' })
    assignee?: string;

    @Prop()
    labels?: string[];
}

export const IssueSchema = SchemaFactory.createForClass(Issue);