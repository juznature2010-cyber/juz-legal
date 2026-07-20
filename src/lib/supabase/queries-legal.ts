import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LegalDocument, LegalDocumentSection } from "@/lib/legal-documents/types";
import { buildSectionTree } from "@/lib/vbpl/repository";
import { legalDocuments as staticDocuments } from "@/lib/legal-documents/documents";

type DbDocument = {
  id: string;
  slug: string;
  number: string;
  doc_type: string;
  title: string;
  issuer: string;
  field: string;
  status: LegalDocument["status"];
  issued_date: string | null;
  effective_date: string | null;
  expired_date: string | null;
  signer: string | null;
  source_url: string | null;
  synced_at: string | null;
};

function mapDocument(row: DbDocument, sections: LegalDocumentSection[]): LegalDocument {
  return {
    slug: row.slug,
    number: row.number,
    docType: row.doc_type,
    title: row.title,
    issuer: row.issuer,
    field: row.field,
    status: row.status,
    issuedDate: row.issued_date ?? "",
    effectiveDate: row.effective_date ?? undefined,
    expiredDate: row.expired_date ?? undefined,
    signer: row.signer ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    sections,
  };
}

export async function getLegalDocumentsFromDb(): Promise<LegalDocument[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: docs, error } = await supabase
    .from("legal_documents")
    .select("*")
    .order("issued_date", { ascending: false, nullsFirst: false });

  if (error || !docs?.length) return [];

  const docIds = docs.map((doc) => doc.id);
  const { data: sectionRows } = await supabase
    .from("legal_document_sections")
    .select("*")
    .in("document_id", docIds)
    .order("sort_order", { ascending: true });

  const sectionsByDoc = new Map<string, LegalDocumentSection[]>();
  for (const doc of docs) {
    const rows = (sectionRows ?? []).filter((row) => row.document_id === doc.id);
    sectionsByDoc.set(doc.id, buildSectionTree(rows));
  }

  return (docs as DbDocument[]).map((doc) =>
    mapDocument(doc, sectionsByDoc.get(doc.id) ?? [])
  );
}

export async function getLegalDocumentBySlugFromDb(
  slug: string
): Promise<LegalDocument | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !doc) return null;

  const { data: sectionRows } = await supabase
    .from("legal_document_sections")
    .select("*")
    .eq("document_id", doc.id)
    .order("sort_order", { ascending: true });

  const { data: relations } = await supabase
    .from("legal_document_relations")
    .select("related_document_id")
    .eq("document_id", doc.id);

  const relatedSlugs: string[] = [];
  if (relations?.length) {
    const relatedIds = relations.map((row) => row.related_document_id);
    const { data: relatedDocs } = await supabase
      .from("legal_documents")
      .select("slug")
      .in("id", relatedIds);
    relatedSlugs.push(...(relatedDocs?.map((row) => row.slug) ?? []));
  }

  const mapped = mapDocument(doc as DbDocument, buildSectionTree(sectionRows ?? []));
  return relatedSlugs.length ? { ...mapped, relatedSlugs } : mapped;
}

export async function getLegalDocumentsWithFallback(): Promise<LegalDocument[]> {
  const fromDb = await getLegalDocumentsFromDb();
  return fromDb.length ? fromDb : staticDocuments;
}

export async function getLegalDocumentWithFallback(
  slug: string
): Promise<LegalDocument | null> {
  const fromDb = await getLegalDocumentBySlugFromDb(slug);
  if (fromDb) return fromDb;
  return staticDocuments.find((doc) => doc.slug === slug) ?? null;
}

export async function getLegalLibraryStats() {
  const admin = createAdminClient();
  if (!admin) {
    return {
      documentCount: staticDocuments.length,
      queuePending: 0,
      lastJob: null as null | {
        id: string;
        status: string;
        success_count: number;
        error_count: number;
        completed_at: string | null;
        ai_model: string | null;
      },
    };
  }

  const [docs, queue, jobs] = await Promise.all([
    admin.from("legal_documents").select("id", { count: "exact", head: true }),
    admin
      .from("vbpl_sync_queue")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "failed"]),
    admin
      .from("vbpl_sync_jobs")
      .select("id, status, success_count, error_count, completed_at, ai_model, created_at")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  return {
    documentCount: docs.count ?? 0,
    queuePending: queue.count ?? 0,
    lastJob: jobs.data?.[0] ?? null,
  };
}

export async function getRecentSyncJobs(limit = 10) {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data } = await admin
    .from("vbpl_sync_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getSyncQueue(limit = 20) {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data } = await admin
    .from("vbpl_sync_queue")
    .select("*")
    .order("scheduled_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
