CREATE TABLE `fulfillment_cases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`occurred_at` text NOT NULL,
	`destination` text NOT NULL,
	`service` text NOT NULL,
	`order_profile` text NOT NULL,
	`status` text NOT NULL,
	`is_sample` integer DEFAULT true NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fulfillment_cases_reference_unique` ON `fulfillment_cases` (`reference`);--> statement-breakpoint
CREATE INDEX `fulfillment_cases_occurred_at_idx` ON `fulfillment_cases` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `fulfillment_cases_published_idx` ON `fulfillment_cases` (`is_published`);