import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  images: text("images", { mode: "json" }).$type<string[]>().default([]),
  link: text("link"),
  github: text("github"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  status: text("status").default("live"), // live, archived, draft
  metadata: text("metadata", { mode: "json" }).default({}),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  contactEmail: text("contact_email"),
  socials: text("socials", { mode: "json" }).$type<{ github?: string, linkedin?: string, twitter?: string, whatsapp?: string }>().default({
    github: "",
    linkedin: "",
    twitter: "",
    whatsapp: ""
  }),
  location: text("location").default("Bali, Indonesia"),
  resumeUrl: text("resume_url"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  group: text("group").default("general"), // general, seo, technical
  description: text("description"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
