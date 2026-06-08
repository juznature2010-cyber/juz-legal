import type { User } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

export function resolveUserRole(user: User, profileRole?: string): UserRole {
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL
  )?.toLowerCase();

  if (adminEmail && user.email?.toLowerCase() === adminEmail) {
    return "admin";
  }
  if (profileRole === "admin") {
    return "admin";
  }
  return "user";
}

export function getDashboardPath(role?: string) {
  return role === "admin" ? "/admin" : "/tai-khoan";
}

export function getUserDisplayName(user: User) {
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "Người dùng"
  );
}

export function getUserPhone(user: User) {
  return user.user_metadata?.phone as string | undefined;
}

export function mapSupabaseAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }
  if (lower.includes("user already registered")) {
    return "Email này đã được đăng ký.";
  }
  if (lower.includes("password")) {
    return "Mật khẩu không đủ mạnh hoặc không hợp lệ.";
  }
  if (lower.includes("email")) {
    return "Email không hợp lệ.";
  }
  if (lower.includes("fetch") || lower.includes("failed")) {
    return "Không kết nối được Supabase. Kiểm tra API key trong .env.local.";
  }
  return "Có lỗi xảy ra. Vui lòng thử lại.";
}

export function formatBookingMode(mode: string) {
  return mode === "online" ? "Trực tuyến" : "Tại văn phòng";
}

export function formatBookingStatus(status: string) {
  const map: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    cancelled: "Đã hủy",
    done: "Hoàn tất",
  };
  return map[status] ?? status;
}

export function formatContactStatus(status: string) {
  const map: Record<string, string> = {
    new: "Mới",
    read: "Đã đọc",
    replied: "Đã phản hồi",
  };
  return map[status] ?? status;
}
