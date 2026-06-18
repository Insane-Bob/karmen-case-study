import { FinancingApplication } from "../models/financing-application.model";

export const FINANCING_APPLICATIONS_DATA: FinancingApplication[] = [
    {
        company: {
            id: 'c-004',
            name: 'Fleurs de Saison',
            siren: '845612378',
            businessType: 'Fleuriste',
            legalCategory: 'EURL',
            codeNaf: '4776Z',
            creationDate: '2020-02-10',
            address: '24 avenue Jean Jaurès, Lyon',
            countryCode: 'FR',
            postalCode: '69007',
            owner: 'Sophie Martin',
        },
        financing_request: {
            id: 'fr-004',
            type: 'factoring',
            status: 'pending_review',
            company_id: 'c-004',
            fundUsage: "Stock saisonnier (fêtes de fin d'année)",
            rejectedReason: null,
            amount: 12000,
            durationInMonth: 9,
            interestRate: 4.5,
        },
        documents: [
            {
                id: 'd-010',
                name: 'Liasse fiscale 2023',
                type: 'liasse_fiscale',
                company_id: 'c-004',
                financing_request_id: 'fr-004',
                metadata: { year: 2023 },
            },
        ],
        score: {
            id: 's-004',
            financing_request_id: 'fr-004',
            risk_bucket: 'medium',
            global_score: 67,
        },
    },
    {
        "company": {
            "id": "c-003",
            "name": "Transport Leclerc Express",
            "siren": "756789012",
            "businessType": "Transport routier",
            "legalCategory": "SA",
            "codeNaf": "4941A",
            "creationDate": "2015-06-20",
            "address": "ZI Les Platanes, Creil",
            "countryCode": "FR",
            "postalCode": "60100",
            "owner": "Jean-Marc Leclerc"
        },
        "financing_request": {
            "id": "fr-003",
            "type": "loan",
            "status": "pending_review",
            "company_id": "c-003",
            "fundUsage": "Renouvellement flotte véhicules",
            "rejectedReason": null,
            "amount": 75000,
            "durationInMonth": 18,
            "interestRate": 7.8
        },
        "documents": [
            { "id": "d-006", "name": "Liasse fiscale 2023", "type": "liasse_fiscale", "company_id": "c-003", "financing_request_id": "fr-003", "metadata": { "year": 2023 } },
            { "id": "d-007", "name": "Liasse fiscale 2024", "type": "liasse_fiscale", "company_id": "c-003", "financing_request_id": "fr-003", "metadata": { "year": 2024 } },
            { "id": "d-008", "name": "Relevés SG janv-déc 2024", "type": "releve_bancaire", "company_id": "c-003", "financing_request_id": "fr-003", "metadata": { "bank": "Société Générale", "account": "FR7620041000001", "months_covered": 12 } },
            { "id": "d-009", "name": "Relevés BNP janv-déc 2024", "type": "releve_bancaire", "company_id": "c-003", "financing_request_id": "fr-003", "metadata": { "bank": "BNP Paribas", "account": "FR7630004000002", "months_covered": 12 } }
        ],
        "score": {
            "id": "s-003",
            "financing_request_id": "fr-003",
            "risk_bucket": "high",
            "global_score": 34
        }
    },
    {
        "company": {
            "id": "c-001",
            "name": "Brasserie du Marais",
            "siren": "823456789",
            "businessType": "Restaurant",
            "legalCategory": "SARL",
            "codeNaf": "5610A",
            "creationDate": "2018-03-15",
            "address": "12 rue des Archives, Paris",
            "countryCode": "FR",
            "postalCode": "75003",
            "owner": "Marie Dupont"
        },
        "financing_request": {
            "id": "fr-001",
            "type": "loan",
            "status": "pending_review",
            "company_id": "c-001",
            "fundUsage": "Achat équipement cuisine",
            "rejectedReason": null,
            "amount": 35000,
            "durationInMonth": 12,
            "interestRate": 5.2
        },
        "documents": [
            { "id": "d-001", "name": "Liasse fiscale 2023", "type": "liasse_fiscale", "company_id": "c-001", "financing_request_id": "fr-001", "metadata": { "year": 2023 } },
            { "id": "d-002", "name": "Liasse fiscale 2024", "type": "liasse_fiscale", "company_id": "c-001", "financing_request_id": "fr-001", "metadata": { "year": 2024 } },
            { "id": "d-003", "name": "Relevés Crédit Agricole janv-déc 2024", "type": "releve_bancaire", "company_id": "c-001", "financing_request_id": "fr-001", "metadata": { "bank": "Crédit Agricole", "account": "FR7612345000001", "months_covered": 12 } }
        ],
        "score": {
            "id": "s-001",
            "financing_request_id": "fr-001",
            "risk_bucket": "low",
            "global_score": 82
        }
    },
    {
        "company": {
            "id": "c-002",
            "name": "Studio Pixel",
            "siren": "912345678",
            "businessType": "Agence digitale",
            "legalCategory": "SAS",
            "codeNaf": "6201Z",
            "creationDate": "2021-09-01",
            "address": "8 rue de la Roquette, Paris",
            "countryCode": "FR",
            "postalCode": "75011",
            "owner": "Thomas Renard"
        },
        "financing_request": {
            "id": "fr-002",
            "type": "loan",
            "status": "pending_review",
            "company_id": "c-002",
            "fundUsage": "Trésorerie",
            "rejectedReason": null,
            "amount": 20000,
            "durationInMonth": 6,
            "interestRate": 6.1
        },
        "documents": [
            { "id": "d-004", "name": "Liasse fiscale 2024", "type": "liasse_fiscale", "company_id": "c-002", "financing_request_id": "fr-002", "metadata": { "year": 2024 } },
            { "id": "d-005", "name": "Relevés BNP mars-août 2024", "type": "releve_bancaire", "company_id": "c-002", "financing_request_id": "fr-002", "metadata": { "bank": "BNP Paribas", "account": "FR7630004000001", "months_covered": 6 } }
        ],
        "score": {
            "id": "s-002",
            "financing_request_id": "fr-002",
            "risk_bucket": "medium",
            "global_score": 58
        }
    },
];