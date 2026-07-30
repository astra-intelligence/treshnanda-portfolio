CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text NOT NULL,
	`avatar_url` text,
	`hero_headline` text,
	`hero_subheadline` text,
	`contact_email` text,
	`socials` text DEFAULT '{"github":"","linkedin":"","twitter":"","whatsapp":""}',
	`location` text DEFAULT 'Bali, Indonesia',
	`resume_url` text,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`content` text,
	`image_url` text,
	`images` text DEFAULT '[]',
	`link` text,
	`github` text,
	`tags` text DEFAULT '[]',
	`is_featured` integer DEFAULT false,
	`status` text DEFAULT 'live',
	`metadata` text DEFAULT '{}',
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`group` text DEFAULT 'general',
	`description` text,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);