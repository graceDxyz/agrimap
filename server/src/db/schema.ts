import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const provinces = sqliteTable("provinces", {
  id: integer("id").primaryKey(),
  psgcCode: text("psgc_code").notNull().unique(),
  regionCode: text("region_code").notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
});

export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey(),
  psgcCode: text("psgc_code").notNull().unique(),
  regionCode: text("region_code").notNull(),
  provinceCode: text("province_code").notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
});

export const barangays = sqliteTable("barangays", {
  id: integer("id").primaryKey(),
  psgcCode: text("psgc_code").notNull().unique(),
  regionCode: text("region_code").notNull(),
  provinceCode: text("province_code").notNull(),
  cityMunCode: text("city_mun_code").notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
});

export type Province = typeof provinces.$inferSelect;
export type InsertProvince = typeof provinces.$inferInsert;

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

export type Barangay = typeof barangays.$inferSelect;
export type InsertBarangay = typeof barangays.$inferInsert;
