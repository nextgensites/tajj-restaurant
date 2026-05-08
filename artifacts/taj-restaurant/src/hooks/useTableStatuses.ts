import { useState, useEffect, useRef, useCallback } from "react";
import type { TableStatus } from "@/App";
import { ALL_TABLE_IDS } from "@/App";

const BLOB_ID = "019e0367-c8d8-76f1-a46d-a8455f9463bd";
const BLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;
const POLL_INTERVAL = 8000;
const LS_KEY = "tajj-table-statuses";

function defaultStatuses(): Record<string, TableStatus> {
  return Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as TableStatus]));
}

function parseStatuses(raw: Record<string, string>): Record<string, TableStatus> {
  return Object.fromEntries(
    ALL_TABLE_IDS.map(id => [id, (raw[id] as TableStatus) ?? "available"])
  );
}

async function fetchFromCloud(): Promise<Record<string, TableStatus> | null> {
  try {
    const res = await fetch(BLOB_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return parseStatuses(data);
  } catch {
    return null;
  }
}

async function saveToCloud(statuses: Record<string, TableStatus>): Promise<boolean> {
  try {
    const res = await fetch(BLOB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(statuses),
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

function saveToLocal(statuses: Record<string, TableStatus>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(statuses));
  } catch {}
}

export function useTableStatuses() {
  const [statuses, setStatusesState] = useState<Record<string, TableStatus>>(loadFromLocal);
  const [synced, setSynced] = useState(false);
  const isWriting = useRef(false);
  const latestStatuses = useRef<Record<string, TableStatus>>(statuses);

  useEffect(() => {
    latestStatuses.current = statuses;
  }, [statuses]);

  const applyStatuses = useCallback((next: Record<string, TableStatus>) => {
    setStatusesState(next);
    saveToLocal(next);
    latestStatuses.current = next;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (isWriting.current) return;
      const cloud = await fetchFromCloud();
      if (!cancelled && cloud && !isWriting.current) {
        applyStatuses(cloud);
        setSynced(true);
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [applyStatuses]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY || !e.newValue) return;
      try {
        const parsed = parseStatuses(JSON.parse(e.newValue));
        setStatusesState(parsed);
        latestStatuses.current = parsed;
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setStatuses = useCallback(
    (updater: Record<string, TableStatus> | ((prev: Record<string, TableStatus>) => Record<string, TableStatus>)) => {
      setStatusesState(prev => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveToLocal(next);
        latestStatuses.current = next;
        isWriting.current = true;
        saveToCloud(next).finally(() => {
          isWriting.current = false;
        });
        return next;
      });
    },
    []
  );

  const reserveTable = useCallback(async (tableId: string): Promise<"ok" | "taken" | "error"> => {
    isWriting.current = true;
    try {
      const cloudState = await fetchFromCloud();
      const base = cloudState ?? latestStatuses.current;

      if (base[tableId] === "reserved" || base[tableId] === "occupied") {
        applyStatuses(base);
        return "taken";
      }

      const next = { ...base, [tableId]: "reserved" as TableStatus };
      applyStatuses(next);

      const ok = await saveToCloud(next);
      if (!ok) return "error";

      return "ok";
    } finally {
      isWriting.current = false;
    }
  }, [applyStatuses]);

  return { statuses, setStatuses, reserveTable, synced };
}
