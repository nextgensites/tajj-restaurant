import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tableStatusesTable = pgTable("table_statuses", {
  tableId: text("table_id").primaryKey(),
  status: text("status").notNull().default("available"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TableStatusRow = typeof tableStatusesTable.$inferSelect;
