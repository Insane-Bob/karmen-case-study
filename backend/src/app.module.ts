import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { FinancingApplicationsModule } from './financing-applications/financing-applications.module';

@Module({
  imports: [FinancingApplicationsModule, ConversationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
