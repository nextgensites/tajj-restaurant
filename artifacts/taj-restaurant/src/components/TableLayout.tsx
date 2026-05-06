import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Wind, Leaf, Moon, Flame, Info, X, ShieldCheck, Unlock } from "lucide-react";
import type { TableStatus } from "@/App";

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
    key: "main",
    name: "Main Hall",
    subtitle: "Open dining · vibrant atmosphere",
    icon: <Users size={16} />,
    accentColor: "#c9a84c",
    tables: [
      { id: "main-1", label: "T1", seats: 4, row: 0, col: 0 },
      { id: "main-2", label: "T2", seats: 4, row: 0, col: 1 },
      { id: "main-3", label: "T3", seats: 4, row: 0, col: 2 },
      { id: "main-4", label: "T4", seats: 4, row: 1, col: 0 },
      { id: "main-5", label: "T5", seats: 4, row: 1, col: 1 },
      { id: "main-6", label: "T6", seats: 4, row: 1, col: 2 },
      { id: "main-7", label: "T7", seats: 4, row: 2, col: 0 },
      { id: "main-8", label: "T8", seats: 4, row: 2, col: 1 },
      { id: "main-9", label: "T9", seats: 4, row: 2, col: 2 },
    ],
  },
  {
    key: "ac",
    name: "A/C Hall",
    subtitle: "Air-conditioned comfort",
    icon: <Wind size={16} />,
    accentColor: "#60a5fa",
    tables: [
      { id: "ac-friends-1", label: "F1", seats: 4, row: 0, col: 0, special: "Friends" },
      { id: "ac-friends-2", label: "F2", seats: 4, row: 0, col: 1, special: "Friends" },
      { id: "ac-family-1",  label: "Fam1", seats: 8, row: 1, col: 0, special: "Family" },
      { id: "ac-family-2",  label: "Fam2", seats: 8, row: 1, col: 1, special: "Family" },
      { id: "ac-family-3",  label: "Fam3", seats: 8, row: 1, col: 2, special: "Family" },
    ],
  },
  {
    key: "jungle",
    name: "Jungle Hall",
    subtitle: "Nature-themed open ambiance",
    icon: <Leaf size={16} />,
    accentColor: "#4ade80",
    tables: [
      { id: "jungle-1", label: "T1", seats: 6, row: 0, col: 0 },
      { id: "jungle-2", label: "T2", seats: 6, row: 0, col: 1 },
      { id: "jungle-3", label: "T3", seats: 6, row: 0, col: 2 },
      { id: "jungle-4", label: "T4", seats: 6, row: 1, col: 0 },
      { id: "jungle-5", label: "T5", seats: 6, row: 1, col: 1 },
    ],
  },
  {
    key: "majlis",
    name: "New Majlis",
    subtitle: "Arabian dining experience",
    icon: <Moon size={16} />,
    accentColor: "#f59e0b",
    tables: [
      { id: "majlis-1",        label: "T1", seats: 6, row: 0, col: 0 },
      { id: "majlis-2",        label: "T2", seats: 6, row: 0, col: 1 },
      { id: "majlis-3",        label: "T3", seats: 6, row: 0, col: 2 },
      { id: "majlis-couple-4", label: "T4", seats: 2, row: 1, col: 0, special: "Couple" },
      { id: "majlis-5",        label: "T5", seats: 6, row: 1, col: 1 },
      { id: "majlis-6",        label: "T6", seats: 6, row: 1, col: 2 },
    ],
  },
  {
    key: "red",
    name: "Red Room",
    subtitle: "Exclusive private dining",
    icon: <Flame size={16} />,
    accentColor: "#ef4444",
    tables: [
      { id: "red-room-1", label: "T1", seats: 8, row: 0, col: 0 },
      { id: "red-room-2", label: "T2", seats: 8, row: 0, col: 1 },
      { id: "red-room-3", label: "T3", seats: 8, row: 1, col: 0 },
      { id: "red-room-4", label: "T4", seats: 8, row: 1, col: 1 },
    ],
  },
  {
    key: "new-majlis-family",
    name: "New Majlis Family",
    subtitle: "Spacious family seating, Arabian style",
    icon: <Users size={16} />,
    accentColor: "#a78bfa",
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
    case "reserved":
      return {
        bg: "linear-gradient(135deg,#7f0000,#b00000)",
        border: "1.5px solid rgba(200,0,0,0.7)",
        shadow: "0 0 16px rgba(180,0,0,0.45), inset 0 0 8px rgba(255,0,0,0.1)",
        labelColor: "#fca5a5",
        dotColor: "rgba(252,165,165,0.5)",
        badgeBg: "#7f0000",
        badgeText: "#fca5a5",
      };
    case "occupied":
      return {
        bg: "linear-gradient(135deg,#7c4500,#b56500)",
        border: "1.5px solid rgba(200,120,0,0.7)",
        shadow: "0 0 16px rgba(180,100,0,0.5), inset 0 0 8px rgba(251,146,60,0.15)",
        labelColor: "#fed7aa",
        dotColor: "rgba(251,146,60,0.5)",
        badgeBg: "#7c4500",
        badgeText: "#fed7aa",
      };
    default:
      return {
        bg: "rgba(255,255,255,0.04)",
        border: `1.5px solid ${accentColor}30`,
        shadow: "0 0 0px transparent",
        labelColor: "#f5f5f0",
        dotColor: `${accentColor}55`,
        badgeBg: accentColor,
        badgeText: "#0a0a0a",
      };
  }
}

function TableCell({
  table, status, accentColor, onToggle,
}: {
  table: TableDef;
  status: TableStatus;
  accentColor: string;
  onToggle: () => void;
}) {
  const s = statusStyle(status, accentColor);
  const tooltipText =
    status === "available" ? "Tap to mark occupied" :
    status === "occupied"  ? "Tap to mark available" :
    "Tap to free table";

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
      className="relative flex flex-col items-center justify-center rounded-sm select-none focus:outline-none group"
      style={{
        width: table.seats >= 8 ? 80 : 64,
        height: table.seats >= 8 ? 64 : 56,
        background: s.bg, border: s.border, boxShadow: s.shadow,
        transition: "background 0.22s ease, box-shadow 0.22s ease, border 0.22s ease",
      }}
    >
      {table.special && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wide whitespace-nowrap z-10"
          style={{ background: s.badgeBg, color: s.badgeText }}>
          {table.special}
        </span>
      )}

      {status === "occupied" && (
        <motion.div
          className="absolute inset-0 rounded-sm pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 0 2px rgba(251,146,60,0.5)" }}
        />
      )}

      <span className="text-[11px] font-bold leading-none mb-1" style={{ color: s.labelColor }}>
        {table.label}
      </span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: Math.min(table.seats, 8) }).map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 4, height: 4, background: s.dotColor }} />
        ))}
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f5f5f0" }}>
        {table.seats}p · {tooltipText}
      </div>
    </motion.button>
  );
}

interface Props {
  staffMode: boolean;
  onExitStaffMode: () => void;
  statuses: Record<string, TableStatus>;
  setStatuses: React.Dispatch<React.SetStateAction<Record<string, TableStatus>>>;
}

export default function TableLayout({ staffMode, onExitStaffMode, statuses, setStatuses }: Props) {
  const [activeHall, setActiveHall] = useState(halls[0].key);
  const [legend, setLegend] = useState(false);

  const toggle = (id: string) => {
    setStatuses(s => {
      const cur = s[id];
      if (cur === "available") return { ...s, [id]: "occupied" };
      if (cur === "occupied")  return { ...s, [id]: "available" };
      return { ...s, [id]: "available" };
    });
  };

  const allIds = halls.flatMap(h => h.tables.map(t => t.id));
  const available = allIds.filter(id => statuses[id] === "available").length;
  const reserved  = allIds.filter(id => statuses[id] === "reserved").length;
  const occupied  = allIds.filter(id => statuses[id] === "occupied").length;

  const currentHall = halls.find(h => h.key === activeHall)!;
  const maxRow = Math.max(...currentHall.tables.map(t => t.row));
  const rows = Array.from({ length: maxRow + 1 }, (_, r) =>
    currentHall.tables.filter(t => t.row === r)
  );

  return (
    <section id="table-layout" className="py-24 bg-[#080808] relative z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#f59e0b 0%,transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-sm tracking-[0.3em] mb-4 uppercase" style={{ color: "#f59e0b" }}>
            Staff Mode Active
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c]">Floor Plan</h3>
          <p className="text-[#f5f5f0]/40 text-sm mt-4 max-w-md mx-auto">
            Click any table to toggle between available and occupied. Changes reflect instantly in the customer booking flow.
          </p>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-[10px] tracking-[0.25em] uppercase"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
            <ShieldCheck size={11} />
            Restricted · Staff Only
            <button onClick={onExitStaffMode}
              className="ml-1 text-[#f59e0b]/50 hover:text-[#f59e0b] transition-colors">
              <X size={10} />
            </button>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="flex items-center justify-center gap-6 mb-10 flex-wrap">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#4ade80]">{available}</p>
            <p className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/40 uppercase mt-0.5">Available</p>
          </div>
          <div className="w-px h-8 bg-[#c9a84c]/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#ef4444]">{reserved}</p>
            <p className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/40 uppercase mt-0.5">Reserved</p>
          </div>
          <div className="w-px h-8 bg-[#c9a84c]/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#fb923c]">{occupied}</p>
            <p className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/40 uppercase mt-0.5">Occupied</p>
          </div>
          <div className="w-px h-8 bg-[#c9a84c]/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#c9a84c]">{allIds.length}</p>
            <p className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/40 uppercase mt-0.5">Total</p>
          </div>
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
              <span style={{ color: activeHall === hall.key ? hall.accentColor : "rgba(245,245,240,0.3)" }}>
                {hall.icon}
              </span>
              {hall.name}
            </button>
          ))}
        </div>

        {/* Floor plan card */}
        <AnimatePresence mode="wait">
          <motion.div key={activeHall} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }}
            className="relative mx-auto max-w-2xl">
            <div className="relative rounded-sm overflow-hidden"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(245,158,11,0.3)",
                boxShadow: "0 0 60px rgba(245,158,11,0.06)",
              }}>
              <div className="h-0.5 w-full"
                style={{ background: "linear-gradient(90deg,transparent,#f59e0b,transparent)" }} />

              {/* Hall header */}
              <div className="px-6 py-5 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(245,158,11,0.12)" }}>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#f59e0b" }}><ShieldCheck size={16} /></span>
                  <div>
                    <p className="font-serif text-lg" style={{ color: currentHall.accentColor }}>
                      {currentHall.name}
                    </p>
                    <p className="text-[#f5f5f0]/35 text-xs mt-0.5">Staff controls active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onExitStaffMode}
                    className="transition-colors p-1.5 rounded-sm"
                    style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
                    title="Exit staff mode">
                    <Unlock size={14} />
                  </button>
                  <button onClick={() => setLegend(l => !l)}
                    className="text-[#f5f5f0]/30 hover:text-[#c9a84c] transition-colors">
                    {legend ? <X size={16} /> : <Info size={16} />}
                  </button>
                </div>
              </div>

              {/* Legend */}
              <AnimatePresence>
                {legend && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-6 py-3 flex flex-wrap items-center gap-4 text-[10px] tracking-wide text-[#f5f5f0]/50"
                      style={{ borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-sm border" style={{ background: "rgba(255,255,255,0.04)", borderColor: `${currentHall.accentColor}30` }} />
                        <span>Available — bookable by customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-sm" style={{ background: "linear-gradient(135deg,#7f0000,#b00000)", border: "1.5px solid rgba(200,0,0,0.7)" }} />
                        <span>Reserved — customer booking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-sm" style={{ background: "linear-gradient(135deg,#7c4500,#b56500)", border: "1.5px solid rgba(200,120,0,0.7)" }} />
                        <span>Occupied — disabled in booking flow</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tables */}
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="px-8 py-1.5 text-[9px] tracking-[0.4em] uppercase"
                    style={{ border: "1px solid rgba(245,158,11,0.2)", color: "rgba(245,158,11,0.5)" }}>
                    Entrance
                  </div>
                </div>

                <div className="space-y-5">
                  {rows.map((rowTables, rowIdx) => (
                    <div key={rowIdx} className="flex items-center justify-center gap-4 flex-wrap">
                      <span className="text-[9px] tracking-[0.3em] text-[#f5f5f0]/20 w-6 text-center uppercase">
                        {String.fromCharCode(65 + rowIdx)}
                      </span>
                      {rowTables.sort((a, b) => a.col - b.col).map(table => (
                        <TableCell
                          key={table.id}
                          table={table}
                          status={statuses[table.id] ?? "available"}
                          accentColor={currentHall.accentColor}
                          onToggle={() => toggle(table.id)}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Per-hall stats footer */}
                <div className="mt-8 pt-5 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: `${currentHall.accentColor}12` }}>
                  <div className="flex items-center gap-4 flex-wrap">
                    {(["available","reserved","occupied"] as TableStatus[]).map(s => {
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

        {/* Bottom action buttons */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex justify-center mt-8 gap-3 flex-wrap">
          <button
            onClick={() => setStatuses(s => Object.fromEntries(Object.keys(s).map(id => [id, "available" as TableStatus])))}
            className="px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border border-[#c9a84c]/20 text-[#f5f5f0]/35 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all duration-200">
            Reset All Tables
          </button>
          <button
            onClick={() => setStatuses(s => Object.fromEntries(Object.keys(s).map(id => [id, "occupied" as TableStatus])))}
            className="px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border border-[#7c4500]/30 text-[#f5f5f0]/35 hover:border-[#b56500]/60 hover:text-[#fb923c] transition-all duration-200">
            Mark All Occupied
          </button>
          <button
            onClick={onExitStaffMode}
            className="px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase border border-[#f59e0b]/25 text-[#f59e0b]/50 hover:border-[#f59e0b]/60 hover:text-[#f59e0b] transition-all duration-200">
            Exit Staff Mode
          </button>
        </motion.div>

      </div>
    </section>
  );
}
