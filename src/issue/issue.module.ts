import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { Issue, IssueSchema } from './issue.schema';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Issue.name, schema: IssueSchema },
        ]),
        ProjectModule,
        AuthModule,
    ],
    controllers: [IssueController],
    providers: [IssueService],
    exports: [IssueService],
})
export class IssueModule { }
