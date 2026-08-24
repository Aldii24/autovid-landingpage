import {sqliteTable, text, uniqueIndex} from 'drizzle-orm/sqlite-core';

export const waitlistEntries = sqliteTable('waitlist_entries', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  creatorType: text('creator_type').notNull(),
  source: text('source').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [uniqueIndex('idx_waitlist_entries_email').on(table.email)]);
