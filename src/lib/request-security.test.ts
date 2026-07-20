import { describe, expect, it } from "vitest";
import { isTrustedFormRequest } from "./request-security";

function request(url: string, headers: Record<string, string> = {}) {
  return new Request(url, { method: "POST", headers });
}

describe("isTrustedFormRequest", () => {
  it("allows matching origin", () => {
    expect(
      isTrustedFormRequest(
        request("https://www.juzlegal.com/api/contact", {
          origin: "https://www.juzlegal.com",
        })
      )
    ).toBe(true);
  });

  it("allows matching referer when origin missing", () => {
    expect(
      isTrustedFormRequest(
        request("http://localhost:5173/api/contact", {
          referer: "http://localhost:5173/lien-he",
        })
      )
    ).toBe(true);
  });

  it("blocks cross-site requests without trusted headers", () => {
    expect(
      isTrustedFormRequest(request("https://www.juzlegal.com/api/contact"))
    ).toBe(false);
  });
});
