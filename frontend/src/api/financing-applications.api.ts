import { apiUrl, encodeApiPathSegment } from "@/lib/api-url";
import {
    applyDecisionToFinancingApplication,
    applyDecisionsToFinancingApplications,
    saveFinancingDecision,
    type DecisionStatus,
} from "@/lib/financing-decisions";
import type { FinancingApplication } from "@/types/financing-applications";

const FINANCING_APPLICATIONS_API = apiUrl("/financing-applications");

export async function getFinancingApplications(): Promise<FinancingApplication[]> {
    const response = await fetch(FINANCING_APPLICATIONS_API);

    if (!response.ok) {
        throw new Error(`Failed to fetch financing applications: ${response.status}`);
    }

    const applications = (await response.json()) as FinancingApplication[];
    return applyDecisionsToFinancingApplications(applications);
}

export async function getFinancingApplicationById(
    id: string,
): Promise<FinancingApplication | null> {
    const encodedId = encodeApiPathSegment(id);
    const response = await fetch(
        `${FINANCING_APPLICATIONS_API}/${encodedId}`,
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Failed to fetch financing application ${id}: ${response.status}`,
        );
    }

    const application = (await response.json()) as FinancingApplication;
    return applyDecisionToFinancingApplication(application);
}

export async function setFinancingApplicationDecision(
    id: string,
    decision: {
        status: DecisionStatus;
        rejectedReason: string | null;
    },
): Promise<void> {
    saveFinancingDecision(id, decision);
}