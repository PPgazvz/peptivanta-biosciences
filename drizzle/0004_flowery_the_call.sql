ALTER TABLE `manual_fulfillment_orders` ADD `sku` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `quantity_units` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `retail_unit_price_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `discount_bps` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `service_fee_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `shipping_fee_usd_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `manual_fulfillment_orders` ADD `deduction_usd_cents` integer DEFAULT 0 NOT NULL;