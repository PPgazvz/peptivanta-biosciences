ALTER TABLE `fulfillment_cases` ADD `amount_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `cycle_key` text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
CREATE INDEX `fulfillment_cases_cycle_key_idx` ON `fulfillment_cases` (`cycle_key`);