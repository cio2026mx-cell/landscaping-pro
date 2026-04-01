CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`imageUrl` varchar(500),
	`unitPrice` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`specifications` json,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materialEstimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`inventoryId` int NOT NULL,
	`estimatedQuantity` decimal(12,2) NOT NULL,
	`unitCost` decimal(10,2) NOT NULL,
	`totalCost` decimal(12,2) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materialEstimates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectElements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`inventoryId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`positionX` decimal(10,2) NOT NULL,
	`positionY` decimal(10,2) NOT NULL,
	`rotation` decimal(5,2) DEFAULT '0',
	`scale` decimal(5,2) DEFAULT '1',
	`properties` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectElements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','in_progress','completed','archived') NOT NULL DEFAULT 'draft',
	`terrainData` json,
	`designData` json,
	`totalArea` decimal(12,2),
	`estimatedCost` decimal(12,2),
	`thumbnailUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terrainAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`analysisType` varchar(100) NOT NULL,
	`data` json NOT NULL,
	`confidence` decimal(3,2),
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `terrainAnalysis_id` PRIMARY KEY(`id`)
);
