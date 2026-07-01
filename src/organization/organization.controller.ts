import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
    constructor(private organizationService: OrganizationService) { }

    @Post()
    async create(@Body() createOrgDto: { name: string; description?: string }, @Request() req) {
        return this.organizationService.create(createOrgDto, req.user.id);
    }

    @Get()
    async findByUser(@Request() req) {
        return this.organizationService.findByUser(req.user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.organizationService.findById(id);
    }
}