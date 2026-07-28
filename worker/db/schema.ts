import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  campus: text("campus").notNull(),
  course: text("course"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
