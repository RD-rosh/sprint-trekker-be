import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Issue } from './issue.schema';
import { ProjectService } from '../project/project.service';

@Injectable()
export class IssueService {
    constructor(
        @InjectModel(Issue.name) private issueModel: Model<Issue>,
        private projectService: ProjectService,
    ) { }

    async create(createIssueDto: any, userId: string) {
        const issue = new this.issueModel({
            ...createIssueDto,
            assignee: createIssueDto.assignee || userId,
        });

        const savedIssue = await issue.save();

        // Link to project
        if (createIssueDto.project) {
            await this.projectService.addIssue(createIssueDto.project, savedIssue._id.toString());
        }

        return savedIssue;
    }

    async findByProject(projectId: string) {
        return this.issueModel
            .find({ project: projectId })
            .populate('assignee', 'name email avatar')
            .populate('sprint');
    }

    async update(id: string, updateData: any) {
        const issue = await this.issueModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('assignee');

        if (!issue) throw new NotFoundException('Issue not found');
        return issue;
    }

    async remove(id: string) {
        const issue = await this.issueModel.findByIdAndDelete(id);
        if (!issue) throw new NotFoundException('Issue not found');
        return issue;
    }

    async updateStatus(id: string, status: string) {
        return this.update(id, { status });
    }
}