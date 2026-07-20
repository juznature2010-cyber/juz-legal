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

export type LegalDocumentRow = {
  id: string;
  slug: string;
  number: string;
  doc_type: string;
  title: string;
  issuer: string;
  field: string;
  status: "con-hieu-luc" | "het-hieu-luc" | "chua-co-hieu-luc" | "sua-doi-bo-sung";
  issued_date: string | null;
  effective_date: string | null;
  expired_date: string | null;
  signer: string | null;
  source_url: string | null;
  vbpl_item_id: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VbplSyncJob = {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  triggered_by: string;
  total_items: number;
  processed_items: number;
  success_count: number;
  error_count: number;
  ai_model: string | null;
  log: unknown;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type VbplSyncQueueItem = {
  id: string;
  vbpl_item_id: string;
  source_url: string;
  priority: number;
  status: "pending" | "processing" | "done" | "failed";
  last_error: string | null;
  attempts: number;
  scheduled_at: string;
  processed_at: string | null;
  created_at: string;
};
