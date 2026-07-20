import type {
  LegalDocument,
  LegalDocumentFilters,
  SearchInField,
  SearchMatchMode,
} from "./types";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

function matchesQuery(
  doc: LegalDocument,
  query: string,
  matchMode: SearchMatchMode,
  searchIn: SearchInField
) {
  const fields: string[] = [];
  if (searchIn === "all" || searchIn === "number") {
    fields.push(doc.number, doc.docType);
  }
  if (searchIn === "all" || searchIn === "summary") {
    fields.push(doc.title);
  }
  if (searchIn === "all") {
    fields.push(
      ...doc.sections.flatMap((section) => [
        section.label,
        section.title ?? "",
        section.content ?? "",
        ...(section.children?.flatMap((child) => [
          child.label,
          child.title ?? "",
          child.content ?? "",
        ]) ?? []),
      ])
    );
  }

  const haystack = normalizeText(fields.join(" "));
  const needle = normalizeText(query);
  if (!needle) return true;

  if (matchMode === "exact") {
    return haystack.includes(needle);
  }

  const tokens = tokenize(query);
  return tokens.every((token) => haystack.includes(token));
}

function isInCurrentMonth(date?: string) {
  if (!date) return false;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth()
  );
}

function isRecentDocument(doc: LegalDocument, days = 120) {
  const issued = new Date(doc.issuedDate);
  if (Number.isNaN(issued.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return issued >= cutoff;
}

export function filterLegalDocuments(
  documents: LegalDocument[],
  filters: LegalDocumentFilters
) {
  const {
    q = "",
    matchMode = "all",
    searchIn = "all",
    docType,
    issuer,
    field,
    status,
    year,
    listMode = "all",
  } = filters;

  return documents
    .filter((doc) => matchesQuery(doc, q, matchMode, searchIn))
    .filter((doc) => !docType || doc.docType === docType)
    .filter((doc) => !issuer || doc.issuer === issuer)
    .filter((doc) => !field || doc.field === field)
    .filter((doc) => !status || doc.status === status)
    .filter((doc) => {
      if (!year) return true;
      return doc.issuedDate.startsWith(`${year}-`);
    })
    .filter((doc) => {
      switch (listMode) {
        case "new":
          return isRecentDocument(doc);
        case "effective":
          return isInCurrentMonth(doc.effectiveDate);
        case "expired":
          return doc.status === "het-hieu-luc" || isInCurrentMonth(doc.expiredDate);
        default:
          return true;
      }
    })
    .sort(
      (a, b) =>
        new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
    );
}

export function countDocumentsByType(documents: LegalDocument[]) {
  return documents.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.docType] = (acc[doc.docType] ?? 0) + 1;
    return acc;
  }, {});
}

export function countDocumentsByField(documents: LegalDocument[]) {
  return documents.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.field] = (acc[doc.field] ?? 0) + 1;
    return acc;
  }, {});
}

export function getLegalDocument(slug: string, documents: LegalDocument[]) {
  return documents.find((doc) => doc.slug === slug);
}

export function getRelatedDocuments(
  doc: LegalDocument,
  documents: LegalDocument[],
  limit = 5
) {
  const relatedIds = new Set(doc.relatedSlugs ?? []);
  return documents
    .filter(
      (item) =>
        item.slug !== doc.slug &&
        (relatedIds.has(item.slug) ||
          item.field === doc.field ||
          item.docType === doc.docType)
    )
    .slice(0, limit);
}

export function getIssueYears(documents: LegalDocument[]) {
  const years = new Set<string>();
  for (const doc of documents) {
    years.add(doc.issuedDate.slice(0, 4));
  }
  return [...years].sort((a, b) => Number(b) - Number(a));
}
