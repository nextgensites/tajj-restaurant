import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CalendarCheck, Clock, User, Phone, CheckCircle,
  ChevronLeft, Users, Wind, Leaf, Moon, Flame
} from "lucide-react";
import type { TableStatus } from "@/App";
import mainHallImg from "../assets/main-hall.jpg";
import acHallImg from "../assets/ac-hall.jpg";
import majlisHallImg from "../assets/majlis-hall.jpg";
import majlisHall2Img from "../assets/majlis-hall-2.jpg";
import redRoomImg from "../assets/red-room.jpg";
import newMajlisFamilyImg from "../assets/new-majlis-family.jpg";
import jungleHallImg from "../assets/jungle-hall.jpg";

interface Props {
  open: boolean;
  onClose: () => void;
  tableStatuses: Record<string, TableStatus>;
  reserveTable: (tableId: string) => Promise<"ok" | "taken" | "error">;
}

type HallKey = "main" | "ac" | "jungle" | "majlis" | "red" | "new-majlis-family";

interface TableOption {
  id: string;
  label: string;
  seats: number;
  type?: string;
  special?: string;
}

interface Hall {
  key: HallKey;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  image: string;
  sections: {
    title?: string;
    tables: TableOption[];
  }[];
}

const halls: Hall[] = [
  {
    key: "main",
    name: "Main Hall",
    subtitle: "Open dining, vibrant atmosphere",
    icon: <Users size={20} />,
    color: "#c9a84c",
    image: mainHallImg,
    sections: [
      {
        tables: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({
          id: `main-${n}`,
          label: `Table ${n}`,
          seats: 4,
        })),
      },
    ],
  },
  {
    key: "ac",
    name: "A/C Hall",
    subtitle: "Air-conditioned comfort",
    icon: <Wind size={20} />,
    color: "#60a5fa",
    image: acHallImg,
    sections: [
      {
        title: "Friends — 4 Seater",
        tables: [1, 2].map(n => ({
          id: `ac-friends-${n}`,
          label: `Table ${n}`,
          seats: 4,
          type: "Friends",
        })),
      },
      {
        title: "Family — 8 Seater",
        tables: [1, 2, 3].map(n => ({
          id: `ac-family-${n}`,
          label: `Table ${n}`,
          seats: 8,
          type: "Family",
        })),
      },
    ],
  },
  {
    key: "jungle",
    name: "Jungle Hall",
    subtitle: "Nature-themed open ambiance",
    icon: <Leaf size={20} />,
    color: "#4ade80",
    image: jungleHallImg,
    sections: [
      {
        title: "6 Seater Tables",
        tables: [1, 2, 3, 4, 5].map(n => ({
          id: `jungle-${n}`,
          label: `Table ${n}`,
          seats: 6,
        })),
      },
    ],
  },
  {
    key: "red",
    name: "Red Room",
    subtitle: "Exclusive private dining experience",
    icon: <Flame size={20} />,
    color: "#ef4444",
    image: redRoomImg,
    sections: [
      {
        title: "8 Seater Tables",
        tables: [1, 2, 3, 4].map(n => ({
          id: `red-room-${n}`,
          label: `Table ${n}`,
          seats: 8,
        })),
      },
    ],
  },
  {
    key: "majlis",
    name: "New Majlis",
    subtitle: "A wonderful Arabian dinner experience",
    icon: <Moon size={20} />,
    color: "#f59e0b",
    image: majlisHall2Img,
    sections: [
      {
        title: "6 Seater Tables",
        tables: [1, 2, 3, 5, 6].map(n => ({
          id: `majlis-${n}`,
          label: `Table ${n}`,
          seats: 6,
        })),
      },
      {
        title: "Couple's Table",
        tables: [
          {
            id: "majlis-couple-4",
            label: "Table 4",
            seats: 2,
            special: "Couple",
          },
        ],
      },
    ],
  },
  {
    key: "new-majlis-family",
    name: "New Majlis Family",
    subtitle: "Spacious family seating, Arabian style",
    icon: <Users size={20} />,
    color: "#a78bfa",
    image: newMajlisFamilyImg,
    sections: [
      {
        title: "10 Seater Tables",
        tables: [1, 2, 3, 4, 5].map(n => ({
          id: `new-majlis-family-${n}`,
          label: `Table ${n}`,
          seats: 10,
        })),
      },
    ],
  },
];

const timeSlots = [
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
  "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
  "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
  "11:00 PM", "11:30 PM", "12:00 AM",
];

type Step = "hall" | "table" | "details" | "done";

export default function ReserveTable({ open, onClose, tableStatuses, reserveTable }: Props) {
  const [step, setStep] = useState<Step>("hall");
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableOption | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "", note: "" });
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleClose = () => {
    setStep("hall");
    setSelectedHall(null);
    setSelectedTable(null);
    setForm({ name: "", phone: "", date: "", time: "", guests: "", note: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hall = selectedHall!;
    const table = selectedTable!;

    setSubmitting(true);
    const result = await reserveTable(table.id);
    setSubmitting(false);

    if (result === "taken") {
      alert(`Sorry, ${table.label} in ${hall.name} was just taken by someone else. Please choose another table.`);
      setStep("table");
      return;
    }

    if (result === "error") {
      alert("Could not save your reservation — please check your connection and try again.");
      return;
    }

    const sectionName = (() => {
      for (const sec of hall.sections) {
        if (sec.tables.find(t => t.id === table.id)) return sec.title || hall.name;
      }
      return hall.name;
    })();

    const msg = encodeURIComponent(
      `*New Table Reservation — Tajj Restaurant (Shahid)*\n\n` +
      `*Hall:* ${hall.name}\n` +
      `*Section:* ${sectionName}\n` +
      `*Table:* ${table.label}${table.special ? ` (${table.special})` : ""}\n` +
      `*Seats:* ${table.seats}\n\n` +
      `*Guest Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Date:* ${form.date}\n` +
      `*Time:* ${form.time}\n` +
      `*No. of Guests:* ${form.guests}\n` +
      (form.note ? `*Special Request:* ${form.note}\n` : "") +
      `\nPlease confirm the reservation. Thank you!`
    );
    window.open(`https://wa.me/918880918007?text=${msg}`, "_blank");
    setStep("done");
  };

  const stepIndex = { hall: 0, table: 1, details: 2, done: 3 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 28 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#c9a84c]/30 shadow-[0_0_80px_rgba(201,168,76,0.12)] flex flex-col max-h-[92vh]"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#8b0000] via-[#c9a84c] to-[#8b0000] flex-shrink-0" />

            <div className="flex items-center justify-between px-6 md:px-8 pt-6 pb-4 border-b border-[#c9a84c]/15 flex-shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.35em] text-[#8b0000] uppercase mb-1">Tajj Restaurant (Shahid)</p>
                <h2 className="text-xl md:text-2xl font-serif text-[#c9a84c]">Reserve a Table</h2>
              </div>
              <button onClick={handleClose} className="text-[#f5f5f0]/40 hover:text-[#c9a84c] transition-colors">
                <X size={22} />
              </button>
            </div>

            {step !== "done" && (
              <div className="flex items-center gap-0 px-6 md:px-8 py-3 border-b border-[#c9a84c]/10 flex-shrink-0">
                {["Choose Hall", "Choose Table", "Your Details"].map((label, i) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-colors ${
                        stepIndex[step] >= i ? "bg-[#c9a84c] text-[#0a0a0a]" : "border border-[#c9a84c]/25 text-[#f5f5f0]/30"
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-[10px] tracking-wide hidden sm:block transition-colors ${
                        stepIndex[step] >= i ? "text-[#c9a84c]" : "text-[#f5f5f0]/25"
                      }`}>{label}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-px mx-2 transition-colors ${stepIndex[step] > i ? "bg-[#c9a84c]/40" : "bg-[#c9a84c]/10"}`} />}
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6">
              <AnimatePresence mode="wait">

                {step === "hall" && (
                  <motion.div key="hall" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-[#f5f5f0]/50 text-xs mb-5 tracking-wide">Select your preferred dining area</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {halls.map(hall => {
                        const allTableIds = hall.sections.flatMap(s => s.tables.map(t => t.id));
                        const availableCount = allTableIds.filter(id => {
                          const st = tableStatuses[id] ?? "available";
                          return st === "available";
                        }).length;
                        const hallFullyBlocked = availableCount === 0;

                        return (
                          <button
                            key={hall.key}
                            onClick={() => { setSelectedHall(hall); setSelectedTable(null); setStep("table"); }}
                            className="group text-left border border-[#c9a84c]/15 bg-white/[0.02] hover:border-[#c9a84c]/50 transition-all duration-300 overflow-hidden"
                          >
                            <div className="relative h-36 overflow-hidden">
                              <img
                                src={hall.image}
                                alt={hall.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
                              <div
                                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase"
                                style={{ background: hall.color + "22", color: hall.color, border: `1px solid ${hall.color}44` }}
                              >
                                {hall.icon}
                                {hall.name}
                              </div>
                              {hallFullyBlocked && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#7c4500] text-[#fed7aa] text-[8px] tracking-[0.2em] uppercase font-bold">
                                  Fully Occupied
                                </div>
                              )}
                              {!hallFullyBlocked && hall.key === "red" && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#ef4444] text-white text-[8px] tracking-[0.2em] uppercase font-bold">
                                  Private Dining
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="text-[#f5f5f0]/55 text-xs leading-relaxed mb-3">{hall.subtitle}</p>
                              <div className="flex flex-wrap gap-1 items-center">
                                {hall.sections.map((sec, si) => (
                                  <span key={si} className="text-[9px] tracking-wide px-2 py-0.5 border border-[#c9a84c]/15 text-[#c9a84c]/60">
                                    {sec.title || `${sec.tables.length} table${sec.tables.length > 1 ? "s" : ""}`}
                                  </span>
                                ))}
                                <span className="text-[9px] ml-auto" style={{ color: availableCount > 0 ? "#4ade80" : "#fb923c" }}>
                                  {availableCount} available
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === "table" && selectedHall && (
                  <motion.div key="table" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <button onClick={() => setStep("hall")} className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#c9a84c]/50 uppercase mb-5 hover:text-[#c9a84c] transition-colors">
                      <ChevronLeft size={13} /> Back
                    </button>

                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#c9a84c]/10">
                      <div style={{ color: selectedHall.color }}>{selectedHall.icon}</div>
                      <div>
                        <p className="font-serif text-[#c9a84c] text-base">{selectedHall.name}</p>
                        <p className="text-[#f5f5f0]/40 text-xs">{selectedHall.subtitle}</p>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mb-4 text-[9px] tracking-wide text-[#f5f5f0]/40">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm border border-[#c9a84c]/30 bg-white/5" />
                        Available
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(135deg,#7f0000,#b00000)" }} />
                        Reserved
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(135deg,#7c4500,#b56500)" }} />
                        Occupied
                      </div>
                    </div>

                    {selectedHall.sections.map((sec, si) => (
                      <div key={si} className="mb-6">
                        {sec.title && (
                          <p className="text-[10px] tracking-[0.3em] text-[#f5f5f0]/40 uppercase mb-3">{sec.title}</p>
                        )}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {sec.tables.map(table => {
                            const isSelected = selectedTable?.id === table.id;
                            const tableStatus = tableStatuses[table.id] ?? "available";
                            const isReserved = tableStatus === "reserved";
                            const isOccupied = tableStatus === "occupied";
                            const isBlocked = isReserved || isOccupied;

                            return (
                              <button
                                key={table.id}
                                onClick={() => !isBlocked && setSelectedTable(table)}
                                disabled={isBlocked}
                                className={`relative flex flex-col items-center justify-center p-3 border transition-all duration-200 text-center ${
                                  isOccupied
                                    ? "border-[#7c4500]/50 bg-[#7c4500]/10 cursor-not-allowed opacity-70"
                                    : isReserved
                                      ? "border-[#7f0000]/60 bg-[#7f0000]/10 cursor-not-allowed opacity-70"
                                      : isSelected
                                        ? "border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_12px_rgba(201,168,76,0.25)]"
                                        : "border-[#c9a84c]/15 bg-white/[0.02] hover:border-[#c9a84c]/40"
                                }`}
                              >
                                {isOccupied && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#7c4500] text-[#fed7aa] text-[8px] px-1.5 py-0.5 tracking-wide whitespace-nowrap">
                                    Occupied
                                  </span>
                                )}
                                {isReserved && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#7f0000] text-[#fca5a5] text-[8px] px-1.5 py-0.5 tracking-wide whitespace-nowrap">
                                    Reserved
                                  </span>
                                )}
                                {!isBlocked && table.special && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#8b0000] text-[#f5f5f0] text-[8px] px-1.5 py-0.5 tracking-wide whitespace-nowrap">
                                    {table.special}
                                  </span>
                                )}
                                <span className={`font-serif text-sm mb-1 ${
                                  isOccupied ? "text-[#fb923c]/50" : isReserved ? "text-[#fca5a5]/50" : isSelected ? "text-[#c9a84c]" : "text-[#f5f5f0]"
                                }`}>
                                  {table.label}
                                </span>
                                <span className={`text-[9px] flex items-center gap-0.5 ${
                                  isOccupied ? "text-[#fb923c]/35" : isReserved ? "text-[#fca5a5]/35" : "text-[#f5f5f0]/35"
                                }`}>
                                  <Users size={9} />
                                  {table.seats}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <button
                      disabled={!selectedTable}
                      onClick={() => setStep("details")}
                      className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_24px_rgba(201,168,76,0.5)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed mt-2"
                    >
                      {selectedTable ? `Continue with ${selectedTable.label}` : "Select a Table"}
                    </button>
                  </motion.div>
                )}

                {step === "details" && selectedHall && selectedTable && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <button onClick={() => setStep("table")} className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#c9a84c]/50 uppercase mb-5 hover:text-[#c9a84c] transition-colors">
                      <ChevronLeft size={13} /> Back
                    </button>

                    <div className="flex flex-wrap gap-3 mb-6 p-4 border border-[#c9a84c]/20 bg-[#c9a84c]/[0.04]">
                      <div>
                        <p className="text-[9px] tracking-[0.25em] text-[#c9a84c]/50 uppercase">Hall</p>
                        <p className="text-sm text-[#f5f5f0] font-serif mt-0.5">{selectedHall.name}</p>
                      </div>
                      <div className="w-px bg-[#c9a84c]/15 hidden sm:block" />
                      <div>
                        <p className="text-[9px] tracking-[0.25em] text-[#c9a84c]/50 uppercase">Table</p>
                        <p className="text-sm text-[#f5f5f0] font-serif mt-0.5">
                          {selectedTable.label}
                          {selectedTable.special && <span className="ml-2 text-[10px] text-[#8b0000]">({selectedTable.special})</span>}
                        </p>
                      </div>
                      <div className="w-px bg-[#c9a84c]/15 hidden sm:block" />
                      <div>
                        <p className="text-[9px] tracking-[0.25em] text-[#c9a84c]/50 uppercase">Capacity</p>
                        <p className="text-sm text-[#f5f5f0] font-serif mt-0.5">{selectedTable.seats} Seats</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/50 pointer-events-none" />
                        <input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          required placeholder="Full Name"
                          className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-4 py-3 text-sm placeholder-[#f5f5f0]/25 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/50 pointer-events-none" />
                        <input
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          required placeholder="Phone Number" type="tel"
                          className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-4 py-3 text-sm placeholder-[#f5f5f0]/25 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <CalendarCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/50 pointer-events-none" />
                          <input
                            value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            required type="date" min={today}
                            className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors [color-scheme:dark]"
                          />
                        </div>
                        <div className="relative">
                          <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/50 pointer-events-none" />
                          <input
                            value={form.guests}
                            onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                            required placeholder={`Guests (max ${selectedTable.seats})`}
                            type="number" min="1" max={selectedTable.seats}
                            className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-3 py-3 text-sm placeholder-[#f5f5f0]/25 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={13} className="text-[#c9a84c]/50" />
                          <span className="text-[10px] tracking-[0.25em] text-[#f5f5f0]/35 uppercase">Preferred Time</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {timeSlots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, time: slot }))}
                              className={`py-2 text-[10px] tracking-wide border transition-all duration-200 ${
                                form.time === slot
                                  ? "bg-[#c9a84c] text-[#0a0a0a] border-[#c9a84c] font-bold"
                                  : "bg-white/[0.02] border-[#c9a84c]/15 text-[#f5f5f0]/55 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        placeholder="Special request (optional) — cake, decor, dietary needs..."
                        rows={2}
                        className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] px-4 py-3 text-sm placeholder-[#f5f5f0]/25 focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                      />

                      <button
                        type="submit"
                        disabled={!form.time || submitting}
                        className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_24px_rgba(201,168,76,0.5)] transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Locking Table…" : "Confirm Reservation via WhatsApp"}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === "done" && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-10 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full border border-[#c9a84c]/40 flex items-center justify-center">
                      <CheckCircle size={36} className="text-[#c9a84c]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#f5f5f0]">Reservation Sent!</h3>
                    <p className="text-[#f5f5f0]/50 text-sm leading-relaxed max-w-xs">
                      Your table request for <span className="text-[#c9a84c]">{selectedHall?.name} — {selectedTable?.label}</span> has been sent via WhatsApp.
                      The table is now marked as <span className="text-[#fca5a5]">Reserved</span> and cannot be booked by others until staff releases it.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-4 px-10 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] transition-colors"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
