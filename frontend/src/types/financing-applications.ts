export type RiskBucket = "low" | "medium" | "high";
export type FinancingRequestType = "loan" | "factoring" | (string & {});
export type FinancingRequestStatus =
    | "pending_review"
    | "approved"
    | "rejected"
    | "in_progress"
    | (string & {});

export interface Company {
    id: string;
    name: string;
    siren: string;
    businessType: string;
    legalCategory: string;
    codeNaf: string;
    creationDate: string;
    address: string;
    countryCode: string;
    postalCode: string;
    owner: string;
}

export interface FinancingRequest {
    id: string;
    type: FinancingRequestType;
    status: FinancingRequestStatus;
    company_id: string;
    fundUsage: string;
    rejectedReason: string | null;
    amount: number;
    durationInMonth: number;
    interestRate: number;
}

export interface FinancingScore {
    id: string;
    financing_request_id: string;
    risk_bucket: RiskBucket;
    global_score: number;
}

export interface FinancingDocument {
    id: string;
    name: string;
    type: string;
}

export interface FinancingApplication {
    company: Company;
    financing_request: FinancingRequest;
    score: FinancingScore;
    documents: FinancingDocument[];
}
