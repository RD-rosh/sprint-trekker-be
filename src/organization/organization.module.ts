import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization, OrganizationSchema } from './organization.schema';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MailService } from '../mail/mail.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Organization.name, schema: OrganizationSchema },
        ]),
        UserModule,
        AuthModule,
    ],
    controllers: [OrganizationController],
    providers: [OrganizationService, MailService],
    exports: [OrganizationService],
})
export class OrganizationModule { }