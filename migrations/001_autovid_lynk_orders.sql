CREATE TABLE IF NOT EXISTS autovid_lynk_orders (
  message_id TEXT PRIMARY KEY,
  ref_id TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  product_uuid TEXT NOT NULL,
  product_title TEXT NOT NULL,
  item_price BIGINT NOT NULL,
  grand_total BIGINT NOT NULL,
  payload_hash TEXT NOT NULL,
  license_hash TEXT,
  email_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('processing', 'issued', 'emailed', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_error TEXT,
  emailed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS autovid_lynk_orders_email_idx
  ON autovid_lynk_orders (customer_email);

CREATE INDEX IF NOT EXISTS autovid_lynk_orders_status_idx
  ON autovid_lynk_orders (status, updated_at);
