import { describe, expect, it } from "vitest";
import { extractDocumentHeuristic } from "@/lib/vbpl/ai-extractor";
import { flattenSections } from "@/lib/vbpl/repository";

describe("vbpl extraction", () => {
  it("heuristic extracts number and articles from html", () => {
    const html = `
      <html><body>
        <h1>Luật Doanh nghiệp số 59/2020/QH14</h1>
        <p>Điều 1. Phạm vi điều chỉnh của luật này.</p>
        <p>Điều 4. Loại hình doanh nghiệp gồm công ty TNHH và cổ phần.</p>
      </body></html>
    `;
    const doc = extractDocumentHeuristic(html, "149086");
    expect(doc.number).toContain("59/2020");
    expect(doc.docType).toBe("luat");
    expect(doc.sections.length).toBeGreaterThan(0);
  });

  it("flattenSections preserves parent-child keys", () => {
    const rows = flattenSections([
      {
        id: "chuong-1",
        label: "Chương I",
        children: [{ id: "dieu-1", label: "Điều 1", content: "Test" }],
      },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[1]?.parent_key).toBe("chuong-1");
  });
});
