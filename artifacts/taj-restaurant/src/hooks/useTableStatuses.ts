import { useState, useEffect, useCallback } from "react";
import type { TableStatus } from "@/App";
import { ALL_TABLE_IDS } from "@/App";

const POLL_INTERVAL = 3000;

function defaultStatuses(): Record<string, TableStatus> {
  return Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as TableStatus]));
}

function apiBase(): string {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
  return base.replace(/\/+$/, "");
}

async function fetchStatuses(): Promise<Record<string, TableStatus> | null> {
  try {
    const res = await fetch(`${apiBase()}/api/tables/statuses`);
    if (!res.ok) return null;
    return await res.json() as Record<string, TableStatus>;
  } catch {
    return null;
  }
}

async function patchTableStatus(tableId: string, status: "available" | "occupied"): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/api/tables/${encodeURIComponent(tableId)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function bulkPatchStatuses(statuses: Record<string, "available" | "occupied">): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/api/tables/statuses/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statuses }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchSingleTableStatus(tableId: string): Promise<TableStatus | null> {
  try {
    const res = await fetch(`${apiBase()}/api/tables/statuses`);
    if (!res.ok) return null;
    const data = await res.json() as Record<string, TableStatus>;
    return data[tableId] ?? "available";
  } catch {
    return null;
  }
}

export function useTableStatuses() {
  const [statuses, setStatusesState] = useState<Record<string, TableStatus>>(defaultStatuses);

  const refresh = useCallback(async () => {
    const data = await fetchStatuses();
    if (data) setStatusesState(data);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  const toggleTable = useCallback(async (tableId: string) => {
    setStatusesState(prev => {
      const cur = prev[tableId] ?? "available";
      const next: TableStatus = cur === "available" ? "occupied" : "available";
      patchTableStatus(tableId, next).then(ok => {
        if (!ok) refresh();
      });
      return { ...prev, [tableId]: next };
    });
  }, [refresh]);

  const resetAll = useCallback(async () => {
    const next = Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as const]));
    setStatusesState(prev => ({ ...prev, ...next }));
    const ok = await bulkPatchStatuses(next);
    if (!ok) refresh();
  }, [refresh]);

  const occupyAll = useCallback(async () => {
    const next = Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "occupied" as const]));
    setStatusesState(prev => ({ ...prev, ...next }));
    const ok = await bulkPatchStatuses(next);
    if (!ok) refresh();
  }, [refresh]);

  return { statuses, toggleTable, resetAll, occupyAll, refresh };
}
