import type {
    FinancingDocument,
    FinancingRequestStatus,
    FinancingRequestType,
    RiskBucket,
} from "@/types/financing-applications";

export const riskStyles: Record<RiskBucket, string> = {
    low: "uppercase bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    medium: "uppercase bg-amber-500/10 text-amber-700 border-amber-500/20",
    high: "uppercase bg-rose-500/10 text-rose-700 border-rose-500/20",
};

export function formatCurrencyEur(amount: number): string {
    return `${amount.toLocaleString("fr-FR")} €`;
}

export function formatDocumentType(type: FinancingDocument["type"]): string {
    return type.replaceAll("_", " ");
}

export function formatFinancingRequestType(type: FinancingRequestType): string {
    switch (type) {
        case "loan":
            return "Prêt";
        case "factoring":
            return "Affacturage";
        default:
            return type;
    }
}

export function formatFinancingRequestStatus(
    status: FinancingRequestStatus,
): string {
    switch (status) {
        case "pending_review":
            return "En attente de validation";
        case "approved":
            return "Approuvée";
        case "rejected":
            return "Refusée";
        case "in_progress":
            return "En cours";
        default:
            return status;
    }
}
