import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import {
  buildActivationEmail,
  calculateLynkSignature,
  findAutoVidItem,
  issueLicenseCode,
  parseLynkPayment,
  verifyLynkSignature,
} from '../app/api/webhooks/lynk/lib.ts';

const payload = {
  event: 'payment.received',
  data: {
    message_action: 'SUCCESS',
    message_code: '0',
    message_data: {
      createdAt: '2026-08-24T12:00:00+07:00',
      customer: {email: 'buyer@example.com', name: 'Buyer <One>', phone: '0800'},
      items: [
        {
          price: 150000,
          qty: 1,
          title: 'AutoVid — Desktop AI Video Studio untuk Manhwa Recap & Faceless Video',
          uuid: 'autovid-product-uuid',
        },
      ],
      refId: 'ORDER-123',
      totals: {grandTotal: 149400},
    },
    message_id: 'MESSAGE-123',
  },
};

test('parses and validates Lynk signature exactly as documented', () => {
  const payment = parseLynkPayment(payload);
  const signature = calculateLynkSignature(payment.amount, payment.refId, payment.messageId, 'merchant-secret');
  assert.equal(verifyLynkSignature(payment, signature, 'merchant-secret'), true);
  assert.equal(verifyLynkSignature(payment, signature, 'wrong-secret'), false);
  assert.equal(verifyLynkSignature(payment, 'bad', 'merchant-secret'), false);
});

test('matches only the configured AutoVid product, price, and quantity', () => {
  const payment = parseLynkPayment(payload);
  assert.equal(
    findAutoVidItem(payment, 'autovid-product-uuid', 'ignored', 150000)?.uuid,
    'autovid-product-uuid',
  );
  assert.equal(findAutoVidItem(payment, 'another-product', 'ignored', 150000), null);
  assert.equal(findAutoVidItem(payment, '', payload.data.message_data.items[0].title, 140000), null);
});

test('issues deterministic Ed25519 codes that verify with the matching public key', () => {
  const {privateKey, publicKey} = crypto.generateKeyPairSync('ed25519');
  const privatePem = privateKey.export({type: 'pkcs8', format: 'pem'}).toString();
  const payment = parseLynkPayment(payload);
  const first = issueLicenseCode(payment, privatePem);
  const second = issueLicenseCode(payment, privatePem);
  assert.equal(first, second);
  const [messagePart, signaturePart] = first.slice('MGPT1-'.length).split('.');
  assert.equal(
    crypto.verify(
      null,
      Buffer.from(messagePart, 'base64url'),
      publicKey,
      Buffer.from(signaturePart, 'base64url'),
    ),
    true,
  );
});

test('activation email escapes customer-controlled HTML', () => {
  const payment = parseLynkPayment(payload);
  const email = buildActivationEmail(payment, 'MGPT1-code');
  assert.match(email.html, /Buyer &lt;One&gt;/);
  assert.doesNotMatch(email.html, /Buyer <One>/);
  assert.match(email.text, /ORDER-123/);
});
