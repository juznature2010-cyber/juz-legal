import { siteConfig } from "@/lib/site";

const ZALO_TEMPLATE_URL = "https://business.openapi.zalo.me/message/template";
const ZALO_TOKEN_URL = "https://oauth.zaloapp.com/v4/oa/access_token";

export type BookingZaloPayload = {
  bookingId: string;
  serviceTitle: string;
  lawyerName: string | null;
  bookingDate: string;
  bookingTime: string;
  mode: "online" | "office";
  clientName: string;
  clientPhone: string;
  note: string | null;
};

type ZaloSendResult =
  | { ok: true; skipped: false; msgId?: string }
  | { ok: false; skipped: true }
  | { ok: false; skipped: false; error: string };

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

export function normalizeVietnamesePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("84")) return digits;
  if (digits.startsWith("0")) return `84${digits.slice(1)}`;
  return digits;
}

function formatDateVi(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function formatTimeShort(time: string) {
  return time?.slice(0, 5) ?? time;
}

function buildTemplateData(payload: BookingZaloPayload) {
  const modeLabel = payload.mode === "online" ? "Trực tuyến" : "Tại văn phòng";
  const timeShort = formatTimeShort(payload.bookingTime);
  const dateVi = formatDateVi(payload.bookingDate);

  return {
    customer_name: payload.clientName,
    service_name: payload.serviceTitle,
    booking_date: dateVi,
    booking_time: timeShort,
    consultation_mode: modeLabel,
    lawyer_name: payload.lawyerName ?? "JUZ Legal",
    office_address: siteConfig.address,
    hotline: siteConfig.phoneDisplay,
    note: payload.note ?? "",
  };
}

async function refreshZaloAccessToken() {
  const appId = cleanEnv(process.env.ZALO_OA_APP_ID);
  const appSecret = cleanEnv(process.env.ZALO_OA_APP_SECRET);
  const refreshToken = cleanEnv(process.env.ZALO_OA_REFRESH_TOKEN);

  if (!appId || !appSecret || !refreshToken) {
    return null;
  }

  const res = await fetch(ZALO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: appSecret,
    },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[notify-zalo] Refresh token that bai:", res.status, detail);
    return null;
  }

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: number;
    message?: string;
  };

  if (!data.access_token) {
    console.error(
      "[notify-zalo] Refresh token khong tra access_token:",
      data.message ?? data
    );
    return null;
  }

  if (data.refresh_token) {
    console.warn(
      "[notify-zalo] ZALO_OA_REFRESH_TOKEN da doi — cap nhat bien moi tren Vercel."
    );
  }

  return data.access_token;
}

async function getZaloAccessToken() {
  const direct = cleanEnv(process.env.ZALO_OA_ACCESS_TOKEN);
  if (direct) return direct;
  return refreshZaloAccessToken();
}

export async function sendBookingConfirmationZalo(
  payload: BookingZaloPayload
): Promise<ZaloSendResult> {
  const templateId = cleanEnv(process.env.ZALO_ZNS_BOOKING_TEMPLATE_ID);
  const phone = normalizeVietnamesePhone(payload.clientPhone);

  if (!templateId) {
    console.warn(
      "[notify-zalo] ZALO_ZNS_BOOKING_TEMPLATE_ID chua cau hinh — bo qua gui Zalo"
    );
    return { ok: false, skipped: true };
  }

  if (!phone || phone.length < 10) {
    return { ok: false, skipped: false, error: "So dien thoai khach khong hop le." };
  }

  const accessToken = await getZaloAccessToken();
  if (!accessToken) {
    console.warn(
      "[notify-zalo] ZALO_OA_ACCESS_TOKEN (hoac refresh token) chua cau hinh — bo qua gui Zalo"
    );
    return { ok: false, skipped: true };
  }

  const body = {
    phone,
    template_id: templateId,
    template_data: buildTemplateData(payload),
    tracking_id: `booking-${payload.bookingId}`,
  };

  const res = await fetch(ZALO_TEMPLATE_URL, {
    method: "POST",
    headers: {
      access_token: accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: number;
    message?: string;
    data?: { msg_id?: string };
  };

  if (!res.ok || (data.error !== undefined && data.error !== 0)) {
    const detail = data.message ?? (await res.text().catch(() => "Unknown error"));
    console.error(
      "[notify-zalo] Gui ZNS that bai:",
      res.status,
      "phone=",
      phone,
      detail
    );
    return { ok: false, skipped: false, error: String(detail) };
  }

  console.log(
    "[notify-zalo] Da gui ZNS xac nhan lich toi",
    phone,
    "msg_id=",
    data.data?.msg_id
  );
  return { ok: true, skipped: false, msgId: data.data?.msg_id };
}
