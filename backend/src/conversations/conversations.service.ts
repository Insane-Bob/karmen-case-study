import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FinancingApplicationsService } from '../financing-applications/financing-applications.service';
import { CONVERSATIONS_DATA } from './data/conversations.data';
import type {
    ConversationStatus,
    ConversationWithMessages,
    Message,
    MessageSenderType,
} from './models/conversation.model';

type CreateMessageInput = {
    senderType: MessageSenderType;
    content: string;
};

@Injectable()
export class ConversationsService {
    private readonly data = new Map<string, ConversationWithMessages>(
        CONVERSATIONS_DATA.map((conversation) => [
            conversation.financing_request_id,
            conversation,
        ]),
    );

    constructor(
        private readonly financingApplicationsService: FinancingApplicationsService,
    ) { }

    findByFinancingRequestId(financingRequestId: string): ConversationWithMessages {
        this.assertRequestExists(financingRequestId);
        return this.getOrCreate(financingRequestId);
    }

    createMessage(
        financingRequestId: string,
        input: CreateMessageInput,
    ): ConversationWithMessages {
        this.assertRequestExists(financingRequestId);

        const conversation = this.getOrCreate(financingRequestId);
        const content = input.content.trim();

        if (content.length === 0) {
            return conversation;
        }

        const message: Message = {
            id: `msg-${randomUUID()}`,
            conversation_id: conversation.id,
            senderType: input.senderType,
            content,
            createdAt: new Date().toISOString(),
        };

        const updatedConversation: ConversationWithMessages = {
            ...conversation,
            status: 'open',
            messages: [...conversation.messages, message],
        };

        this.data.set(financingRequestId, updatedConversation);
        return updatedConversation;
    }

    updateStatus(
        financingRequestId: string,
        status: ConversationStatus,
    ): ConversationWithMessages {
        this.assertRequestExists(financingRequestId);
        const conversation = this.getOrCreate(financingRequestId);

        const updatedConversation: ConversationWithMessages = {
            ...conversation,
            status,
        };

        this.data.set(financingRequestId, updatedConversation);
        return updatedConversation;
    }

    private assertRequestExists(financingRequestId: string): void {
        const request = this.financingApplicationsService.findOne(financingRequestId);
        if (!request) {
            throw new NotFoundException(
                `Financing request ${financingRequestId} was not found`,
            );
        }
    }

    private getOrCreate(financingRequestId: string): ConversationWithMessages {
        const existing = this.data.get(financingRequestId);
        if (existing) {
            return existing;
        }

        const conversation: ConversationWithMessages = {
            id: `conv-${randomUUID()}`,
            financing_request_id: financingRequestId,
            status: 'closed',
            messages: [],
        };

        this.data.set(financingRequestId, conversation);
        return conversation;
    }
}
