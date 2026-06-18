export type MessageSenderType = 'analyst' | 'client';
export type ConversationStatus = 'open' | 'closed';

export interface Message {
    id: string;
    conversation_id: string;
    senderType: MessageSenderType;
    content: string;
    createdAt: string;
}

export interface ConversationWithMessages {
    id: string;
    financing_request_id: string;
    status: ConversationStatus;
    messages: Message[];
}