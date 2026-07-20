import { describe, expect, it } from "vitest";
import { parseVbplItemIdsFromHtml } from "@/lib/vbpl/discover";

describe("parseVbplItemIdsFromHtml", () => {
  it("extracts ItemID values from vbpl links", () => {
    const html = `
      <a href="/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=149086">Luật DN</a>
      <a href='vbpq-toanvan.aspx?ItemID=149087'>Luật ĐT</a>
    `;
    expect(parseVbplItemIdsFromHtml(html).sort()).toEqual(["149086", "149087"]);
  });

  it("deduplicates repeated ids", () => {
    const html = "ItemID=170048 ItemID=170048 ItemID=23189";
    expect(parseVbplItemIdsFromHtml(html).sort()).toEqual(["170048", "23189"]);
  });
});
