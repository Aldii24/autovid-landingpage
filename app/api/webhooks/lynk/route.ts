import {neon} from '@neondatabase/serverless';
import {NextResponse} from 'next/server';
import {
  buildActivationEmail,
  escapeHtml,
  findAutoVidItem,
  issueLicenseCode,
  parseLynkPayment,
  sha256,
  verifyLynkSignature,
  WebhookPayloadError,
} from './lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type OrderRow = {
  message_id: string;
  ref_id: string;
  status: 'processing' | 'issued' | 'emailed' | 'failed';
};

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Server belum dikonfigurasi: ${name}`);
  return value;
};

const privateKeyPem = () => {
  if (process.env.LICENSE_PRIVATE_KEY_B64?.trim()) {
    return Buffer.from(process.env.LICENSE_PRIVATE_KEY_B64.trim(), 'base64').toString('utf8');
  }
  return requiredEnv('LICENSE_PRIVATE_KEY').replace(/\\n/g, '\n');
};

const sendActivationEmail = async (
  email: string,
  refId: string,
  content: ReturnType<typeof buildActivationEmail>,
) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requiredEnv('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `autovid-license/${refId}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM?.trim() || 'AutoVid <activation@mail.autovid.my.id>',
      to: [email],
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });
  const result = (await response.json().catch(() => ({}))) as {id?: string; message?: string};
  if (!response.ok || !result.id) {
    throw new Error(`Email activation gagal (${response.status}): ${result.message || 'unknown'}`);
  }
  return result.id;
};

export async function POST(request: Request) {
  const signature = request.headers.get('x-lynk-signature')?.trim() || '';
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    // Lynk's "Test URL" connectivity check may not include a payment JSON body.
    // A real webhook is always signed, so this acknowledgement cannot issue a license.
    if (!signature) {
      return NextResponse.json({ok: true, test: true, service: 'autovid-lynk-webhook'});
    }
    return NextResponse.json({ok: false, error: 'invalid_json'}, {status: 400});
  }

  const event =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? String((payload as Record<string, unknown>).event || '').trim()
      : '';
  if (!signature && event !== 'payment.received') {
    return NextResponse.json({ok: true, test: true, service: 'autovid-lynk-webhook'});
  }

  let payment;
  try {
    payment = parseLynkPayment(payload);
  } catch (error) {
    const message = error instanceof WebhookPayloadError ? error.message : 'invalid_payload';
    return NextResponse.json({ok: false, error: message}, {status: 400});
  }

  let merchantKey: string;
  try {
    merchantKey = requiredEnv('LYNK_MERCHANT_KEY');
  } catch {
    return NextResponse.json({ok: false, error: 'server_not_configured'}, {status: 503});
  }
  if (!verifyLynkSignature(payment, signature, merchantKey)) {
    return NextResponse.json({ok: false, error: 'invalid_signature'}, {status: 401});
  }

  const expectedTitle =
    process.env.LYNK_PRODUCT_TITLE?.trim() ||
    'AutoVid — Desktop AI Video Studio untuk Manhwa Recap & Faceless Video';
  const expectedPrice = Number(process.env.LYNK_PRODUCT_PRICE || 150000);
  const purchasedItem = findAutoVidItem(
    payment,
    process.env.LYNK_PRODUCT_UUID?.trim() || '',
    expectedTitle,
    expectedPrice,
  );
  if (!purchasedItem) {
    return NextResponse.json({ok: true, ignored: 'product_mismatch'});
  }

  let sql;
  try {
    sql = neon(requiredEnv('DATABASE_URL'));
    requiredEnv('RESEND_API_KEY');
    privateKeyPem();
  } catch {
    return NextResponse.json({ok: false, error: 'server_not_configured'}, {status: 503});
  }

  const payloadHash = sha256(JSON.stringify(payload));
  try {
    const inserted = (await sql`
      INSERT INTO autovid_lynk_orders (
        message_id, ref_id, customer_email, customer_name, product_uuid,
        product_title, item_price, grand_total, payload_hash, status
      ) VALUES (
        ${payment.messageId}, ${payment.refId}, ${payment.customerEmail},
        ${payment.customerName}, ${purchasedItem.uuid}, ${purchasedItem.title},
        ${purchasedItem.price}, ${payment.amount}, ${payloadHash}, 'processing'
      )
      ON CONFLICT DO NOTHING
      RETURNING message_id, ref_id, status
    `) as OrderRow[];

    let claimed = inserted[0];
    if (!claimed) {
      const reclaimed = (await sql`
        UPDATE autovid_lynk_orders
        SET status = 'processing', last_error = NULL, updated_at = NOW(), attempt_count = attempt_count + 1
        WHERE (message_id = ${payment.messageId} OR ref_id = ${payment.refId})
          AND (status = 'failed' OR (status IN ('processing', 'issued') AND updated_at < NOW() - INTERVAL '5 minutes'))
        RETURNING message_id, ref_id, status
      `) as OrderRow[];
      claimed = reclaimed[0];
    }

    if (!claimed) {
      const existing = (await sql`
        SELECT message_id, ref_id, status
        FROM autovid_lynk_orders
        WHERE message_id = ${payment.messageId} OR ref_id = ${payment.refId}
        LIMIT 1
      `) as OrderRow[];
      return NextResponse.json({ok: true, duplicate: true, status: existing[0]?.status || 'unknown'});
    }

    try {
      const licenseCode = issueLicenseCode(payment, privateKeyPem());
      const licenseHash = sha256(licenseCode);
      await sql`
        UPDATE autovid_lynk_orders
        SET status = 'issued', license_hash = ${licenseHash}, updated_at = NOW()
        WHERE ref_id = ${payment.refId}
      `;
      const email = buildActivationEmail(payment, licenseCode);
      const emailId = await sendActivationEmail(payment.customerEmail, payment.refId, email);
      await sql`
        UPDATE autovid_lynk_orders
        SET status = 'emailed', email_id = ${emailId}, emailed_at = NOW(), updated_at = NOW()
        WHERE ref_id = ${payment.refId}
      `;
      return NextResponse.json({ok: true, status: 'emailed'});
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : 'unknown_error';
      await sql`
        UPDATE autovid_lynk_orders
        SET status = 'failed', last_error = ${message}, updated_at = NOW()
        WHERE ref_id = ${payment.refId}
      `;
      throw error;
    }
  } catch (error) {
    console.error('Lynk webhook processing failed', {
      message: error instanceof Error ? escapeHtml(error.message.slice(0, 200)) : 'unknown_error',
      refIdHash: sha256(payment.refId),
    });
    return NextResponse.json({ok: false, error: 'processing_failed'}, {status: 500});
  }
}

export function GET() {
  return NextResponse.json({ok: true, service: 'autovid-lynk-webhook'});
}
