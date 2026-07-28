CREATE TABLE `fulfillment_ledger_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `product_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `specification` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `quantity_units` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `unit_price_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `packaging_fee_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `testing_fee_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `fulfillment_cases` ADD `logistics_fee_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `fulfillment_cases_service_occurred_at_idx` ON `fulfillment_cases` (`service`,`occurred_at`);