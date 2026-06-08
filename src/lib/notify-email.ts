import { siteConfig } from "@/lib/site";

type SendEmailInput = {
  subject: string;
  html: string;
  text: string;
};

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function getNotifyEmail() {
  return (
    cleanEnv(process.env.BOOKING_NOTIFY_EMAIL) ||
    cleanEnv(process.env.CONTACT_NOTIFY_EMAIL) ||
    siteConfig.bookingNotifyEmail
  );
}

function getFromEmail() {
  return cleanEnv(process.env.EMAIL_FROM) || "onboarding@resend.dev";
}

export async function sendNotificationEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = getNotifyEmail();

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
  console.log("[notify-email] Da gui mail dat lich toi", to, "id=", data.id);
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

export async function sendBookingNotification(payload: BookingEmailPayload) {
  const modeLabel = payload.mode === "online" ? "Trực tuyến" : "Tại văn phòng";
  const timeShort = payload.bookingTime.slice(0, 5);

  const lines = [
    "Có yêu cầu đặt lịch tư vấn mới trên website JUZ Legal.",
    "",
    `Khách hàng: ${payload.clientName}`,
    `Điện thoại: ${payload.clientPhone}`,
    `Dịch vụ: ${payload.serviceTitle}`,
    payload.lawyerName ? `Luật sư: ${payload.lawyerName}` : null,
    `Ngày giờ: ${payload.bookingDate} ${timeShort}`,
    `Hình thức: ${modeLabel}`,
    payload.note ? `Ghi chú: ${payload.note}` : null,
    "",
    `Xem trong admin: ${siteConfig.url}/admin/dat-lich`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const html = `
    <h2>Đặt lịch tư vấn mới — JUZ Legal</h2>
    <ul>
      <li><strong>Khách hàng:</strong> ${escapeHtml(payload.clientName)}</li>
      <li><strong>Điện thoại:</strong> ${escapeHtml(payload.clientPhone)}</li>
      <li><strong>Dịch vụ:</strong> ${escapeHtml(payload.serviceTitle)}</li>
      ${payload.lawyerName ? `<li><strong>Luật sư:</strong> ${escapeHtml(payload.lawyerName)}</li>` : ""}
      <li><strong>Ngày giờ:</strong> ${escapeHtml(payload.bookingDate)} ${escapeHtml(timeShort)}</li>
      <li><strong>Hình thức:</strong> ${escapeHtml(modeLabel)}</li>
      ${payload.note ? `<li><strong>Ghi chú:</strong> ${escapeHtml(payload.note)}</li>` : ""}
    </ul>
    <p><a href="${siteConfig.url}/admin/dat-lich">Mở bảng quản trị đặt lịch</a></p>
  `;

  return sendNotificationEmail({
    subject: `[JUZ Legal] Đặt lịch mới — ${payload.clientName}`,
    text,
    html,
  });
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

  return sendNotificationEmail({
    subject: `[JUZ Legal] Lịch đã xác nhận — ${payload.clientName}`,
    text,
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
