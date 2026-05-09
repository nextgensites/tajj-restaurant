import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { z } from "zod/v4";

const router: IRouter = Router();

const updateTableStatusSchema = z.object({
  status: z.enum(["available", "occupied"]),
});

const bulkUpdateSchema = z.object({
  statuses: z.record(z.string(), z.enum(["available", "occupied"])),
});

const allKnownIds = [
  "main-1","main-2","main-3","main-4","main-5","main-6","main-7","main-8","main-9",
  "ac-friends-1","ac-friends-2",
  "ac-family-1","ac-family-2","ac-family-3",
  "jungle-1","jungle-2","jungle-3","jungle-4","jungle-5",
  "majlis-1","majlis-2","majlis-3","majlis-couple-4","majlis-5","majlis-6",
  "red-room-1","red-room-2","red-room-3","red-room-4",
  "new-majlis-family-1","new-majlis-family-2","new-majlis-family-3",
  "new-majlis-family-4","new-majlis-family-5",
];

// GET /tables/statuses — returns the display status for every table.
//
// Priority:
//   1. "occupied"  — staff manually marked occupied
//   2. "reserved"  — staff-locked from a today/past-day booking
//                    OR the reservation date has arrived (reservation_date <= today)
//   3. "available" — no lock, no current reservation
//
// A future-date reservation does NOT colour the table reserved today.
// The table will automatically turn red on the morning of the reservation date.
router.get("/tables/statuses", async (_req, res) => {
  const [staffRows, dueTodayRows] = await Promise.all([
    // Staff-managed overrides: occupied / reserved (same/past-day bookings) / available
    pool.query<{ table_id: string; status: string }>(
      `SELECT table_id, status FROM table_statuses`,
    ),
    // Reservations whose date has arrived (today or overdue) — drives the automatic lock
    pool.query<{ table_id: string }>(
      `SELECT DISTINCT table_id FROM reservations
       WHERE status != 'cancelled'
         AND reservation_date <= CURRENT_DATE::text`,
    ),
  ]);

  const staffMap: Record<string, string> = {};
  for (const row of staffRows.rows) {
    staffMap[row.table_id] = row.status;
  }

  const dueTodaySet = new Set(dueTodayRows.rows.map(r => r.table_id));

  const result: Record<string, "available" | "reserved" | "occupied"> = {};
  for (const id of allKnownIds) {
    if (staffMap[id] === "occupied") {
      result[id] = "occupied";
    } else if (staffMap[id] === "reserved" || dueTodaySet.has(id)) {
      result[id] = "reserved";
    } else {
      result[id] = "available";
    }
  }

  res.json(result);
});

// PATCH /tables/:id/status — staff sets a table to "available" or "occupied".
// "available" fully unlocks: clears any reserved lock and cancels all reservations.
router.patch("/tables/:id/status", async (req, res) => {
  const tableId = req.params["id"];
  if (!tableId) {
    res.status(400).json({ error: "Missing table id" });
    return;
  }

  const parsed = updateTableStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", detail: parsed.error.message });
    return;
  }

  const { status } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO table_statuses (table_id, status, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (table_id) DO UPDATE SET status = $2, updated_at = NOW()`,
      [tableId, status],
    );

    if (status === "available") {
      // Cancel every active reservation so the table is fully free.
      await client.query(
        `UPDATE reservations
         SET status = 'cancelled'
         WHERE table_id = $1
           AND status != 'cancelled'`,
        [tableId],
      );
    }

    await client.query("COMMIT");
    res.json({ tableId, status });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// POST /tables/statuses/bulk — bulk update for staff "reset all" / "mark all occupied".
router.post("/tables/statuses/bulk", async (req, res) => {
  const parsed = bulkUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", detail: parsed.error.message });
    return;
  }

  const entries = Object.entries(parsed.data.statuses);
  if (entries.length === 0) {
    res.json({ updated: 0 });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [tableId, status] of entries) {
      await client.query(
        `INSERT INTO table_statuses (table_id, status, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (table_id) DO UPDATE SET status = $2, updated_at = NOW()`,
        [tableId, status],
      );
      if (status === "available") {
        await client.query(
          `UPDATE reservations
           SET status = 'cancelled'
           WHERE table_id = $1
             AND status != 'cancelled'`,
          [tableId],
        );
      }
    }

    await client.query("COMMIT");
    res.json({ updated: entries.length });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

export default router;
