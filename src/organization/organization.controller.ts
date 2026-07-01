import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('organizations')
@UseGuards(FirebaseAuthGuard)
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Post()
    create(@Body() createOrgDto: { name: string; description?: string }, @Req() req: any) {
        return this.organizationService.create(createOrgDto, req.user._id.toString());
    }

    @Get()
    findByUser(@Req() req: any) {
        return this.organizationService.findByUser(req.user._id.toString());
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.organizationService.findById(id);
    }
}