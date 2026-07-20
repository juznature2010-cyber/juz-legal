import { describe, expect, it } from "vitest";
import { legalDocuments } from "./documents";
import { filterLegalDocuments } from "./search";

describe("filterLegalDocuments", () => {
  it("finds documents by number keyword", () => {
    const results = filterLegalDocuments(legalDocuments, {
      q: "59/2020/QH14",
      searchIn: "number",
    });
    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("luat-doanh-nghiep-2020");
  });

  it("filters by document type and field", () => {
    const results = filterLegalDocuments(legalDocuments, {
      docType: "nghi-dinh",
      field: "doanh-nghiep",
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((doc) => doc.docType === "nghi-dinh")).toBe(true);
    expect(results.every((doc) => doc.field === "doanh-nghiep")).toBe(true);
  });

  it("matches all tokens when matchMode is all", () => {
    const results = filterLegalDocuments(legalDocuments, {
      q: "luat doanh nghiep",
      matchMode: "all",
    });
    expect(results.some((doc) => doc.slug === "luat-doanh-nghiep-2020")).toBe(true);
  });

  it("returns recent documents in new list mode", () => {
    const results = filterLegalDocuments(legalDocuments, {
      listMode: "new",
    });
    expect(results.some((doc) => doc.slug === "huong-dan-thu-tuc-dau-tu-2026")).toBe(true);
  });
});
