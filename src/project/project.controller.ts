import { Controller, Post, Get, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('projects')
@UseGuards(FirebaseAuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    create(@Body() createProjectDto: { name: string; description?: string; organizationId: string }, @Req() req: any) {
        return this.projectService.create(createProjectDto, req.user._id.toString());
    }

    @Get()
    findByOrg(@Req() req: any) {
        return this.projectService.findByUser(req.user._id.toString());
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findById(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.projectService.remove(id, req.user._id.toString());
    }
}