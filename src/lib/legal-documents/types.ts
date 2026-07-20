export type DocumentStatus =
  | "con-hieu-luc"
  | "het-hieu-luc"
  | "chua-co-hieu-luc"
  | "sua-doi-bo-sung";

export type SearchMatchMode = "all" | "exact";

export type SearchInField = "all" | "number" | "summary";

export type DocumentListMode = "all" | "new" | "effective" | "expired";

export type LegalDocumentSection = {
  id: string;
  label: string;
  title?: string;
  content?: string;
  children?: LegalDocumentSection[];
};

export type LegalDocument = {
  slug: string;
  number: string;
  docType: string;
  title: string;
  issuer: string;
  field: string;
  status: DocumentStatus;
  issuedDate: string;
  effectiveDate?: string;
  expiredDate?: string;
  signer?: string;
  sourceUrl?: string;
  sections: LegalDocumentSection[];
  relatedSlugs?: string[];
};

export type LegalDocumentFilters = {
  q?: string;
  matchMode?: SearchMatchMode;
  searchIn?: SearchInField;
  docType?: string;
  issuer?: string;
  field?: string;
  status?: DocumentStatus;
  year?: string;
  listMode?: DocumentListMode;
  advancedOpen?: boolean;
};

export type TaxonomyItem = {
  id: string;
  label: string;
};
