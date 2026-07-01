import { Injectable, NotFoundException } from '@nestjs/common';
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

        // Add organization to user's list
        await this.userService.addOrganization(userId, savedOrg._id.toString());

        return savedOrg;
    }

    async findById(id: string) {
        const org = await this.orgModel.findById(id).populate('members', 'name email');
        if (!org) throw new NotFoundException('Organization not found');
        return org;
    }

    async findByUser(userId: string) {
        return this.orgModel.find({ members: userId }).populate('members', 'name email');
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
}