import {env} from 'cloudflare:workers';

const createTableSql = `CREATE TABLE IF NOT EXISTS waitlist_entries (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  creator_type TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL
)`;

const createEmailIndexSql = `CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_entries_email
ON waitlist_entries(email)`;

async function prepareWaitlist() {
  if (!env.DB) throw new Error('Waitlist storage is unavailable.');
  await env.DB.batch([
    env.DB.prepare(createTableSql),
    env.DB.prepare(createEmailIndexSql),
  ]);
  return env.DB;
}

export async function joinWaitlist(email: string, creatorType: string) {
  const database = await prepareWaitlist();
  const existing = await database.prepare('SELECT id FROM waitlist_entries WHERE email = ? LIMIT 1').bind(email).first();
  if (existing) return {created: false};
  await database.prepare(
    'INSERT INTO waitlist_entries (id, email, creator_type, source, created_at) VALUES (?, ?, ?, ?, ?)',
  ).bind(crypto.randomUUID(), email, creatorType, 'landing-page', new Date().toISOString()).run();
  return {created: true};
}
