import { LegalLibraryClient } from "@/components/legal-documents/legal-library-client";
import { getLegalDocumentsFromDb } from "@/lib/supabase/queries-legal";
import { legalDocuments as staticDocuments } from "@/lib/legal-documents/documents";

export const revalidate = 300;

export default async function LegalLibraryPage() {
  const fromDb = await getLegalDocumentsFromDb();
  const documents = fromDb.length ? fromDb : staticDocuments;

  return (
    <LegalLibraryClient
      documents={documents}
      dataSource={fromDb.length ? "supabase" : "static"}
    />
  );
}
