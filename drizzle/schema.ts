import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Inventory table for plants and materials
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // e.g., 'plant', 'hardscape', 'mulch'
  imageUrl: varchar("imageUrl", { length: 500 }),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., 'piece', 'sqft', 'cubic_yard'
  quantity: int("quantity").default(0).notNull(),
  specifications: json("specifications"), // e.g., {height: '2m', width: '1m', color: 'green'}
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// Projects table
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "archived"]).default("draft").notNull(),
  terrainData: json("terrainData"), // Stores terrain analysis data
  designData: json("designData"), // Stores canvas design elements
  totalArea: decimal("totalArea", { precision: 12, scale: 2 }), // in square feet
  estimatedCost: decimal("estimatedCost", { precision: 12, scale: 2 }),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Project elements (items placed on canvas)
export const projectElements = mysqlTable("projectElements", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  inventoryId: int("inventoryId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  positionX: decimal("positionX", { precision: 10, scale: 2 }).notNull(),
  positionY: decimal("positionY", { precision: 10, scale: 2 }).notNull(),
  rotation: decimal("rotation", { precision: 5, scale: 2 }).default("0"),
  scale: decimal("scale", { precision: 5, scale: 2 }).default("1"),
  properties: json("properties"), // Custom properties for this element
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectElement = typeof projectElements.$inferSelect;
export type InsertProjectElement = typeof projectElements.$inferInsert;

// Terrain analysis data
export const terrainAnalysis = mysqlTable("terrainAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  analysisType: varchar("analysisType", { length: 100 }).notNull(), // e.g., 'soil_type', 'slope', 'drainage'
  data: json("data").notNull(), // Raw analysis data from Wavespeed or manual input
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0-1 confidence score
  source: varchar("source", { length: 100 }), // 'wavespeed', 'manual', 'satellite'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TerrainAnalysis = typeof terrainAnalysis.$inferSelect;
export type InsertTerrainAnalysis = typeof terrainAnalysis.$inferInsert;

// Material calculations and estimates
export const materialEstimates = mysqlTable("materialEstimates", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  inventoryId: int("inventoryId").notNull(),
  estimatedQuantity: decimal("estimatedQuantity", { precision: 12, scale: 2 }).notNull(),
  unitCost: decimal("unitCost", { precision: 10, scale: 2 }).notNull(),
  totalCost: decimal("totalCost", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MaterialEstimate = typeof materialEstimates.$inferSelect;
export type InsertMaterialEstimate = typeof materialEstimates.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  inventoryItems: many(inventory),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  elements: many(projectElements),
  terrainAnalysis: many(terrainAnalysis),
  materialEstimates: many(materialEstimates),
}));

export const projectElementsRelations = relations(projectElements, ({ one }) => ({
  project: one(projects, { fields: [projectElements.projectId], references: [projects.id] }),
  inventory: one(inventory, { fields: [projectElements.inventoryId], references: [inventory.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  creator: one(users, { fields: [inventory.createdBy], references: [users.id] }),
  projectElements: many(projectElements),
  materialEstimates: many(materialEstimates),
}));

export const terrainAnalysisRelations = relations(terrainAnalysis, ({ one }) => ({
  project: one(projects, { fields: [terrainAnalysis.projectId], references: [projects.id] }),
}));

export const materialEstimatesRelations = relations(materialEstimates, ({ one }) => ({
  project: one(projects, { fields: [materialEstimates.projectId], references: [projects.id] }),
  inventory: one(inventory, { fields: [materialEstimates.inventoryId], references: [inventory.id] }),
}));
