# JUZ LEGAL — Website

Website chính thức **Công ty TNHH Dịch vụ Pháp lý JUZ** — Next.js, TypeScript, Tailwind CSS, Framer Motion.

## Công nghệ

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- Radix UI (Accordion, Label, Slot)

## Chạy local

```bash
cd juz-legal
npm install
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173)

## Build production

```bash
npm run build
npm run start
```

## Triển khai

### Vercel

1. Đẩy thư mục `juz-legal` lên GitHub.
2. Import project trên [vercel.com](https://vercel.com).
3. Root Directory: `juz-legal`
4. Biến môi trường: `NEXT_PUBLIC_SITE_URL=https://your-domain.vn`

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
    server_name juzlegal.vn;
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
  app/           # Trang & routing
  components/    # Header, Footer, sections, UI
  lib/           # data.ts, site.ts, seo.ts
```

Chỉnh nội dung: `src/lib/data.ts`, thông tin liên hệ: `src/lib/site.ts`.
