import { siteConfig } from "@/lib/site";

type SendEmailInput = {
  subject: string;
  html: string;
  text: string;
};

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function getBookingNotifyEmail() {
  return cleanEnv(process.env.BOOKING_NOTIFY_EMAIL) || siteConfig.bookingNotifyEmail;
}

function getFromEmail() {
  return cleanEnv(process.env.EMAIL_FROM) || "onboarding@resend.dev";
}

export async function sendNotificationEmail(
  input: SendEmailInput,
  to = getBookingNotifyEmail()
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      "[notify-email] RESEND_API_KEY chưa cấu hình — bỏ qua gửi mail tới",
      to
    );
    return { ok: false, skipped: true as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromEmail(),
      to: [to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(
      "[notify-email] Gui mail that bai:",
      res.status,
      "to=",
      to,
      detail
    );
    return { ok: false, skipped: false as const, error: detail };
  }

  const data = (await res.json()) as { id?: string };
  console.log("[notify-email] Da gui mail toi", to, "id=", data.id);
  return { ok: true, skipped: false as const, id: data.id };
}

export type BookingEmailPayload = {
  serviceTitle: string;
  lawyerName: string | null;
  bookingDate: string;
  bookingTime: string;
  mode: "online" | "office";
  clientName: string;
  clientPhone: string;
  note: string | null;
};

export type ContactEmailPayload = {
  name: string;
  phone: string;
  email: string | null;
  message: string;
  serviceLabel: string | null;
};

function formatSubmittedAt() {
  return new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export async function sendNewContactNotification(payload: ContactEmailPayload) {
  const submittedAt = formatSubmittedAt();
  const text = [
    "Khách hàng vừa gửi yêu cầu liên hệ trên website JUZ Legal.",
    `Thời gian nhận: ${submittedAt}`,
    "",
    `Khách hàng: ${payload.name}`,
    `Điện thoại: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.serviceLabel ? `Dịch vụ: ${payload.serviceLabel}` : null,
    `Nội dung: ${payload.message}`,
    "",
    `Xem trong admin: ${siteConfig.url}/admin/lien-he`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>Yêu cầu liên hệ mới — JUZ Legal</h2>
    <p><strong>Thời gian nhận:</strong> ${escapeHtml(submittedAt)}</p>
    <ul>
      <li><strong>Khách hàng:</strong> ${escapeHtml(payload.name)}</li>
      <li><strong>Điện thoại:</strong> ${escapeHtml(payload.phone)}</li>
      ${payload.email ? `<li><strong>Email:</strong> ${escapeHtml(payload.email)}</li>` : ""}
      ${payload.serviceLabel ? `<li><strong>Dịch vụ:</strong> ${escapeHtml(payload.serviceLabel)}</li>` : ""}
      <li><strong>Nội dung:</strong> ${escapeHtml(payload.message)}</li>
    </ul>
    <p><a href="${siteConfig.url}/admin/lien-he">Mở bảng quản trị liên hệ</a></p>
  `;

  return sendNotificationEmail({
    subject: `[JUZ Legal] Liên hệ mới — ${payload.name}`,
    text,
    html,
  });
}

export async function sendNewBookingRequestNotification(payload: BookingEmailPayload) {
  const modeLabel = payload.mode === "online" ? "Trực tuyến" : "Tại văn phòng";
  const timeShort = payload.bookingTime.slice(0, 5);
  const submittedAt = formatSubmittedAt();
  const notifyEmail = getBookingNotifyEmail();

  const lines = [
    "Khách hàng vừa đặt lịch tư vấn trên website JUZ Legal.",
    `Thời gian nhận: ${submittedAt}`,
    "",
    `Khách hàng: ${payload.clientName}`,
    `Điện thoại: ${payload.clientPhone}`,
    `Dịch vụ: ${payload.serviceTitle}`,
    payload.lawyerName ? `Luật sư: ${payload.lawyerName}` : null,
    `Ngày giờ yêu cầu: ${payload.bookingDate} ${timeShort}`,
    `Hình thức: ${modeLabel}`,
    payload.note ? `Ghi chú: ${payload.note}` : null,
    "",
    "Vui lòng vào admin để chỉnh lịch (nếu cần) và xác nhận.",
    `Xem trong admin: ${siteConfig.url}/admin/dat-lich`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const html = `
    <h2>Khách vừa đặt lịch — JUZ Legal</h2>
    <p><strong>Thời gian nhận:</strong> ${escapeHtml(submittedAt)}</p>
    <ul>
      <li><strong>Khách hàng:</strong> ${escapeHtml(payload.clientName)}</li>
      <li><strong>Điện thoại:</strong> ${escapeHtml(payload.clientPhone)}</li>
      <li><strong>Dịch vụ:</strong> ${escapeHtml(payload.serviceTitle)}</li>
      ${payload.lawyerName ? `<li><strong>Luật sư:</strong> ${escapeHtml(payload.lawyerName)}</li>` : ""}
      <li><strong>Ngày giờ yêu cầu:</strong> ${escapeHtml(payload.bookingDate)} ${escapeHtml(timeShort)}</li>
      <li><strong>Hình thức:</strong> ${escapeHtml(modeLabel)}</li>
      ${payload.note ? `<li><strong>Ghi chú:</strong> ${escapeHtml(payload.note)}</li>` : ""}
    </ul>
    <p>Vui lòng vào admin để chỉnh lịch (nếu cần) và xác nhận.</p>
    <p><a href="${siteConfig.url}/admin/dat-lich">Mở bảng quản trị đặt lịch</a></p>
  `;

  return sendNotificationEmail(
    {
      subject: `[JUZ Legal] Khách vừa đặt lịch — ${payload.clientName}`,
      text,
      html,
    },
    notifyEmail
  );
}

/** @deprecated Use sendNewBookingRequestNotification */
export async function sendBookingNotification(payload: BookingEmailPayload) {
  return sendNewBookingRequestNotification(payload);
}

export async function sendBookingConfirmedNotification(payload: BookingEmailPayload) {
  const modeLabel = payload.mode === "online" ? "Trực tuyến" : "Tại văn phòng";
  const timeShort = payload.bookingTime.slice(0, 5);

  const lines = [
    "Lịch tư vấn đã được xác nhận trên admin JUZ Legal.",
    "",
    `Khách hàng: ${payload.clientName}`,
    `Điện thoại: ${payload.clientPhone}`,
    `Dịch vụ: ${payload.serviceTitle}`,
    payload.lawyerName ? `Luật sư: ${payload.lawyerName}` : null,
    `Ngày giờ đã xác nhận: ${payload.bookingDate} ${timeShort}`,
    `Hình thức: ${modeLabel}`,
    payload.note ? `Ghi chú: ${payload.note}` : null,
    "",
    `Xem trong admin: ${siteConfig.url}/admin/dat-lich`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const html = `
    <h2>Lịch tư vấn đã xác nhận — JUZ Legal</h2>
    <ul>
      <li><strong>Khách hàng:</strong> ${escapeHtml(payload.clientName)}</li>
      <li><strong>Điện thoại:</strong> ${escapeHtml(payload.clientPhone)}</li>
      <li><strong>Dịch vụ:</strong> ${escapeHtml(payload.serviceTitle)}</li>
      ${payload.lawyerName ? `<li><strong>Luật sư:</strong> ${escapeHtml(payload.lawyerName)}</li>` : ""}
      <li><strong>Ngày giờ đã xác nhận:</strong> ${escapeHtml(payload.bookingDate)} ${escapeHtml(timeShort)}</li>
      <li><strong>Hình thức:</strong> ${escapeHtml(modeLabel)}</li>
      ${payload.note ? `<li><strong>Ghi chú:</strong> ${escapeHtml(payload.note)}</li>` : ""}
    </ul>
    <p><a href="${siteConfig.url}/admin/dat-lich">Mở bảng quản trị đặt lịch</a></p>
  `;

  return sendNotificationEmail(
    {
      subject: `[JUZ Legal] Lịch đã xác nhận — ${payload.clientName}`,
      text,
      html,
    },
    getBookingNotifyEmail()
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
