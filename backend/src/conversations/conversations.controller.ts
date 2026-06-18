import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import type {
    ConversationStatus,
    MessageSenderType,
} from './models/conversation.model';

type CreateMessageBody = {
    senderType: MessageSenderType;
    content: string;
};

type UpdateConversationStatusBody = {
    status: ConversationStatus;
};

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @Get(':financingRequestId')
    findByFinancingRequestId(
        @Param('financingRequestId') financingRequestId: string,
    ) {
        return this.conversationsService.findByFinancingRequestId(financingRequestId);
    }

    @Post(':financingRequestId/messages')
    createMessage(
        @Param('financingRequestId') financingRequestId: string,
        @Body() body: CreateMessageBody,
    ) {
        return this.conversationsService.createMessage(financingRequestId, body);
    }

    @Patch(':financingRequestId/status')
    updateStatus(
        @Param('financingRequestId') financingRequestId: string,
        @Body() body: UpdateConversationStatusBody,
    ) {
        return this.conversationsService.updateStatus(financingRequestId, body.status);
    }
}
