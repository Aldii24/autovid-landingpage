import crypto from 'node:crypto';

export type LynkItem = {
  price: number;
  qty: number;
  title: string;
  uuid: string;
};

export type LynkPayment = {
  amount: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  items: LynkItem[];
  messageId: string;
  refId: string;
};

export class WebhookPayloadError extends Error {}

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new WebhookPayloadError('Payload object tidak valid.');
  }
  return value as Record<string, unknown>;
};

const requiredString = (value: unknown, label: string) => {
  const result = String(value ?? '').trim();
  if (!result) throw new WebhookPayloadError(`${label} wajib diisi.`);
  return result;
};

export const parseLynkPayment = (payload: unknown): LynkPayment => {
  const root = asRecord(payload);
  if (root.event !== 'payment.received') {
    throw new WebhookPayloadError('Event webhook tidak didukung.');
  }

  const data = asRecord(root.data);
  if (data.message_action !== 'SUCCESS' || String(data.message_code) !== '0') {
    throw new WebhookPayloadError('Status pembayaran belum sukses.');
  }

  const messageData = asRecord(data.message_data);
  const customer = asRecord(messageData.customer);
  const totals = asRecord(messageData.totals);
  const email = requiredString(customer.email, 'Email customer').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new WebhookPayloadError('Email customer tidak valid.');
  }

  const createdAt = requiredString(messageData.createdAt, 'createdAt');
  if (Number.isNaN(Date.parse(createdAt))) {
    throw new WebhookPayloadError('createdAt tidak valid.');
  }

  const amountNumber = Number(totals.grandTotal);
  if (!Number.isFinite(amountNumber) || amountNumber < 0) {
    throw new WebhookPayloadError('grandTotal tidak valid.');
  }

  if (!Array.isArray(messageData.items) || messageData.items.length === 0) {
    throw new WebhookPayloadError('Item pembayaran kosong.');
  }
  const items = messageData.items.map((rawItem) => {
    const item = asRecord(rawItem);
    const price = Number(item.price);
    const qty = Number(item.qty ?? 1);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(qty) || qty < 1) {
      throw new WebhookPayloadError('Harga atau jumlah item tidak valid.');
    }
    return {
      price,
      qty,
      title: requiredString(item.title, 'Judul item'),
      uuid: requiredString(item.uuid, 'UUID item'),
    };
  });

  return {
    amount: String(amountNumber),
    createdAt: new Date(createdAt).toISOString(),
    customerEmail: email,
    customerName: requiredString(customer.name, 'Nama customer'),
    items,
    messageId: requiredString(data.message_id, 'message_id'),
    refId: requiredString(messageData.refId, 'refId'),
  };
};

export const calculateLynkSignature = (
  amount: string,
  refId: string,
  messageId: string,
  merchantKey: string,
) => crypto.createHash('sha256').update(`${amount}${refId}${messageId}${merchantKey}`).digest('hex');

export const verifyLynkSignature = (payment: LynkPayment, received: string, merchantKey: string) => {
  const normalized = String(received || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalized)) return false;
  const expected = calculateLynkSignature(payment.amount, payment.refId, payment.messageId, merchantKey);
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(normalized, 'hex'));
};

const normalizeTitle = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id');

export const findAutoVidItem = (
  payment: LynkPayment,
  expectedUuid: string,
  expectedTitle: string,
  expectedPrice: number,
) => {
  const item = expectedUuid
    ? payment.items.find((candidate) => candidate.uuid === expectedUuid)
    : payment.items.find((candidate) => normalizeTitle(candidate.title) === normalizeTitle(expectedTitle));
  if (!item || item.price !== expectedPrice || item.qty !== 1) return null;
  return item;
};

export const issueLicenseCode = (payment: LynkPayment, privateKeyPem: string) => {
  const licensePayload = {
    v: 1,
    id: payment.refId,
    iat: payment.createdAt,
    name: payment.customerName,
  };
  const message = Buffer.from(JSON.stringify(licensePayload), 'utf8');
  const signature = crypto.sign(null, message, crypto.createPrivateKey(privateKeyPem));
  return `MGPT1-${message.toString('base64url')}.${signature.toString('base64url')}`;
};

export const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

export const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });

export const buildActivationEmail = (payment: LynkPayment, licenseCode: string) => {
  const name = escapeHtml(payment.customerName);
  const code = escapeHtml(licenseCode);
  return {
    subject: 'Kode aktivasi AutoVid kamu',
    text: [
      `Halo ${payment.customerName},`,
      '',
      'Pembayaran AutoVid sudah diterima.',
      '',
      'Kode aktivasi:',
      licenseCode,
      '',
      'Download installer: https://download.autovid.my.id/AutoVid-0.1.1-x64.exe',
      'Panduan instalasi: https://www.autovid.my.id/installation',
      '',
      `Referensi transaksi: ${payment.refId}`,
      'Jangan membagikan kode aktivasi ini kepada orang lain.',
    ].join('\n'),
    html: `<!doctype html><html><body style="margin:0;background:#f5f2ec;color:#1d1c1a;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:40px 20px"><div style="background:#fffdf8;border:1px solid #d8d1c6;border-radius:24px;padding:32px"><div style="font-size:24px;font-weight:800">AutoVid</div><p style="margin:28px 0 8px">Halo ${name},</p><h1 style="margin:0 0 16px;font-size:30px">Pembayaran berhasil.</h1><p style="line-height:1.7;color:#6b645c">Kode aktivasi AutoVid kamu sudah siap. Salin seluruh kode di bawah ini ke halaman aktivasi aplikasi.</p><div style="margin:24px 0;padding:18px;border-radius:14px;background:#1d1c1a;color:#fff;word-break:break-all;font-family:Consolas,monospace;font-size:13px;line-height:1.7">${code}</div><p><a href="https://download.autovid.my.id/AutoVid-0.1.1-x64.exe" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#ff6338;color:#fff;text-decoration:none;font-weight:700">Download AutoVid</a></p><p style="font-size:13px;line-height:1.7;color:#6b645c">Panduan instalasi: <a href="https://www.autovid.my.id/installation">www.autovid.my.id/installation</a><br>Referensi transaksi: ${escapeHtml(payment.refId)}</p><p style="font-size:12px;color:#6b645c">Jangan membagikan kode aktivasi ini kepada orang lain.</p></div></div></body></html>`,
  };
};
