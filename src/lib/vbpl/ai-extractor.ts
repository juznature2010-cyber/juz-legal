import { z } from "zod";
import type { DocumentStatus, LegalDocumentSection } from "@/lib/legal-documents/types";
import { stripHtml, truncateForAi } from "@/lib/vbpl/fetch";

const sectionSchema: z.ZodType<LegalDocumentSection> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    title: z.string().optional(),
    content: z.string().optional(),
    children: z.array(sectionSchema).optional(),
  })
);

export const extractedDocumentSchema = z.object({
  slug: z.string().min(1),
  number: z.string().min(1),
  docType: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  field: z.string().min(1),
  status: z.enum([
    "con-hieu-luc",
    "het-hieu-luc",
    "chua-co-hieu-luc",
    "sua-doi-bo-sung",
  ] satisfies DocumentStatus[]),
  issuedDate: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiredDate: z.string().optional(),
  signer: z.string().optional(),
  sections: z.array(sectionSchema).default([]),
  relatedSlugs: z.array(z.string()).optional(),
});

export type ExtractedDocument = z.infer<typeof extractedDocumentSchema>;

const taxonomyHint = `
docType ids: hien-phap, luat, bo-luat, nghi-quyet, nghi-dinh, quyet-dinh, thong-tu, thong-tu-lien-tich, van-ban-hop-nhat, huong-dan
issuer ids: quoc-hoi, chinh-phu, thu-tuong, bo-tu-phap, bo-ke-hoach-dau-tu, bo-lao-dong, bo-tai-chinh, bo-cong-thuong, cuc-shtt, juz-legal
field ids: doanh-nghiep, dau-tu, lao-dong, dat-dai, so-huu-tri-tue, thue-tai-chinh, thuong-mai, hon-nhan-gia-dinh, hanh-chinh, tranh-chap
status: con-hieu-luc | het-hieu-luc | chua-co-hieu-luc | sua-doi-bo-sung
dates: YYYY-MM-DD
section id: lowercase slug e.g. dieu-1, chuong-1
`;

function getAiConfig() {
  const apiKey =
    process.env.AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  const baseUrl =
    process.env.AI_API_BASE_URL?.trim() || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";
  return apiKey ? { apiKey, baseUrl, model } : null;
}

export function isAiExtractionConfigured() {
  return Boolean(getAiConfig());
}

export async function extractDocumentWithAi(
  html: string,
  vbplItemId: string,
  sourceUrl: string
): Promise<{ document: ExtractedDocument; aiModel: string }> {
  const config = getAiConfig();
  if (!config) {
    throw new Error("AI_API_KEY chưa cấu hình — không thể trích xuất bằng AI");
  }

  const plainText = truncateForAi(stripHtml(html));
  const prompt = `Bạn là chuyên gia pháp luật Việt Nam. Trích xuất metadata và cấu trúc văn bản từ nội dung HTML vbpl.vn.
Trả về JSON hợp lệ duy nhất, không markdown.
${taxonomyHint}
vbpl_item_id: ${vbplItemId}
source_url: ${sourceUrl}
Nội dung:
${plainText}`;

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Extract Vietnamese legal document structure. Return JSON matching keys: slug, number, docType, title, issuer, field, status, issuedDate, effectiveDate, expiredDate, signer, sections, relatedSlugs.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI extraction failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned empty content");

  const parsed = extractedDocumentSchema.parse(JSON.parse(content));
  return { document: parsed, aiModel: config.model };
}

export function extractDocumentHeuristic(
  html: string,
  vbplItemId: string
): ExtractedDocument {
  const text = stripHtml(html);
  const numberMatch =
    text.match(/\b(\d{1,4}\/\d{4}\/[A-ZĐ]+(?:-[A-Z]+)?)\b/i) ??
    text.match(/\b(Luật|Nghị định|Thông tư|Bộ luật)\s+[^\n.]{5,120}/i);
  const number = numberMatch?.[0]?.trim() ?? `VBPL-${vbplItemId}`;
  const titleMatch = text.match(
    /(Luật|Nghị định|Thông tư|Bộ luật|Quyết định)[^.]{5,160}/i
  );
  const title = titleMatch?.[0]?.trim() ?? `Văn bản VBPL ${vbplItemId}`;
  const slug = slugifyHeuristic(number, vbplItemId);

  const articleMatches = [...text.matchAll(/Điều\s+(\d+)\.?\s*([^Đ]{10,400})/gi)]
    .slice(0, 12)
    .map((match, index) => ({
      id: `dieu-${match[1]}`,
      label: `Điều ${match[1]}`,
      title: match[2]?.trim().slice(0, 120),
      content: match[2]?.trim(),
      sortHint: index,
    }));

  return extractedDocumentSchema.parse({
    slug,
    number,
    docType: inferDocType(title),
    title,
    issuer: inferIssuer(title, text),
    field: "hanh-chinh",
    status: text.toLowerCase().includes("hết hiệu lực")
      ? "het-hieu-luc"
      : "con-hieu-luc",
    sections: articleMatches.map(({ sortHint: _sortHint, ...section }) => section),
  });
}

function slugifyHeuristic(number: string, itemId: string) {
  const base = number
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `vbpl-${itemId}`;
}

function inferDocType(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("bộ luật")) return "bo-luat";
  if (lower.startsWith("luật")) return "luat";
  if (lower.startsWith("nghị định")) return "nghi-dinh";
  if (lower.startsWith("thông tư")) return "thong-tu";
  if (lower.startsWith("quyết định")) return "quyet-dinh";
  return "luat";
}

function inferIssuer(title: string, text: string) {
  const corpus = `${title} ${text}`.toLowerCase();
  if (corpus.includes("quốc hội")) return "quoc-hoi";
  if (corpus.includes("chính phủ")) return "chinh-phu";
  if (corpus.includes("bộ lao động")) return "bo-lao-dong";
  if (corpus.includes("bộ tài chính")) return "bo-tai-chinh";
  if (corpus.includes("bộ kế hoạch")) return "bo-ke-hoach-dau-tu";
  return "chinh-phu";
}
