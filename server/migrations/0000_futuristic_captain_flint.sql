CREATE TABLE `leaderboard` (
	`player` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`runs` integer NOT NULL,
	`wickets` integer NOT NULL,
	`balls` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`player` text NOT NULL,
	`plan` text NOT NULL,
	`started` integer NOT NULL,
	`submitted` integer DEFAULT 0 NOT NULL
);
