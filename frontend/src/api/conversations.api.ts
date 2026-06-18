import { apiUrl, encodeApiPathSegment } from "@/lib/api-url";
import type {
    ConversationStatus,
    ConversationWithMessages,
    MessageSenderType,
} from "@/types/conversations";

const CONVERSATIONS_API = apiUrl("/conversations");

export async function getConversationByFinancingRequestId(
    financingRequestId: string,
): Promise<ConversationWithMessages> {
    const encodedFinancingRequestId = encodeApiPathSegment(financingRequestId);
    const response = await fetch(
        `${CONVERSATIONS_API}/${encodedFinancingRequestId}`,
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch conversation ${financingRequestId}: ${response.status}`,
        );
    }

    return response.json() as Promise<ConversationWithMessages>;
}

export async function createConversationMessage(
    financingRequestId: string,
    payload: {
        senderType: MessageSenderType;
        content: string;
    },
): Promise<ConversationWithMessages> {
    const encodedFinancingRequestId = encodeApiPathSegment(financingRequestId);
    const response = await fetch(
        `${CONVERSATIONS_API}/${encodedFinancingRequestId}/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to create conversation message for ${financingRequestId}: ${response.status}`,
        );
    }

    return response.json() as Promise<ConversationWithMessages>;
}

export async function updateConversationStatus(
    financingRequestId: string,
    status: ConversationStatus,
): Promise<ConversationWithMessages> {
    const encodedFinancingRequestId = encodeApiPathSegment(financingRequestId);
    const response = await fetch(
        `${CONVERSATIONS_API}/${encodedFinancingRequestId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to update conversation status for ${financingRequestId}: ${response.status}`,
        );
    }

    return response.json() as Promise<ConversationWithMessages>;
}
