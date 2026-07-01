import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('sprints')
@UseGuards(FirebaseAuthGuard)
export class SprintController {
    constructor(private readonly sprintService: SprintService) { }

    @Post()
    create(@Body() createSprintDto: any, @Req() req: any) {
        return this.sprintService.create(createSprintDto, createSprintDto.project);
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.sprintService.findByProject(projectId);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.sprintService.updateStatus(id, status);
    }
}