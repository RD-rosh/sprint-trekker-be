import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('sprints')
@UseGuards(FirebaseAuthGuard)
export class SprintController {
    constructor(private readonly sprintService: SprintService) { }

    @Post()
    create(@Body() createSprintDto: { name: string; description?: string; projectId: string }, @Req() req: any) {
        return this.sprintService.create(createSprintDto, req.user._id.toString());
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.sprintService.findByProject(projectId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.sprintService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sprintService.remove(id);
    }
}