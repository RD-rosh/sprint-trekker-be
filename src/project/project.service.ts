import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>,
        private organizationService: OrganizationService,
    ) { }

    async create(createProjectDto: { name: string; description?: string; organizationId: string }, userId: string) {
        // Verify user has access to organization
        const org = await this.organizationService.findById(createProjectDto.organizationId);

        const project = new this.projectModel({
            name: createProjectDto.name,
            description: createProjectDto.description,
            organization: createProjectDto.organizationId,
        });

        const savedProject = await project.save();

        // Add project to organization
        await this.organizationService.addProject(org._id.toString(), savedProject._id.toString());

        return savedProject;
    }

    async findById(id: string) {
        const project = await this.projectModel
            .findById(id)
            .populate('organization')
            .populate('sprints')
            .populate('issues');

        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async findByUser(userId: string) {
        // Find projects where user is member of the organization
        return this.projectModel.find().populate('organization');
    }

    async addIssue(projectId: string, issueId: string) {
        return this.projectModel.findByIdAndUpdate(
            projectId,
            { $push: { issues: issueId } },
            { new: true }
        );
    }

    async addSprint(projectId: string, sprintId: string) {
        return this.projectModel.findByIdAndUpdate(
            projectId,
            { $push: { sprints: sprintId } },
            { new: true }
        );
    }

    async remove(id: string, userId: string) {
        const project = await this.findById(id);
        // Add permission check if needed
        return this.projectModel.findByIdAndDelete(id);
    }
}