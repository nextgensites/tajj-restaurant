import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Wind, Leaf, Moon, Flame, Info, X, ShieldCheck,
  Unlock, CheckCircle, RotateCcw, UserCheck, Phone, Calendar, Clock
} from "lucide-react";
import type { TableStatus } from "@/App";
import type { BookingInfo } from "@/hooks/useTableStatuses";

interface TableDef {
  id: string;
  label: string;
  seats: number;
  special?: string;
  row: number;
  col: number;
}

interface Hall {
  key: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  tables: TableDef[];
}

const halls: Hall[] = [
  {
    key: "main", name: "Main Hall", subtitle: "Open dining · vibrant atmosphere",
    icon: <Users size={16} />, accentColor: "#c9a84c",
    tables: [
      { id: "main-1", label: "T1", seats: 4, row: 0, col: 0 }, { id: "main-2", label: "T2", seats: 4, row: 0, col: 1 },
      { id: "main-3", label: "T3", seats: 4, row: 0, col: 2 }, { id: "main-4", label: "T4", seats: 4, row: 1, col: 0 },
      { id: "main-5", label: "T5", seats: 4, row: 1, col: 1 }, { id: "main-6", label: "T6", seats: 4, row: 1, col: 2 },
      { id: "main-7", label: "T7", seats: 4, row: 2, col: 0 }, { id: "main-8", label: "T8", seats: 4, row: 2, col: 1 },
      { id: "main-9", label: "T9", seats: 4, row: 2, col: 2 },
    ],
  },
  {
    key: "ac", name: "A/C Hall", subtitle: "Air-conditioned comfort",
    icon: <Wind size={16} />, accentColor: "#60a5fa",
    tables: [
      { id: "ac-friends-1", label: "F1", seats: 4, row: 0, col: 0, special: "Friends" },
      { id: "ac-friends-2", label: "F2", seats: 4, row: 0, col: 1, special: "Friends" },
      { id: "ac-family-1", label: "Fam1", seats: 8, row: 1, col: 0, special: "Family" },
      { id: "ac-family-2", label: "Fam2", seats: 8, row: 1, col: 1, special: "Family" },
      { id: "ac-family-3", label: "Fam3", seats: 8, row: 1, col: 2, special: "Family" },
    ],
  },
  {
    key: "jungle", name: "Jungle Hall", subtitle: "Nature-themed open ambiance",
    icon: <Leaf size={16} />, accentColor: "#4ade80",
    tables: [
      { id: "jungle-1", label: "T1", seats: 6, row: 0, col: 0 }, { id: "jungle-2", label: "T2", seats: 6, row: 0, col: 1 },
      { id: "jungle-3", label: "T3", seats: 6, row: 0, col: 2 }, { id: "jungle-4", label: "T4", seats: 6, row: 1, col: 0 },
      { id: "jungle-5", label: "T5", seats: 6, row: 1, col: 1 },
    ],
  },
  {
    key: "majlis", name: "New Majlis", subtitle: "Arabian dining experience",
    icon: <Moon size={16} />, accentColor: "#f59e0b",
    tables: [
      { id: "majlis-1", label: "T1", seats: 6, row: 0, col: 0 }, { id: "majlis-2", label: "T2", seats: 6, row: 0, col: 1 },
      { id: "majlis-3", label: "T3", seats: 6, row: 0, col: 2 },
      { id: "majlis-couple-4", label: "T4", seats: 2, row: 1, col: 0, special: "Couple" },
      { id: "majlis-5", label: "T5", seats: 6, row: 1, col: 1 }, { id: "majlis-6", label: "T6", seats: 6, row: 1, col: 2 },
    ],
  },
  {
    key: "red", name: "Red Room", subtitle: "Exclusive private dining",
    icon: <Flame size={16} />, accentColor: "#ef4444",
    tables: [
      { id: "red-room-1", label: "T1", seats: 8, row: 0, col: 0 }, { id: "red-room-2", label: "T2", seats: 8, row: 0, col: 1 },
      { id: "red-room-3", label: "T3", seats: 8, row: 1, col: 0 }, { id: "red-room-4", label: "T4", seats: 8, row: 1, col: 1 },
    ],
  },
  {
    key: "new-majlis-family", name: "New Majlis Family", subtitle: "Spacious family seating, Arabian style",
    icon: <Users size={16} />, accentColor: "#a78bfa",
    tables: [
      { id: "new-majlis-family-1", label: "T1", seats: 10, row: 0, col: 0 },
      { id: "new-majlis-family-2", label: "T2", seats: 10, row: 0, col: 1 },
      { id: "new-majlis-family-3", label: "T3", seats: 10, row: 1, col: 0 },
      { id: "new-majlis-family-4", label: "T4", seats: 10, row: 1, col: 1 },
      { id: "new-majlis-family-5", label: "T5", seats: 10, row: 2, col: 0 },
    ],
  },
];

function statusStyle(status: TableStatus, accentColor: string) {
  switch (status) {
    case "reserved": return {
      bg: "linear-gradient(135deg,#7f0000,#b00000)", border: "1.5px solid rgba(200,0,0,0.7)",
      shadow: "0 0 16px rgba(180,0,0,0.45)", labelColor: "#fca5a5", dotColor: "rgba(252,165,165,0.5)",
      badgeBg: "#7f0000", badgeText: "#fca5a5",
    };
    case "occupied": return {
      bg: "linear-gradient(135deg,#7c4500,#b56500)", border: "1.5px solid rgba(200,120,0,0.7)",
      shadow: "0 0 16px rgba(180,100,0,0.5)", labelColor: "#fed7aa", dotColor: "rgba(251,146,60,0.5)",
      badgeBg: "#7c4500", badgeText: "#fed7aa",
    };
    default: return {
      bg: "rgba(255,255,255,0.04)", border: `1.5px solid ${accentColor}30`,
      shadow: "none", labelColor: "#f5f5f0", dotColor: `${accentColor}55`,
      badgeBg: accentColor, badgeText: "#0a0a0a",
    };
  }
}

function TableCell({ table, status, accentColor, onTap }: {
  table: TableDef; status: TableStatus; accentColor: string; onTap: () => void;
}) {
  const s = statusStyle(status, accentColor);
  return (
    <motion.button onClick={onTap} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
      className="relative flex flex-col items-center justify-center rounded-sm select-none focus:outline-none group"
      style={{ width: table.seats >= 8 ? 80 : 64, height: table.seats >= 8 ? 64 : 56, background: s.bg, border: s.border, boxShadow: s.shadow, transition: "all 0.22s ease" }}>
      {table.special && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wide whitespace-nowrap z-10"
          style={{ background: s.badgeBg, color: s.badgeText }}>{table.special}</span>
      )}
      {status === "occupied" && (
        <motion.div className="absolute inset-0 rounded-sm pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 0 2px rgba(251,146,60,0.5)" }} />
      )}
      {status === "reserved" && (
        <motion.div className="absolute inset-0 rounded-sm pointer-events-none"
          animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 0 2px rgba(239,68,68,0.5)" }} />
      )}
      <span className="text-[11px] font-bold leading-none mb-1" style={{ color: s.labelColor }}>{table.label}</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: Math.min(table.seats, 8) }).map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 4, height: 4, background: s.dotColor }} />
        ))}
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f0" }}>
        {status === "available" ? "Tap → Occupied" : status === "occupied" ? "Tap → Free" : "Tap → Options"}
      </div>
    </motion.button>
  );
}

interface Props {
  staffMode: boolean;
  onExitStaffMode: () => void;
  statuses: Record<string, TableStatus>;
  bookings: Record<string, BookingInfo>;
  setStatuses: (updater: Record<string, TableStatus> | ((prev: Record<string, TableStatus>) => Record<string, TableStatus>)) => void;
  freeTable: (tableId: string) => void;
  resetAll: () => void;
}

export default function TableLayout({ staffMode, onExitStaffMode, statuses, bookings, setStatuses, freeTable, resetAll }: Props) {
  const [activeHall, setActiveHall] = useState(halls[0].key);
  const [legend, setLegend] = useState(false);
  const [actionTable, setActionTable] = useState<{ id: string; label: string; hallName: string } | null>(null);
  const [showLog, setShowLog] = useState(true);

  const handleTap = (id: string, label: string, hallName: string) => {
    const cur = statuses[id] ?? "available";
    if (cur === "available") {
      setStatuses(s => ({ ...s, [id]: "occupied" as TableStatus }));
    } else if (cur === "occupied") {
      freeTable(id);
    } else if (cur === "reserved") {
      setActionTable({ id, label, hallName });
    }
  };

  const handleOccupy = () => {
    if (!actionTable) return;
    setStatuses(s => ({ ...s, [actionTable.id]: "occupied" as TableStatus }));
    setActionTable(null);
  };

  const handleFree = () => {
    if (!actionTable) return;
    freeTable(actionTable.id);
    setActionTable(null);
  };

  const occupyAll = () => setStatuses(s => Object.fromEntries(Object.keys(s).map(id => [id, "occupied" as TableStatus])));

  const allIds = halls.flatMap(h => h.tables.map(t => t.id));
  const available = allIds.filter(id => (statuses[id] ?? "available") === "available").length;
  const reserved  = allIds.filter(id => statuses[id] === "reserved").length;
  const occupied  = allIds.filter(id => statuses[id] === "occupied").length;

  const currentHall = halls.find(h => h.key === activeHall)!;
  const maxRow = Math.max(...currentHall.tables.map(t => t.row));
  const rows = Array.from({ length: maxRow + 1 }, (_, r) => currentHall.tables.filter(t => t.row === r));

  const reservationList = Object.entries(bookings).map(([tableId, info]) => ({
    tableId,
    status: statuses[tableId] ?? "available",
    ...info,
  })).filter(r => statuses[r.tableId] === "reserved" || statuses[r.tableId] === "occupied")
    .sort((a, b) => a.bookedAt.localeCompare(b.bookedAt));

  return (
    <>
      <AnimatePresence>
        {actionTable && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
            onClick={() => setActionTable(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-sm overflow-hidden"
              style={{ background: "#111", border: "1px solid rgba(201,168,76,0.3)" }}>
              <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,transparent,#ef4444,transparent)" }} />
              <div className="px-6 pt-5 pb-2">
                <p className="text-[9px] tracking-[0.3em] text-[#ef4444]/70 uppercase mb-1">Reserved Table</p>
                <p className="text-base font-serif text-[#fca5a5]">{actionTable.label}</p>
                {bookings[actionTable.id] && (
                  <div className="mt-2 p-3 rounded-sm text-xs space-y-1" style={{ background: "rgba(127,0,0,0.15)", border: "1px solid rgba(127,0,0,0.3)" }}>
                    <p className="text-[#fca5a5] font-semibold">{bookings[actionTable.id].name}</p>
                    <p className="text-[#f5f5f0]/50">{bookings[actionTable.id].time} · {bookings[actionTable.id].date} · {bookings[actionTable.id].guests} guests</p>
                    <p className="text-[#f5f5f0]/40">{bookings[actionTable.id].phone}</p>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-3">
                <button onClick={handleOccupy}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200"
                  style={{ background: "rgba(124,69,0,0.25)", border: "1px solid rgba(181,101,0,0.4)", color: "#fed7aa" }}>
                  <UserCheck size={16} className="flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold tracking-wide">Customer Arrived — Mark Occupied</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Guest is seated at the table</p>
                  </div>
                </button>
                <button onClick={handleFree}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200"
                  style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                  <RotateCcw size={16} className="flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold tracking-wide">Cancel Reservation — Free Table</p>
                    <p className="text-[10px] opacity-60 mt-0.5">Remove booking, make available again</p>
                  </div>
                </button>
              </div>
              <button onClick={() => setActionTable(null)}
                className="w-full py-3 text-[10px] tracking-[0.3em] uppercase text-[#f5f5f0]/25 hover:text-[#f5f5f0]/50 transition-colors border-t"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="table-layout" className="py-24 bg-[#080808] relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse,#f59e0b 0%,transparent 70%)" }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-sm tracking-[0.3em] mb-4 uppercase" style={{ color: "#f59e0b" }}>Staff Mode Active</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c]">Floor Plan</h3>
            <p className="text-[#f5f5f0]/40 text-sm mt-4 max-w-md mx-auto">
              Tap any table to change its status. Reserved tables show full booking details and action options.
            </p>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-[10px] tracking-[0.25em] uppercase"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
              <ShieldCheck size={11} /> Staff Controls Active · Live from Cloud
              <button onClick={onExitStaffMode} className="ml-1 text-[#f59e0b]/50 hover:text-[#f59e0b] transition-colors"><X size={10} /></button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-6 mb-10 flex-wrap">
            {[["Available", available, "#4ade80"], ["Reserved", reserved, "#ef4444"], ["Occupied", occupied, "#fb923c"], ["Total", allIds.length, "#c9a84c"]].map(([label, count, color], i, arr) => (
              <div key={label as string} className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: color as string }}>{count}</p>
                  <p className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/40 uppercase mt-0.5">{label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 bg-[#c9a84c]/20" />}
              </div>
            ))}
          </motion.div>

          {/* Hall tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {halls.map(hall => (
              <button key={hall.key} onClick={() => setActiveHall(hall.key)}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200"
                style={{
                  border: activeHall === hall.key ? `1.5px solid ${hall.accentColor}` : "1.5px solid rgba(201,168,76,0.15)",
                  background: activeHall === hall.key ? `${hall.accentColor}15` : "transparent",
                  color: activeHall === hall.key ? hall.accentColor : "rgba(245,245,240,0.4)",
                }}>
                <span style={{ color: activeHall === hall.key ? hall.accentColor : "rgba(245,245,240,0.3)" }}>{hall.icon}</span>
                {hall.name}
              </button>
            ))}
          </div>

          {/* Floor plan */}
          <AnimatePresence mode="wait">
            <motion.div key={activeHall} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }} className="relative mx-auto max-w-2xl">
              <div className="relative rounded-sm overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid rgba(245,158,11,0.3)", boxShadow: "0 0 60px rgba(245,158,11,0.06)" }}>
                <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,transparent,#f59e0b,transparent)" }} />
                <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(245,158,11,0.12)" }}>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#f59e0b" }}><ShieldCheck size={16} /></span>
                    <div>
                      <p className="font-serif text-lg" style={{ color: currentHall.accentColor }}>{currentHall.name}</p>
                      <p className="text-[#f5f5f0]/35 text-xs mt-0.5">Staff controls active · live from cloud</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={onExitStaffMode} className="transition-colors p-1.5 rounded-sm"
                      style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }} title="Exit staff mode">
                      <Unlock size={14} />
                    </button>
                    <button onClick={() => setLegend(l => !l)} className="text-[#f5f5f0]/30 hover:text-[#c9a84c] transition-colors">
                      {legend ? <X size={16} /> : <Info size={16} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {legend && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 py-3 flex flex-col gap-2 text-[10px] tracking-wide text-[#f5f5f0]/50" style={{ borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
                        <div className="flex items-center gap-2"><div className="w-5 h-4 rounded-sm border" style={{ background: "rgba(255,255,255,0.04)", borderColor: `${currentHall.accentColor}30` }} /><span>Available — tap to mark Occupied</span></div>
                        <div className="flex items-center gap-2"><div className="w-5 h-4 rounded-sm" style={{ background: "linear-gradient(135deg,#7c4500,#b56500)" }} /><span>Occupied — tap to free (mark Available)</span></div>
                        <div className="flex items-center gap-2"><div className="w-5 h-4 rounded-sm" style={{ background: "linear-gradient(135deg,#7f0000,#b00000)" }} /><span>Reserved — tap to seat customer or cancel reservation</span></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="px-8 py-1.5 text-[9px] tracking-[0.4em] uppercase" style={{ border: "1px solid rgba(245,158,11,0.2)", color: "rgba(245,158,11,0.5)" }}>Entrance</div>
                  </div>
                  <div className="space-y-5">
                    {rows.map((rowTables, rowIdx) => (
                      <div key={rowIdx} className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="text-[9px] tracking-[0.3em] text-[#f5f5f0]/20 w-6 text-center uppercase">{String.fromCharCode(65 + rowIdx)}</span>
                        {rowTables.sort((a, b) => a.col - b.col).map(table => (
                          <TableCell key={table.id} table={table} status={statuses[table.id] ?? "available"} accentColor={currentHall.accentColor}
                            onTap={() => handleTap(table.id, `${currentHall.name} · ${table.label}`, currentHall.name)} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-5 border-t flex items-center justify-between" style={{ borderColor: `${currentHall.accentColor}12` }}>
                    <div className="flex items-center gap-4 flex-wrap">
                      {(["available", "reserved", "occupied"] as TableStatus[]).map(s => {
                        const count = currentHall.tables.filter(t => (statuses[t.id] ?? "available") === s).length;
                        const color = s === "available" ? "#4ade80" : s === "reserved" ? "#ef4444" : "#fb923c";
                        return (
                          <div key={s} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                            <span className="text-[#f5f5f0]/40 text-[10px]">{count} {s}</span>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[#f5f5f0]/25 text-[10px]">{currentHall.tables.length} tables</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-8 gap-3 flex-wrap">
            <button onClick={resetAll} className="flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border transition-all duration-200 hover:scale-105"
              style={{ border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", background: "rgba(74,222,128,0.05)" }}>
              <CheckCircle size={13} /> Reset All — Free Every Table
            </button>
            <button onClick={occupyAll} className="flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border transition-all duration-200 hover:scale-105"
              style={{ border: "1px solid rgba(124,69,0,0.4)", color: "#fb923c", background: "rgba(124,69,0,0.1)" }}>
              <Users size={13} /> Mark All Occupied
            </button>
            <button onClick={onExitStaffMode} className="flex items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border transition-all duration-200 hover:scale-105"
              style={{ border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", background: "rgba(245,158,11,0.05)" }}>
              <Unlock size={13} /> Exit Staff Mode
            </button>
          </motion.div>

          {/* Booking Log */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif text-xl text-[#c9a84c]">Reservations Log</h4>
                <p className="text-[10px] tracking-[0.2em] text-[#f5f5f0]/30 uppercase mt-0.5">
                  {reservationList.length} active {reservationList.length === 1 ? "booking" : "bookings"}
                </p>
              </div>
              <button onClick={() => setShowLog(l => !l)} className="text-[10px] tracking-[0.2em] uppercase text-[#c9a84c]/50 hover:text-[#c9a84c] transition-colors">
                {showLog ? "Hide" : "Show"}
              </button>
            </div>

            <AnimatePresence>
              {showLog && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  {reservationList.length === 0 ? (
                    <div className="py-10 text-center border rounded-sm" style={{ borderColor: "rgba(201,168,76,0.1)", background: "rgba(255,255,255,0.01)" }}>
                      <p className="text-[#f5f5f0]/25 text-sm">No active reservations right now</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reservationList.map(r => {
                        const hallObj = halls.find(h => h.tables.some(t => t.id === r.tableId));
                        const tableObj = hallObj?.tables.find(t => t.id === r.tableId);
                        const isReserved = r.status === "reserved";
                        return (
                          <motion.div key={r.tableId} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-sm"
                            style={{ background: isReserved ? "rgba(127,0,0,0.12)" : "rgba(124,69,0,0.12)", border: `1px solid ${isReserved ? "rgba(200,0,0,0.2)" : "rgba(200,120,0,0.2)"}` }}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-sm"
                                style={{ background: isReserved ? "rgba(127,0,0,0.3)" : "rgba(124,69,0,0.3)", color: isReserved ? "#fca5a5" : "#fed7aa" }}>
                                {tableObj?.label ?? "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-[#f5f5f0] truncate">{r.name}</p>
                                <p className="text-[10px] text-[#f5f5f0]/40 truncate">{r.hall} · {r.table}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 text-[10px] text-[#f5f5f0]/50 sm:justify-end">
                              <span className="flex items-center gap-1"><Clock size={10} />{r.time}</span>
                              <span className="flex items-center gap-1"><Calendar size={10} />{r.date}</span>
                              <span className="flex items-center gap-1"><Users size={10} />{r.guests} guests</span>
                              <span className="flex items-center gap-1"><Phone size={10} />{r.phone}</span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <span className="px-2 py-0.5 text-[8px] tracking-[0.2em] uppercase font-bold rounded-full"
                                style={{ background: isReserved ? "rgba(127,0,0,0.4)" : "rgba(124,69,0,0.4)", color: isReserved ? "#fca5a5" : "#fed7aa" }}>
                                {r.status}
                              </span>
                              <button onClick={() => freeTable(r.tableId)}
                                className="px-3 py-0.5 text-[8px] tracking-[0.2em] uppercase font-bold rounded-full transition-all hover:scale-105"
                                style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                                Free
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
    </>
  );
}
