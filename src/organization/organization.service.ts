import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from './organization.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectModel(Organization.name) private orgModel: Model<Organization>,
        private userService: UserService,
    ) { }

    async create(createOrgDto: { name: string; description?: string }, userId: string) {
        const org = new this.orgModel({
            name: createOrgDto.name,
            description: createOrgDto.description,
            owner: userId,
            members: [userId],
        });

        const savedOrg = await org.save();

        // Link organization to user
        await this.userService.addOrganization(userId, savedOrg._id.toString());

        return savedOrg;
    }

    async findById(id: string) {
        const org = await this.orgModel
            .findById(id)
            .populate('members', 'name email avatar')
            .populate('owner', 'name email avatar')
            .populate('projects', 'name description');

        if (!org) throw new NotFoundException('Organization not found');
        return org;
    }

    async findByUser(userId: string) {
        return this.orgModel
            .find({ members: userId })
            .populate('members', 'name email avatar')
            .populate('owner', 'name email avatar')
            .populate('projects', 'name description');
    }

    async addMember(orgId: string, memberId: string) {
        const org = await this.findById(orgId);
        if (!org.members.includes(memberId)) {
            org.members.push(memberId);
            await org.save();

            await this.userService.addOrganization(memberId, orgId);
        }
        return org;
    }

    async addProject(orgId: string, projectId: string) {
        return this.orgModel.findByIdAndUpdate(
            orgId,
            { $push: { projects: projectId } },
            { new: true }
        );
    }

    async inviteByEmail(orgId: string, email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException(`No user found with email ${email}`);

        const org = await this.orgModel.findById(orgId);
        if (!org) throw new NotFoundException('Organization not found');

        const userId = user._id.toString();
        if (org.members.includes(userId as any)) {
            throw new BadRequestException('User is already a member');
        }

        org.members.push(userId as any);
        await org.save();
        await this.userService.addOrganization(userId, orgId);

        return this.findById(orgId);
    }

    async removeMember(orgId: string, userId: string) {
        const org = await this.orgModel.findByIdAndUpdate(
            orgId,
            { $pull: { members: userId } },
            { new: true }
        )
            .populate('members', 'name email avatar')
            .populate('owner', 'name email avatar')
            .populate('projects', 'name description');

        if (!org) throw new NotFoundException('Organization not found');
        return org;
    }
}