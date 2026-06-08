import { createClient } from "@/lib/supabase/server";
import type { Booking, ContactMessage } from "@/lib/supabase/types";

export async function getContacts(options?: {
  limit?: number;
  status?: ContactMessage["status"];
}) {
  const supabase = await createClient();
  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as ContactMessage[];
}

export async function getBookings(options?: {
  limit?: number;
  status?: Booking["status"];
}) {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Booking[];
}

export async function getRecentContacts(limit = 5) {
  return getContacts({ limit });
}

export async function getRecentBookings(limit = 5) {
  return getBookings({ limit });
}

export async function getUserBookings(userId: string, limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Booking[];
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [newContacts, totalContacts, totalBookings, pendingBookings] =
    await Promise.all([
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

  return {
    newContacts: newContacts.count ?? 0,
    totalContacts: totalContacts.count ?? 0,
    totalBookings: totalBookings.count ?? 0,
    pendingBookings: pendingBookings.count ?? 0,
  };
}

export async function getProfileRole(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role as "admin" | "user" | undefined;
}
