export type FinancingRequestType =
  | "factoring"
  | "loan"
  | "leasing";

export type FinancingRequestStatus =
  | "pending_review"
  | "approved"
  | "rejected";

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