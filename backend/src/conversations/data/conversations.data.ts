import type { ConversationWithMessages } from '../models/conversation.model';

export const CONVERSATIONS_DATA: ConversationWithMessages[] = [
    {
        id: 'conv-fr-003',
        financing_request_id: 'fr-003',
        status: 'open',
        messages: [
            {
                id: 'msg-fr-003-1',
                conversation_id: 'conv-fr-003',
                senderType: 'analyst',
                content:
                    'Bonjour, nous avons besoin des trois derniers mois de releves bancaires complementaires pour finaliser l analyse.',
                createdAt: '2026-06-18T08:35:00.000Z',
            },
            {
                id: 'msg-fr-003-2',
                conversation_id: 'conv-fr-003',
                senderType: 'client',
                content:
                    'Bonjour, je peux vous transmettre les releves aujourd hui. Avez-vous un format prefere ?',
                createdAt: '2026-06-18T08:44:00.000Z',
            },
        ],
    },
];
