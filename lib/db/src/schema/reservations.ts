import { pgTable, text, serial, integer, timestamp, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const reservationsTable = pgTable(
  "reservations",
  {
    id: serial("id").primaryKey(),
    tableId: text("table_id").notNull(),
    hallName: text("hall_name").notNull(),
    tableName: text("table_name").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    reservationDate: text("reservation_date").notNull(),
    reservationTime: text("reservation_time").notNull(),
    guestCount: integer("guest_count").notNull(),
    specialRequest: text("special_request"),
    status: reservationStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("reservations_table_date_time_idx").on(
      table.tableId,
      table.reservationDate,
      table.reservationTime,
    ),
  ],
);

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const selectReservationSchema = createSelectSchema(reservationsTable);

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
