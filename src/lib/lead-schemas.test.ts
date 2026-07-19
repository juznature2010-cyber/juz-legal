import { describe, expect, it } from "vitest";
import { bookingSchema, contactSchema } from "./lead-schemas";

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    expect(
      contactSchema.safeParse({
        name: "Nguyễn Văn A",
        phone: "0901 234 567",
        email: "a@example.com",
        message: "Tôi cần tư vấn pháp lý doanh nghiệp.",
        website: "",
      }).success
    ).toBe(true);
  });

  it("rejects bot honeypot and malformed phone", () => {
    expect(
      contactSchema.safeParse({
        name: "Nguyễn Văn A",
        phone: "abc",
        message: "Nội dung đủ dài để kiểm tra.",
        website: "https://spam.example",
      }).success
    ).toBe(false);
  });
});

describe("bookingSchema", () => {
  it("accepts a future booking", () => {
    const future = new Date(Date.now() + 3 * 86_400_000)
      .toISOString()
      .slice(0, 10);
    expect(
      bookingSchema.safeParse({
        serviceSlug: "doanh-nghiep",
        lawyerSlug: "tran-dinh-long",
        bookingDate: future,
        bookingTime: "10:00",
        mode: "online",
        clientName: "Trần Thị B",
        clientPhone: "+84 901 234 567",
        note: null,
        website: "",
      }).success
    ).toBe(true);
  });

  it("rejects a past booking", () => {
    expect(
      bookingSchema.safeParse({
        serviceSlug: "doanh-nghiep",
        bookingDate: "2020-01-01",
        bookingTime: "10:00",
        mode: "office",
        clientName: "Trần Thị B",
        clientPhone: "0901234567",
        website: "",
      }).success
    ).toBe(false);
  });
});
