import type {
    FinancingApplication,
    FinancingRequestStatus,
} from "@/types/financing-applications";

const DECISIONS_STORAGE_KEY = "karmen-financing-decisions";

export type DecisionStatus = Extract<
    FinancingRequestStatus,
    "approved" | "rejected"
>;

export type FinancingDecision = {
    status: DecisionStatus;
    rejectedReason: string | null;
};

type DecisionsMap = Record<string, FinancingDecision>;

function canUseStorage(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readDecisionsMap(): DecisionsMap {
    if (!canUseStorage()) {
        return {};
    }

    const rawValue = window.localStorage.getItem(DECISIONS_STORAGE_KEY);
    if (!rawValue) {
        return {};
    }

    try {
        const parsed = JSON.parse(rawValue) as unknown;
        if (!parsed || typeof parsed !== "object") {
            return {};
        }

        return parsed as DecisionsMap;
    } catch {
        return {};
    }
}

function writeDecisionsMap(value: DecisionsMap): void {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(value));
}

export function saveFinancingDecision(
    financingRequestId: string,
    decision: FinancingDecision,
): void {
    const currentMap = readDecisionsMap();

    writeDecisionsMap({
        ...currentMap,
        [financingRequestId]: decision,
    });
}

export function applyDecisionToFinancingApplication(
    application: FinancingApplication,
): FinancingApplication {
    const decisionsMap = readDecisionsMap();
    const decision = decisionsMap[application.financing_request.id];

    if (!decision) {
        return application;
    }

    return {
        ...application,
        financing_request: {
            ...application.financing_request,
            status: decision.status,
            rejectedReason: decision.rejectedReason,
        },
    };
}

export function applyDecisionsToFinancingApplications(
    applications: FinancingApplication[],
): FinancingApplication[] {
    return applications.map(applyDecisionToFinancingApplication);
}
