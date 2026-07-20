import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(8, "Số điện thoại quá ngắn")
  .max(20, "Số điện thoại quá dài")
  .regex(/^[+\d][\d\s().-]+$/, "Số điện thoại không hợp lệ");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  phone,
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .max(254)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Nội dung cần ít nhất 10 ký tự").max(5_000),
  serviceLabel: z.string().trim().max(200).optional(),
  website: z.string().max(0, "Yêu cầu không hợp lệ").optional(),
});

export const bookingSchema = z
  .object({
    serviceSlug: z.string().trim().min(1, "Vui lòng chọn dịch vụ").max(120),
    lawyerSlug: z.string().trim().max(120).nullable().optional(),
    bookingDate: z.iso.date("Ngày không hợp lệ"),
    bookingTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Giờ không hợp lệ"),
    mode: z.enum(["online", "office"]),
    clientName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
    clientPhone: phone,
    note: z.string().trim().max(5_000).nullable().optional(),
    website: z.string().max(0, "Yêu cầu không hợp lệ").optional(),
  })
  .superRefine((value, context) => {
    const appointment = new Date(
      `${value.bookingDate}T${value.bookingTime}:00+07:00`
    );
    if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) {
      context.addIssue({
        code: "custom",
        path: ["bookingDate"],
        message: "Vui lòng chọn thời gian trong tương lai",
      });
    }
  });
