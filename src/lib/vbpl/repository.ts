import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtractedDocument } from "@/lib/vbpl/ai-extractor";
import type { LegalDocumentSection } from "@/lib/legal-documents/types";

type DbSectionRow = {
  id: string;
  document_id: string;
  parent_id: string | null;
  section_key: string;
  label: string;
  title: string | null;
  content: string | null;
  sort_order: number;
};

export function flattenSections(
  sections: LegalDocumentSection[],
  parentKey?: string
): Array<{
  section_key: string;
  parent_key?: string;
  label: string;
  title?: string;
  content?: string;
  sort_order: number;
}> {
  const rows: Array<{
    section_key: string;
    parent_key?: string;
    label: string;
    title?: string;
    content?: string;
    sort_order: number;
  }> = [];

  sections.forEach((section, index) => {
    rows.push({
      section_key: section.id,
      parent_key: parentKey,
      label: section.label,
      title: section.title,
      content: section.content,
      sort_order: index,
    });
    if (section.children?.length) {
      rows.push(...flattenSections(section.children, section.id));
    }
  });

  return rows;
}

export function buildSectionTree(rows: DbSectionRow[]): LegalDocumentSection[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const nodes = new Map<
    string,
    LegalDocumentSection & { children: LegalDocumentSection[] }
  >();

  for (const row of rows) {
    nodes.set(row.section_key, {
      id: row.section_key,
      label: row.label,
      title: row.title ?? undefined,
      content: row.content ?? undefined,
      children: [],
    });
  }

  const roots: LegalDocumentSection[] = [];
  for (const row of rows.sort((a, b) => a.sort_order - b.sort_order)) {
    const node = nodes.get(row.section_key)!;
    if (row.parent_id) {
      const parentRow = byId.get(row.parent_id);
      if (parentRow && nodes.has(parentRow.section_key)) {
        nodes.get(parentRow.section_key)!.children.push(node);
        continue;
      }
    }
    roots.push(node);
  }

  return roots.map(stripEmptyChildren);
}

function stripEmptyChildren(
  section: LegalDocumentSection & { children?: LegalDocumentSection[] }
): LegalDocumentSection {
  const { children, ...rest } = section;
  if (children?.length) {
    return { ...rest, children: children.map(stripEmptyChildren) };
  }
  return rest;
}

export async function upsertExtractedDocument(
  supabase: SupabaseClient,
  extracted: ExtractedDocument,
  meta: {
    sourceUrl: string;
    vbplItemId: string;
    rawHtml?: string;
    aiModel?: string;
  }
) {
  const now = new Date().toISOString();
  const { data: docRow, error: docError } = await supabase
    .from("legal_documents")
    .upsert(
      {
        slug: extracted.slug,
        number: extracted.number,
        doc_type: extracted.docType,
        title: extracted.title,
        issuer: extracted.issuer,
        field: extracted.field,
        status: extracted.status,
        issued_date: extracted.issuedDate ?? null,
        effective_date: extracted.effectiveDate ?? null,
        expired_date: extracted.expiredDate ?? null,
        signer: extracted.signer ?? null,
        source_url: meta.sourceUrl,
        vbpl_item_id: meta.vbplItemId,
        raw_html: meta.rawHtml ?? null,
        ai_model: meta.aiModel ?? null,
        synced_at: now,
        updated_at: now,
      },
      { onConflict: "vbpl_item_id" }
    )
    .select("id, slug")
    .single();

  if (docError || !docRow) {
    throw new Error(docError?.message ?? "Failed to upsert legal document");
  }

  await supabase
    .from("legal_document_sections")
    .delete()
    .eq("document_id", docRow.id);

  const flat = flattenSections(extracted.sections);
  const keyToDbId = new Map<string, string>();

  for (const row of flat) {
    const parentDbId = row.parent_key ? keyToDbId.get(row.parent_key) ?? null : null;
    const { data: sectionRow, error: sectionError } = await supabase
      .from("legal_document_sections")
      .insert({
        document_id: docRow.id,
        parent_id: parentDbId,
        section_key: row.section_key,
        label: row.label,
        title: row.title ?? null,
        content: row.content ?? null,
        sort_order: row.sort_order,
      })
      .select("id, section_key")
      .single();

    if (sectionError || !sectionRow) {
      throw new Error(sectionError?.message ?? "Failed to insert section");
    }
    keyToDbId.set(sectionRow.section_key, sectionRow.id);
  }

  if (extracted.relatedSlugs?.length) {
    const { data: relatedRows } = await supabase
      .from("legal_documents")
      .select("id, slug")
      .in("slug", extracted.relatedSlugs);

    if (relatedRows?.length) {
      await supabase.from("legal_document_relations").delete().eq("document_id", docRow.id);
      await supabase.from("legal_document_relations").insert(
        relatedRows.map((related) => ({
          document_id: docRow.id,
          related_document_id: related.id,
        }))
      );
    }
  }

  return docRow;
}
