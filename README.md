# JUZ LEGAL — Website

Website chính thức **Dịch vụ Pháp lý JUZ legal** — Next.js, TypeScript, Tailwind CSS, Framer Motion.

## Công nghệ

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- Radix UI (Accordion, Label, Slot)
- Supabase (Auth, booking, contact, admin)
- Resend (email notifications)
- Zod + Vitest (validation and tests)

## Chạy local

```bash
cd juz-legal
npm install
npm run test
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173)

## Kiểm tra trước khi deploy

```bash
npm run check
```

Lệnh này chạy lint, unit test và production build.

## Cấu hình

Sao chép `env.example` thành `.env.local`, tạo Supabase project còn hoạt động,
chạy schema trong `supabase/`, rồi cấu hình Resend. Không commit `.env.local`,
database password hoặc API key.

## Triển khai

### Vercel

1. Mở pull request vào repository GitHub.
2. Chờ GitHub Actions pass.
3. Kiểm thử Deploy Preview: auth, admin, form, email và responsive.
4. Khai báo đủ biến trong `env.example` trên Vercel.
5. Chỉ merge/promote production sau khi backup và xác nhận database.

### VPS (Node)

```bash
npm run build
pm2 start npm --name juz-legal -- start
# Hoặc chạy behind Nginx reverse proxy tới cổng 3000
```

### Nginx (gợi ý)

```nginx
server {
    listen 80;
    server_name juzlegal.com www.juzlegal.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## Cấu trúc

```
src/
  app/           # Trang, API routes, admin
  components/    # Header, Footer, sections, UI
  lib/           # Content, Supabase, auth, validation, notifications
supabase/         # Schema và production patches
```

Chỉnh nội dung: `src/lib/data.ts`, thông tin liên hệ: `src/lib/site.ts`.
