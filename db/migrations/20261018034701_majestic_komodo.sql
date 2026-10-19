CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`memo` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
