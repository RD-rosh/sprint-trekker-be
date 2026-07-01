import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { IssueService } from './issue.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('issues')
@UseGuards(FirebaseAuthGuard)
export class IssueController {
    constructor(private readonly issueService: IssueService) { }

    @Post()
    create(@Body() createIssueDto: any, @Req() req: any) {
        return this.issueService.create(createIssueDto, req.user._id.toString());
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.issueService.findByProject(projectId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.issueService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.issueService.remove(id);
    }
}