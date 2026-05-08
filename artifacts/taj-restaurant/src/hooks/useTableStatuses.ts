import { useState, useEffect, useRef, useCallback } from "react";
import type { TableStatus } from "@/App";
import { ALL_TABLE_IDS } from "@/App";

const BLOB_ID = "019e0367-c8d8-76f1-a46d-a8455f9463bd";
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;
const POLL_INTERVAL = 8000;
const LS_KEY = "tajj-table-statuses";
const LS_BOOKINGS_KEY = "tajj-bookings";

export interface BookingInfo {
  name: string;
  phone: string;
  hall: string;
  table: string;
  time: string;
  date: string;
  guests: string;
  bookedAt: string;
}

function defaultStatuses(): Record<string, TableStatus> {
  return Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as TableStatus]));
}

function parseStatuses(raw: Record<string, unknown>): Record<string, TableStatus> {
  return Object.fromEntries(
    ALL_TABLE_IDS.map(id => [id, (raw[id] as TableStatus) ?? "available"])
  );
}

function parseBookings(raw: Record<string, unknown>): Record<string, BookingInfo> {
  try {
    const b = raw["_bookings"];
    if (b && typeof b === "object") return b as Record<string, BookingInfo>;
  } catch {}
  return {};
}

async function fetchRawCloud(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(BLOB_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function saveToCloud(
  statuses: Record<string, TableStatus>,
  bookings: Record<string, BookingInfo>
): Promise<boolean> {
  try {
    const payload = { ...statuses, _bookings: bookings };
    const res = await fetch(BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function loadFromLocal(): Record<string, TableStatus> {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) return parseStatuses(JSON.parse(saved));
  } catch {}
  return defaultStatuses();
}

function loadBookingsFromLocal(): Record<string, BookingInfo> {
  try {
    const saved = localStorage.getItem(LS_BOOKINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function saveToLocal(statuses: Record<string, TableStatus>, bookings: Record<string, BookingInfo>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(statuses));
    localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {}
}

export function useTableStatuses() {
  const [statuses, setStatusesState] = useState<Record<string, TableStatus>>(loadFromLocal);
  const [bookings, setBookingsState] = useState<Record<string, BookingInfo>>(loadBookingsFromLocal);
  const [synced, setSynced] = useState(false);
  const isWriting = useRef(false);
  const latestStatuses = useRef<Record<string, TableStatus>>(statuses);
  const latestBookings = useRef<Record<string, BookingInfo>>(bookings);

  useEffect(() => { latestStatuses.current = statuses; }, [statuses]);
  useEffect(() => { latestBookings.current = bookings; }, [bookings]);

  const applyState = useCallback((nextStatuses: Record<string, TableStatus>, nextBookings: Record<string, BookingInfo>) => {
    setStatusesState(nextStatuses);
    setBookingsState(nextBookings);
    saveToLocal(nextStatuses, nextBookings);
    latestStatuses.current = nextStatuses;
    latestBookings.current = nextBookings;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (isWriting.current) return;
      const raw = await fetchRawCloud();
      if (!cancelled && raw && !isWriting.current) {
        applyState(parseStatuses(raw), parseBookings(raw));
        setSynced(true);
      }
    };
    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => { cancelled = true; clearInterval(id); };
  }, [applyState]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY && e.newValue) {
        try { const p = parseStatuses(JSON.parse(e.newValue)); setStatusesState(p); latestStatuses.current = p; } catch {}
      }
      if (e.key === LS_BOOKINGS_KEY && e.newValue) {
        try { const p = JSON.parse(e.newValue); setBookingsState(p); latestBookings.current = p; } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setStatuses = useCallback(
    (updater: Record<string, TableStatus> | ((prev: Record<string, TableStatus>) => Record<string, TableStatus>)) => {
      setStatusesState(prev => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const bk = latestBookings.current;
        saveToLocal(next, bk);
        latestStatuses.current = next;
        isWriting.current = true;
        saveToCloud(next, bk).finally(() => { isWriting.current = false; });
        return next;
      });
    }, []
  );

  const refreshStatuses = useCallback(async () => {
    const raw = await fetchRawCloud();
    if (raw) {
      applyState(parseStatuses(raw), parseBookings(raw));
      setSynced(true);
    }
  }, [applyState]);

  const reserveTable = useCallback(async (
    tableId: string,
    bookingInfo: BookingInfo
  ): Promise<"ok" | "taken" | "occupied" | "error"> => {
    isWriting.current = true;
    try {
      const raw = await fetchRawCloud();
      const baseStatuses = raw ? parseStatuses(raw) : latestStatuses.current;
      const baseBookings = raw ? parseBookings(raw) : latestBookings.current;

      if (baseStatuses[tableId] === "occupied") { applyState(baseStatuses, baseBookings); return "occupied"; }
      if (baseStatuses[tableId] === "reserved") { applyState(baseStatuses, baseBookings); return "taken"; }

      const nextStatuses = { ...baseStatuses, [tableId]: "reserved" as TableStatus };
      const nextBookings = { ...baseBookings, [tableId]: bookingInfo };
      applyState(nextStatuses, nextBookings);

      const ok = await saveToCloud(nextStatuses, nextBookings);
      if (!ok) return "error";
      return "ok";
    } finally {
      isWriting.current = false;
    }
  }, [applyState]);

  const freeTable = useCallback((tableId: string) => {
    const nextStatuses = { ...latestStatuses.current, [tableId]: "available" as TableStatus };
    const nextBookings = { ...latestBookings.current };
    delete nextBookings[tableId];
    applyState(nextStatuses, nextBookings);
    isWriting.current = true;
    saveToCloud(nextStatuses, nextBookings).finally(() => { isWriting.current = false; });
  }, [applyState]);

  const resetAll = useCallback(() => {
    const nextStatuses = Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as TableStatus]));
    const nextBookings: Record<string, BookingInfo> = {};
    applyState(nextStatuses, nextBookings);
    isWriting.current = true;
    saveToCloud(nextStatuses, nextBookings).finally(() => { isWriting.current = false; });
  }, [applyState]);

  return { statuses, bookings, setStatuses, refreshStatuses, reserveTable, freeTable, resetAll, synced };
}
