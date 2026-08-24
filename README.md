# AutoVid Landing Page

Official multi-page website for AutoVid, built with Next.js and ready for Vercel.

## Local development

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```

## Public environment variables

Copy `.env.example` to `.env.local` for local overrides. Configure the same
values in Vercel for Preview and Production deployments.

- `NEXT_PUBLIC_AUTOVID_DOWNLOAD_URL`: direct Cloudflare R2 installer URL.
- `NEXT_PUBLIC_LYNK_PRODUCT_URL`: Lynk.id checkout URL. Leave it empty until
  the product page is ready; the purchase button remains disabled.

The Windows installer is intentionally not stored in this repository or in
Vercel. Release binaries are served from `download.autovid.my.id`.
