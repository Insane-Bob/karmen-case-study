export type DocumentType =
  | "liasse_fiscale"
  | "releve_bancaire";

export interface BaseDocument {
  id: string;
  name: string;
  type: DocumentType;
  company_id: string;
  financing_request_id: string;
}

export interface LiasseFiscaleMetadata {
  year: number;
}

export interface ReleveBancaireMetadata {
  bank: string;
  account: string;
  months_covered: number;
}

export interface DocumentMap {
  liasse_fiscale: LiasseFiscaleDocument;
  releve_bancaire: ReleveBancaireDocument;
}

export interface LiasseFiscaleDocument extends BaseDocument {
  type: "liasse_fiscale";
  metadata: LiasseFiscaleMetadata;
}

export interface ReleveBancaireDocument extends BaseDocument {
  type: "releve_bancaire";
  metadata: ReleveBancaireMetadata;
}

export type Document = DocumentMap[keyof DocumentMap];

// Si tu veux une liste de documents :
export type DocumentList = Document[];