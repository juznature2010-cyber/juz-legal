import { createClient } from "@/lib/supabase/server";
import type { Booking, ContactMessage } from "@/lib/supabase/types";

export async function getRecentContacts(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as ContactMessage[];
}

export async function getRecentBookings(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Booking[];
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

  const [contacts, bookings, pendingBookings] = await Promise.all([
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    contacts: contacts.count ?? 0,
    bookings: bookings.count ?? 0,
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
