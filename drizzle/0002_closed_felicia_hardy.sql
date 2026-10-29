CREATE INDEX `sessions_player_started` ON `game_sessions` (`player`,`started`);--> statement-breakpoint
CREATE INDEX `sessions_peer_started` ON `game_sessions` (`peer`,`started`);