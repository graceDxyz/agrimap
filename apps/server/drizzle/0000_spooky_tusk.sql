CREATE TABLE `barangays` (
	`id` integer PRIMARY KEY NOT NULL,
	`psgc_code` text,
	`region_code` text,
	`province_code` text,
	`city_mun_code` text,
	`name` integer
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY NOT NULL,
	`psgc_code` text,
	`region_code` text,
	`province_code` text,
	`name` integer
);
--> statement-breakpoint
CREATE TABLE `provinces` (
	`id` integer PRIMARY KEY NOT NULL,
	`psgc_code` text,
	`region_code` text,
	`name` integer
);
