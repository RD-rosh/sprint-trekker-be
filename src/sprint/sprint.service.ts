import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint } from './sprint.schema';
import { ProjectService } from '../project/project.service';

@Injectable()
export class SprintService {
    constructor(
        @InjectModel(Sprint.name) private sprintModel: Model<Sprint>,
        private projectService: ProjectService,
    ) { }

    async create(createSprintDto: any, projectId: string) {
        const sprint = new this.sprintModel({
            ...createSprintDto,
            project: projectId,
        });

        const savedSprint = await sprint.save();

        // Link sprint to project
        await this.projectService.addSprint(projectId, savedSprint._id.toString());

        return savedSprint;
    }

    async findByProject(projectId: string) {
        return this.sprintModel
            .find({ project: projectId })
            .populate('issues')
            .sort({ startDate: -1 });
    }

    async findActive(projectId: string) {
        return this.sprintModel.findOne({
            project: projectId,
            status: 'active',
        });
    }

    async updateStatus(id: string, status: string) {
        const sprint = await this.sprintModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!sprint) throw new NotFoundException('Sprint not found');
        return sprint;
    }
}