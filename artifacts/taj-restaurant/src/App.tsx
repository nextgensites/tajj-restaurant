import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CalendarCheck, ShoppingBag, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import ReserveTable from "@/components/ReserveTable";
import FoodBooking from "@/components/FoodBooking";
import TableLayout from "@/components/TableLayout";

export type TableStatus = "available" | "reserved" | "occupied";

export const ALL_TABLE_IDS = [
  "main-1","main-2","main-3","main-4","main-5","main-6","main-7","main-8","main-9",
  "ac-friends-1","ac-friends-2",
  "ac-family-1","ac-family-2","ac-family-3",
  "jungle-1","jungle-2","jungle-3","jungle-4","jungle-5",
  "majlis-1","majlis-2","majlis-3","majlis-couple-4","majlis-5","majlis-6",
  "red-room-1","red-room-2","red-room-3","red-room-4",
  "new-majlis-family-1","new-majlis-family-2","new-majlis-family-3","new-majlis-family-4","new-majlis-family-5",
];

function StaffPinOverlay({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const CORRECT = "1234";

  const submit = (value: string) => {
    if (value === CORRECT) { onSuccess(); }
    else { setShake(true); setPin(""); setTimeout(() => setShake(false), 500); }
  };
  const press = (d: string) => {
    const next = pin + d;
    setPin(next);
    if (next.length === 4) submit(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-72 rounded-sm overflow-hidden"
        style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.25)" }}
      >
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,transparent,#c9a84c,transparent)" }} />
        <div className="px-8 py-8">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <ShieldCheck size={22} className="text-[#c9a84c]" />
            </div>
          </div>
          <p className="text-center text-[#c9a84c] font-serif text-lg mb-1">Staff Access</p>
          <p className="text-center text-[#f5f5f0]/30 text-[10px] tracking-widest mb-6">ENTER 4-DIGIT PIN</p>

          <motion.div
            animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex justify-center gap-3 mb-6"
          >
            {[0,1,2,3].map(i => (
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-150"
                style={{
                  background: i < pin.length ? "#c9a84c" : "rgba(255,255,255,0.1)",
                  boxShadow: i < pin.length ? "0 0 8px rgba(201,168,76,0.6)" : "none",
                }} />
            ))}
          </motion.div>

          <div className="grid grid-cols-3 gap-2">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
              <button key={i}
                onClick={() => { if (!d) return; if (d === "⌫") { setPin(p => p.slice(0,-1)); return; } press(d); }}
                disabled={!d}
                className="h-11 rounded-sm text-sm font-medium transition-all duration-150 disabled:invisible"
                style={{
                  background: d === "⌫" ? "rgba(139,0,0,0.2)" : "rgba(255,255,255,0.04)",
                  border: d === "⌫" ? "1px solid rgba(139,0,0,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: d === "⌫" ? "#fca5a5" : "#f5f5f0",
                }}
              >{d}</button>
            ))}
          </div>
          <button onClick={onCancel}
            className="mt-5 w-full py-2 text-[9px] tracking-[0.3em] uppercase text-[#f5f5f0]/25 hover:text-[#f5f5f0]/50 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const queryClient = new QueryClient();

function Home() {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [foodBookOpen, setFoodBookOpen] = useState(false);

  const [staffMode, setStaffMode] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [tableStatuses, setTableStatuses] = useState<Record<string, TableStatus>>(
    () => Object.fromEntries(ALL_TABLE_IDS.map(id => [id, "available" as TableStatus]))
  );

  const occupiedIds = Object.entries(tableStatuses)
    .filter(([, s]) => s === "occupied")
    .map(([id]) => id);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0] selection:bg-[#c9a84c] selection:text-[#0a0a0a]">
      <AnimatePresence>
        {showPin && (
          <StaffPinOverlay
            onSuccess={() => { setShowPin(false); setStaffMode(true); }}
            onCancel={() => setShowPin(false)}
          />
        )}
      </AnimatePresence>

      <Loader />
      <Navbar onReserve={() => setReserveOpen(true)} onFoodBook={() => setFoodBookOpen(true)} onStaffLogin={() => setShowPin(true)} />
      <Hero />
      <About />
      <Menu />

      {staffMode && (
        <TableLayout
          staffMode={staffMode}
          onExitStaffMode={() => setStaffMode(false)}
          statuses={tableStatuses}
          setStatuses={setTableStatuses}
        />
      )}

      <Features />
      <Gallery />
      <Reviews />
      <Contact />
      <Footer onStaffLogin={() => setShowPin(true)} />

      <ReserveTable
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        occupiedTableIds={occupiedIds}
      />
      <FoodBooking open={foodBookOpen} onClose={() => setFoodBookOpen(false)} />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setFoodBookOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#8b0000] text-[#f5f5f0] text-xs tracking-[0.2em] uppercase font-bold shadow-[0_4px_32px_rgba(139,0,0,0.5)] hover:bg-[#a80000] hover:shadow-[0_4px_40px_rgba(139,0,0,0.7)] transition-all duration-300"
        >
          <ShoppingBag size={15} className="flex-shrink-0" />
          Order Food
        </button>
        <button
          onClick={() => setReserveOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.2em] uppercase font-bold shadow-[0_4px_32px_rgba(201,168,76,0.45)] hover:bg-[#f0c040] hover:shadow-[0_4px_40px_rgba(201,168,76,0.7)] transition-all duration-300"
        >
          <CalendarCheck size={15} className="flex-shrink-0" />
          Reserve Table
        </button>
      </div>
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
