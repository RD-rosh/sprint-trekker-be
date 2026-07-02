import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { Sprint, SprintSchema } from './sprint.schema';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Sprint.name, schema: SprintSchema },
        ]),
        ProjectModule,
        AuthModule,
    ],
    controllers: [SprintController],
    providers: [SprintService],
    exports: [SprintService],
})
export class SprintModule { }
