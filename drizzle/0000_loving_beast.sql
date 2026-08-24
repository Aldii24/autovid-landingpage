CREATE TABLE `waitlist_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`creator_type` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_waitlist_entries_email` ON `waitlist_entries` (`email`);