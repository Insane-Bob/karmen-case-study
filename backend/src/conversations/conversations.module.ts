import { Module } from '@nestjs/common';
import { FinancingApplicationsModule } from '../financing-applications/financing-applications.module';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
    imports: [FinancingApplicationsModule],
    controllers: [ConversationsController],
    providers: [ConversationsService],
})
export class ConversationsModule { }
