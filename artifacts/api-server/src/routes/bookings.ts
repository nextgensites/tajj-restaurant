import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { z } from "zod/v4";

const router: IRouter = Router();

const createBookingSchema = z.object({
  tableId: z.string().min(1),
  hallName: z.string().min(1),
  tableName: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  reservationTime: z.string().min(1),
  guestCount: z.number().int().min(1),
  specialRequest: z.string().nullable().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled"]),
});

router.post("/bookings", async (req, res) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", detail: parsed.error.message });
    return;
  }

  const {
    tableId, hallName, tableName, customerName, customerPhone,
    reservationDate, reservationTime, guestCount, specialRequest,
  } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Acquire a PostgreSQL advisory transaction lock scoped to this
    // (table, date, time) combination. Two concurrent requests for the
    // same slot will race here — the second one gets false and is
    // immediately rejected without waiting, preventing double-booking.
    const lockKey1 = `${tableId}::${reservationDate}`;
    const lockKey2 = reservationTime;
    const lockResult = await client.query<{ acquired: boolean }>(
      `SELECT pg_try_advisory_xact_lock(hashtext($1), hashtext($2)) AS acquired`,
      [lockKey1, lockKey2],
    );

    if (!lockResult.rows[0]?.acquired) {
      await client.query("ROLLBACK");
      res.status(409).json({
        error: "Booking in progress",
        detail: "Another booking for this slot is being processed. Please try again in a moment.",
      });
      return;
    }

    // Check whether an active (non-cancelled) reservation already exists
    // for this exact slot. The unique index on the table also guards this,
    // but the explicit check gives us a clear error message.
    const existing = await client.query(
      `SELECT id FROM reservations
       WHERE table_id = $1
         AND reservation_date = $2
         AND reservation_time = $3
         AND status != 'cancelled'`,
      [tableId, reservationDate, reservationTime],
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      res.status(409).json({
        error: "Table already booked",
        detail: `${tableName} in ${hallName} is already reserved for ${reservationDate} at ${reservationTime}. Please choose a different table or time.`,
      });
      return;
    }

    const result = await client.query(
      `INSERT INTO reservations
         (table_id, hall_name, table_name, customer_name, customer_phone,
          reservation_date, reservation_time, guest_count, special_request, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING *`,
      [tableId, hallName, tableName, customerName, customerPhone,
       reservationDate, reservationTime, guestCount, specialRequest ?? null],
    );

    await client.query("COMMIT");

    const row = result.rows[0];
    res.status(201).json(mapRow(row));
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    // Unique constraint violation — extremely rare race that slips past the
    // advisory lock (e.g. lock acquired on different DB connections).
    if (isUniqueViolation(err)) {
      res.status(409).json({
        error: "Table already booked",
        detail: "This slot was just taken by another booking. Please choose a different table or time.",
      });
      return;
    }
    throw err;
  } finally {
    client.release();
  }
});

router.get("/bookings", async (req, res) => {
  const { status, date } = req.query;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (typeof status === "string" && ["pending", "confirmed", "cancelled"].includes(status)) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    params.push(date);
    conditions.push(`reservation_date = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await pool.query(
    `SELECT * FROM reservations ${where} ORDER BY reservation_date, reservation_time, created_at`,
    params,
  );

  res.json(result.rows.map(mapRow));
});

router.patch("/bookings/:id", async (req, res) => {
  const id = parseInt(req.params["id"] ?? "", 10);
  if (isNaN(id)) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", detail: parsed.error.message });
    return;
  }

  const result = await pool.query(
    `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
    [parsed.data.status, id],
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(mapRow(result.rows[0]));
});

function mapRow(row: Record<string, unknown>) {
  return {
    id: row["id"],
    tableId: row["table_id"],
    hallName: row["hall_name"],
    tableName: row["table_name"],
    customerName: row["customer_name"],
    customerPhone: row["customer_phone"],
    reservationDate: row["reservation_date"],
    reservationTime: row["reservation_time"],
    guestCount: row["guest_count"],
    specialRequest: row["special_request"] ?? null,
    status: row["status"],
    createdAt: row["created_at"],
  };
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
}

export default router;
