export type UserRole = "user" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  service_label: string | null;
  status: "new" | "read" | "replied";
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string | null;
  service_slug: string;
  lawyer_slug: string | null;
  booking_date: string;
  booking_time: string;
  mode: "online" | "office";
  client_name: string;
  client_phone: string;
  note: string | null;
  status: "pending" | "confirmed" | "cancelled" | "done";
  created_at: string;
};
