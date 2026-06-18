import { Company } from './company.model';
import { Document } from './document.model';
import { FinancingRequest } from './financing-request.model';
import { Score } from './score.model';

export interface FinancingApplication {
    company: Company;
    financing_request: FinancingRequest;
    documents: Document[];
    score: Score;
}