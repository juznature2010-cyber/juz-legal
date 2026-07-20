-- ============================================================
-- JUZ LEGAL — Legal documents + VBPL AI sync schema
-- Chạy sau schema.sql: npm run supabase:legal-schema
-- ============================================================

-- 1. Văn bản pháp luật (metadata)
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  number text not null,
  doc_type text not null,
  title text not null,
  issuer text not null,
  field text not null,
  status text not null default 'con-hieu-luc'
    check (status in ('con-hieu-luc', 'het-hieu-luc', 'chua-co-hieu-luc', 'sua-doi-bo-sung')),
  issued_date date,
  effective_date date,
  expired_date date,
  signer text,
  source_url text,
  vbpl_item_id text unique,
  raw_html text,
  ai_model text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Nội dung theo chương / điều (cây phẳng qua parent_id)
create table if not exists public.legal_document_sections (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.legal_documents (id) on delete cascade,
  parent_id uuid references public.legal_document_sections (id) on delete cascade,
  section_key text not null,
  label text not null,
  title text,
  content text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (document_id, section_key)
);

-- 3. Liên kết văn bản liên quan
create table if not exists public.legal_document_relations (
  document_id uuid not null references public.legal_documents (id) on delete cascade,
  related_document_id uuid not null references public.legal_documents (id) on delete cascade,
  primary key (document_id, related_document_id),
  check (document_id <> related_document_id)
);

-- 4. Hàng đợi đồng bộ từ vbpl.vn
create table if not exists public.vbpl_sync_queue (
  id uuid primary key default gen_random_uuid(),
  vbpl_item_id text not null unique,
  source_url text not null,
  priority int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'done', 'failed')),
  last_error text,
  attempts int not null default 0,
  scheduled_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 5. Lịch sử job đồng bộ AI
create table if not exists public.vbpl_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed')),
  triggered_by text not null default 'system',
  total_items int not null default 0,
  processed_items int not null default 0,
  success_count int not null default 0,
  error_count int not null default 0,
  ai_model text,
  log jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 6. Index
create index if not exists idx_legal_documents_slug on public.legal_documents (slug);
create index if not exists idx_legal_documents_type on public.legal_documents (doc_type);
create index if not exists idx_legal_documents_field on public.legal_documents (field);
create index if not exists idx_legal_documents_status on public.legal_documents (status);
create index if not exists idx_legal_documents_issued on public.legal_documents (issued_date desc);
create index if not exists idx_legal_documents_vbpl on public.legal_documents (vbpl_item_id);
create index if not exists idx_legal_sections_doc on public.legal_document_sections (document_id, sort_order);
create index if not exists idx_vbpl_queue_status on public.vbpl_sync_queue (status, priority desc, scheduled_at);
create index if not exists idx_vbpl_jobs_created on public.vbpl_sync_jobs (created_at desc);

-- Full-text search (tiếng Việt đơn giản)
create index if not exists idx_legal_documents_search
  on public.legal_documents
  using gin (to_tsvector('simple', coalesce(number, '') || ' ' || coalesce(title, '')));

-- 7. updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists legal_documents_updated_at on public.legal_documents;
create trigger legal_documents_updated_at
  before update on public.legal_documents
  for each row execute function public.set_updated_at();

-- 8. RLS
alter table public.legal_documents enable row level security;
alter table public.legal_document_sections enable row level security;
alter table public.legal_document_relations enable row level security;
alter table public.vbpl_sync_queue enable row level security;
alter table public.vbpl_sync_jobs enable row level security;

drop policy if exists "Public read legal documents" on public.legal_documents;
create policy "Public read legal documents"
  on public.legal_documents for select using (true);

drop policy if exists "Admin manage legal documents" on public.legal_documents;
create policy "Admin manage legal documents"
  on public.legal_documents for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read legal sections" on public.legal_document_sections;
create policy "Public read legal sections"
  on public.legal_document_sections for select using (true);

drop policy if exists "Admin manage legal sections" on public.legal_document_sections;
create policy "Admin manage legal sections"
  on public.legal_document_sections for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read legal relations" on public.legal_document_relations;
create policy "Public read legal relations"
  on public.legal_document_relations for select using (true);

drop policy if exists "Admin manage legal relations" on public.legal_document_relations;
create policy "Admin manage legal relations"
  on public.legal_document_relations for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin manage vbpl queue" on public.vbpl_sync_queue;
create policy "Admin manage vbpl queue"
  on public.vbpl_sync_queue for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin manage vbpl jobs" on public.vbpl_sync_jobs;
create policy "Admin manage vbpl jobs"
  on public.vbpl_sync_jobs for all
  using (public.is_admin()) with check (public.is_admin());
