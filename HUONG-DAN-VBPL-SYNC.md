# VBPL Auto Sync — Hướng dẫn cấu hình Production

## Bước 1: Lấy Supabase Service Role Key

1. Mở [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project JUZ Legal (URL dạng `https://xxxx.supabase.co`)
3. **Settings → API**
4. Copy **`service_role`** (secret) — **không** dùng anon key
5. Thêm vào `juz-legal/.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
```

## Bước 2: Lấy AI API Key (OpenAI hoặc tương thích)

1. Mở [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Tạo key mới
3. Thêm vào `.env.local`:

```env
AI_API_KEY=sk-proj-...
AI_MODEL=gpt-4o-mini
```

> Nếu chưa có AI key, vẫn sync được bằng **heuristic** (kém chính xác hơn).

## Bước 3: Database password (tùy chọn — tạo bảng tự động)

1. Supabase Dashboard → **Settings → Database**
2. Copy **Database password**
3. Thêm vào `.env.local`:

```env
SUPABASE_DB_PASSWORD=your-db-password
```

**Hoặc** chạy SQL thủ công: mở `supabase/legal-documents.sql` → paste vào **SQL Editor → Run**

## Bước 4: Cron secret (tự sinh khi chạy setup)

Script sẽ tự tạo `CRON_SECRET` và đẩy lên Vercel.

## Bước 5: Chạy setup một lần

```bash
cd juz-legal
npm run vbpl:setup-production
```

Script sẽ:
- Đẩy biến VBPL lên Vercel Production + Preview
- Chạy `legal-documents.sql` (nếu có DB password)
- Seed hàng đợi vbpl
- Gọi sync lần đầu trên production

## Bước 6: Redeploy Vercel

Sau khi thêm env mới, vào Vercel → **Deployments → Redeploy** (production).

Cron tự chạy **4 lần/ngày** theo `vercel.json`.

## Kiểm tra

- Admin: `/admin/thu-vien-phap-luat`
- Website: `/thu-vien-phap-luat`
- Cron thủ công: `npm run vbpl:sync` (sau khi deploy + cấu hình secret)
