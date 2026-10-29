ALTER TABLE `game_sessions` ADD `progress` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `issued` integer;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `receipts` text;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `peer` text;