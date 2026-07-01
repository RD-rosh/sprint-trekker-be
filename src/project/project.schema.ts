import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: String, ref: 'Organization' })
    organization: string;

    @Prop({ type: [{ type: String, ref: 'Sprint' }] })
    sprints: string[];

    @Prop({ type: [{ type: String, ref: 'Issue' }] })
    issues: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);