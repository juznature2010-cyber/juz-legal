import { NextResponse } from "next/server";
import { getLegalDocumentsFromDb } from "@/lib/supabase/queries-legal";

export async function GET() {
  const documents = await getLegalDocumentsFromDb();
  return NextResponse.json({ documents, source: documents.length ? "supabase" : "empty" });
}
