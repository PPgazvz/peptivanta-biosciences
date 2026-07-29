CREATE TABLE `manual_fulfillment_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`occurred_at` text NOT NULL,
	`destination` text NOT NULL,
	`service` text NOT NULL,
	`order_profile` text NOT NULL,
	`product_name` text NOT NULL,
	`specification` text DEFAULT '' NOT NULL,
	`amount_usd_cents` integer NOT NULL,
	`status` text NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `manual_fulfillment_orders_reference_unique` ON `manual_fulfillment_orders` (`reference`);--> statement-breakpoint
CREATE INDEX `manual_fulfillment_orders_occurred_at_idx` ON `manual_fulfillment_orders` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `manual_fulfillment_orders_published_idx` ON `manual_fulfillment_orders` (`is_published`);