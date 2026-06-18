export type RiskBucket = 'low' | 'medium' | 'high';

export interface Score {
    id: string;
    financing_request_id: string;
    risk_bucket: RiskBucket;
    global_score: number;
}