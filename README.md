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

## Lynk.id webhook

The production endpoint is `/api/webhooks/lynk`. It validates
`X-Lynk-Signature`, accepts only the configured AutoVid product, claims each
`message_id`/`refId` once in Postgres, signs an offline Ed25519 activation code,
and sends it through Resend with an idempotency key.

Before enabling checkout automation:

1. Connect a Neon Postgres database to Vercel and run
   `migrations/001_autovid_lynk_orders.sql` in the Neon SQL Editor.
2. Verify the sending subdomain `mail.autovid.my.id` in Resend.
3. Configure every server-only value listed in `.env.example` directly in
   Vercel. Never commit or send those values through chat.
4. Save `https://www.autovid.my.id/api/webhooks/lynk` as the webhook URL in
   Lynk.id, then add the merchant key revealed by Lynk.id to Vercel.
5. Set `LYNK_PRODUCT_UUID` as soon as the product UUID is available from the
   Lynk.id transaction payload.
