import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Phone, User, CheckCircle, Trash2, ChevronLeft, ExternalLink, MapPin } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  category: string;
}

const halls = [
  {
    id: "main",
    name: "Main Hall",
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: "ac-friends",
    name: "AC Friends Hall",
    tables: [1, 2],
  },
  {
    id: "ac-family",
    name: "AC Family Hall",
    tables: [1, 2, 3],
  },
  {
    id: "jungle",
    name: "Jungle Hall",
    tables: [1, 2, 3, 4, 5],
  },
  {
    id: "majlis",
    name: "Majlis Hall",
    tables: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "red-room",
    name: "Red Room",
    tables: [1, 2, 3, 4],
  },
];

const menuCategories = [
  {
    name: "Biryani",
    dishes: [
      { id: 101, name: "Chicken Biriyani", price: 120 },
      { id: 102, name: "Mutton Biriyani", price: 250 },
      { id: 103, name: "Ghee Rice", price: 70 },
      { id: 104, name: "Ghee Rice Half", price: 40 },
      { id: 105, name: "Masala Rice", price: 50 },
    ],
  },
  {
    name: "Chicken",
    dishes: [
      { id: 201, name: "Chicken Shahi Kurma", price: 300 },
      { id: 202, name: "Afgani Chicken", price: 300 },
      { id: 203, name: "Al-faham Gravy Half", price: 300 },
      { id: 204, name: "Banjara Chicken", price: 280 },
      { id: 205, name: "Chicken Chettinad", price: 280 },
      { id: 206, name: "Chicken Doo Pyaza", price: 280 },
    ],
  },
  {
    name: "Mutton",
    dishes: [
      { id: 301, name: "Mutton Masala", price: 350 },
      { id: 302, name: "Mutton Chops", price: 400 },
      { id: 303, name: "Mutton Handi", price: 380 },
      { id: 304, name: "Mutton Pepper Dry", price: 380 },
      { id: 305, name: "Mutton Rogan Josh", price: 360 },
    ],
  },
  {
    name: "Kabab",
    dishes: [
      { id: 401, name: "Chicken Kebab", price: 180 },
      { id: 402, name: "Seekh Kebab", price: 200 },
      { id: 403, name: "Mutton Seekh Kebab", price: 250 },
      { id: 404, name: "Tandoori Chicken", price: 280 },
      { id: 405, name: "Chicken Tikka", price: 260 },
    ],
  },
  {
    name: "Teetar",
    dishes: [
      { id: 501, name: "Teetar Dry Tadka", price: 180 },
      { id: 502, name: "Teetar Hara Masala", price: 200 },
      { id: 503, name: "Teetar Lemon Masala", price: 200 },
      { id: 504, name: "Teetar 65 Masala", price: 200 },
      { id: 505, name: "Teetar Chilly Masala", price: 200 },
      { id: 506, name: "Teetar Ghee Roast", price: 200 },
    ],
  },
  {
    name: "Nati Teetar",
    dishes: [
      { id: 601, name: "Nati Teetar 300 Shahi Masala", price: 300 },
      { id: 602, name: "Nati Teetar Pepper Dry", price: 320 },
      { id: 603, name: "Nati Teetar Chilly", price: 300 },
    ],
  },
  {
    name: "Prawns",
    dishes: [
      { id: 701, name: "Prawns Pepper Dry", price: 300 },
      { id: 702, name: "Prawns Masala", price: 300 },
      { id: 703, name: "Prawns Butter Garlic", price: 320 },
    ],
  },
  {
    name: "Fish",
    dishes: [
      { id: 801, name: "Fish Masala", price: 280 },
      { id: 802, name: "Fish Fry", price: 260 },
      { id: 803, name: "Fish Pepper Dry", price: 280 },
    ],
  },
  {
    name: "Rice",
    dishes: [
      { id: 901, name: "Jeera Rice", price: 80 },
      { id: 902, name: "Veg Fried Rice", price: 80 },
      { id: 903, name: "Chicken Fried Rice", price: 150 },
      { id: 904, name: "Egg Fried Rice", price: 120 },
      { id: 905, name: "Steamed Rice", price: 60 },
    ],
  },
  {
    name: "Parota & Roti",
    dishes: [
      { id: 1001, name: "Wheat Parota", price: 30 },
      { id: 1002, name: "Butter Naan", price: 40 },
      { id: 1003, name: "Tandoori Roti", price: 30 },
      { id: 1004, name: "Lacha Paratha", price: 40 },
      { id: 1005, name: "Puri", price: 30 },
    ],
  },
  {
    name: "Chinese",
    dishes: [
      { id: 1101, name: "Chicken Manchurian", price: 200 },
      { id: 1102, name: "Chicken 65", price: 220 },
      { id: 1103, name: "Gobi Manchurian", price: 150 },
      { id: 1104, name: "Veg Noodles", price: 120 },
      { id: 1105, name: "Chicken Noodles", price: 160 },
    ],
  },
  {
    name: "Soup",
    dishes: [
      { id: 1201, name: "Chicken Soup", price: 120 },
      { id: 1202, name: "Mutton Soup", price: 150 },
      { id: 1203, name: "Sweet Corn Soup", price: 100 },
    ],
  },
];

const allDishes: Dish[] = menuCategories.flatMap(cat =>
  cat.dishes.map(d => ({ ...d, category: cat.name }))
);

type Cart = Record<number, number>;
type Step = "location" | "menu" | "details";

export default function FoodBooking({ open, onClose }: Props) {
  const [cart, setCart] = useState<Cart>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<Step>("location");
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const add = (id: number) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: number) =>
    setCart(c => {
      const next = { ...c };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id]--;
      return next;
    });
  const clear = (id: number) => setCart(c => { const n = { ...c }; delete n[id]; return n; });

  const cartItems = allDishes.filter(d => cart[d.id]);
  const total = cartItems.reduce((sum, d) => sum + d.price * cart[d.id], 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const currentDishes = menuCategories.find(c => c.name === activeCategory)?.dishes || [];
  const currentHall = halls.find(h => h.id === selectedHall);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = cartItems.map(d => `  • ${d.name} x${cart[d.id]} = ₹${d.price * cart[d.id]}`).join("\n");
    const hallName = currentHall?.name ?? selectedHall;
    const msg = encodeURIComponent(
      `Hello Tajj Restaurant (Shahid)!\n\n` +
      `🪑 Dine-In Order\n\n` +
      `Hall: ${hallName}\n` +
      `Table No: ${selectedTable}\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n\n` +
      `Order:\n${lines}\n\n` +
      `Total: ₹${total}\n\n` +
      `Please confirm my order. Thank you!`
    );
    window.open(`https://wa.me/918880918007?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setStep("location");
    setCart({});
    setName(""); setPhone("");
    setActiveCategory(menuCategories[0].name);
    setSelectedHall(null);
    setSelectedTable(null);
    onClose();
  };

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
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#c9a84c]/30 shadow-[0_0_80px_rgba(201,168,76,0.15)] flex flex-col max-h-[92vh]"
          >
            {/* Gold top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#8b0000] via-[#c9a84c] to-[#8b0000] flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-8 pt-5 pb-4 border-b border-[#c9a84c]/15 flex-shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.35em] text-[#8b0000] uppercase mb-1">Tajj Restaurant (Shahid)</p>
                <h2 className="text-xl md:text-2xl font-serif text-[#c9a84c]">Order Food</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {(["location","menu","details"] as Step[]).map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                        step === s ? "bg-[#c9a84c] text-[#0a0a0a]" :
                        (["location","menu","details"].indexOf(step) > i) ? "bg-[#c9a84c]/40 text-[#c9a84c]" :
                        "bg-white/5 text-[#f5f5f0]/30"
                      }`}>{i + 1}</div>
                      {i < 2 && <div className={`w-4 h-px ${["location","menu","details"].indexOf(step) > i ? "bg-[#c9a84c]/50" : "bg-white/10"}`} />}
                    </div>
                  ))}
                </div>
                {totalItems > 0 && step === "menu" && (
                  <div className="flex items-center gap-2 px-3 py-1 border border-[#c9a84c]/30 text-[#c9a84c]">
                    <ShoppingBag size={13} />
                    <span className="text-xs font-bold">{totalItems}</span>
                  </div>
                )}
                <a
                  href="https://tajrestaurantshahid.zobaze.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors border border-[#c9a84c]/20 px-2.5 py-1.5 hover:border-[#c9a84c]/50"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={11} />
                  Full Menu
                </a>
                <button onClick={handleClose} className="text-[#f5f5f0]/40 hover:text-[#c9a84c] transition-colors">
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <AnimatePresence mode="wait">

                {/* SUCCESS */}
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-12 px-8 gap-4"
                  >
                    <div className="w-16 h-16 rounded-full border border-[#c9a84c]/40 flex items-center justify-center">
                      <CheckCircle size={36} className="text-[#c9a84c]" />
                    </div>
                    <h3 className="text-xl font-serif text-[#f5f5f0]">Order Placed!</h3>
                    <p className="text-[#f5f5f0]/55 text-sm leading-relaxed max-w-xs">
                      Your order from <span className="text-[#c9a84c]">{currentHall?.name}</span>, Table <span className="text-[#c9a84c]">{selectedTable}</span> has been sent via WhatsApp. We'll confirm shortly.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-4 px-8 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#f0c040] transition-colors"
                    >
                      Done
                    </button>
                  </motion.div>

                ) : step === "location" ? (
                  /* STEP 1: HALL & TABLE SELECTION */
                  <motion.div
                    key="location-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col flex-1 overflow-hidden"
                  >
                    <div className="overflow-y-auto flex-1 px-6 md:px-8 py-5 space-y-5">
                      <div className="flex items-center gap-2 text-[#c9a84c]/60 text-[10px] tracking-[0.25em] uppercase mb-1">
                        <MapPin size={12} />
                        Select Your Hall & Table
                      </div>

                      {halls.map(hall => (
                        <div key={hall.id}>
                          {/* Hall selector */}
                          <button
                            onClick={() => {
                              setSelectedHall(hall.id);
                              setSelectedTable(null);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all duration-200 mb-3 ${
                              selectedHall === hall.id
                                ? "border-[#c9a84c] bg-[#c9a84c]/8"
                                : "border-[#c9a84c]/15 hover:border-[#c9a84c]/40 bg-white/[0.02]"
                            }`}
                          >
                            <span className={`font-serif text-sm ${selectedHall === hall.id ? "text-[#c9a84c]" : "text-[#f5f5f0]/80"}`}>
                              {hall.name}
                            </span>
                            <span className="text-[9px] tracking-[0.2em] text-[#f5f5f0]/30 uppercase">
                              {hall.tables.length} {hall.tables.length === 1 ? "table" : "tables"}
                            </span>
                          </button>

                          {/* Table number grid (shows only when hall is selected) */}
                          <AnimatePresence>
                            {selectedHall === hall.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-wrap gap-2 px-1 pb-2">
                                  {hall.tables.map(num => (
                                    <button
                                      key={num}
                                      onClick={() => setSelectedTable(num)}
                                      className={`w-12 h-12 flex flex-col items-center justify-center border text-xs font-bold transition-all duration-200 ${
                                        selectedTable === num
                                          ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a0a0a] shadow-[0_0_16px_rgba(201,168,76,0.4)]"
                                          : "border-[#c9a84c]/25 text-[#f5f5f0]/60 hover:border-[#c9a84c]/60 hover:text-[#c9a84c]"
                                      }`}
                                    >
                                      <span className="text-[8px] font-normal opacity-60 leading-none mb-0.5">Table</span>
                                      <span>{num}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Proceed footer */}
                    <div className="flex-shrink-0 border-t border-[#c9a84c]/15 px-6 md:px-8 py-4 bg-[#0f0f0f]">
                      {selectedHall && selectedTable && (
                        <div className="flex items-center gap-2 text-[11px] text-[#c9a84c]/70 mb-3">
                          <MapPin size={11} />
                          <span>{currentHall?.name} — Table {selectedTable}</span>
                        </div>
                      )}
                      <button
                        disabled={!selectedHall || !selectedTable}
                        onClick={() => setStep("menu")}
                        className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_24px_rgba(201,168,76,0.5)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#c9a84c] disabled:hover:shadow-none"
                      >
                        {selectedHall && selectedTable ? "Choose Your Food" : "Select a Hall & Table to Continue"}
                      </button>
                    </div>
                  </motion.div>

                ) : step === "menu" ? (
                  /* STEP 2: MENU */
                  <motion.div key="menu-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 overflow-hidden">

                    {/* Location badge */}
                    <div className="flex items-center gap-2 px-6 md:px-8 py-2 border-b border-[#c9a84c]/10 bg-white/[0.01] flex-shrink-0">
                      <button
                        onClick={() => setStep("location")}
                        className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors uppercase"
                      >
                        <ChevronLeft size={12} />
                      </button>
                      <MapPin size={11} className="text-[#c9a84c]/50" />
                      <span className="text-[10px] text-[#c9a84c]/70 tracking-wide">{currentHall?.name} — Table {selectedTable}</span>
                    </div>

                    {/* Category tabs */}
                    <div className="flex overflow-x-auto gap-0 border-b border-[#c9a84c]/10 flex-shrink-0 scrollbar-none">
                      {menuCategories.map(cat => {
                        const catCount = cat.dishes.reduce((s, d) => s + (cart[d.id] || 0), 0);
                        return (
                          <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`relative flex-shrink-0 px-4 py-3 text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-200 ${
                              activeCategory === cat.name
                                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                                : "text-[#f5f5f0]/35 hover:text-[#f5f5f0]/60 border-b-2 border-transparent"
                            }`}
                          >
                            {cat.name}
                            {catCount > 0 && (
                              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[8px] font-bold">
                                {catCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Dish list */}
                    <div className="overflow-y-auto flex-1 px-6 md:px-8 py-4">
                      <div className="space-y-2">
                        {currentDishes.map(dish => (
                          <div
                            key={dish.id}
                            className="flex items-center justify-between p-3.5 border border-[#c9a84c]/12 bg-white/[0.02] hover:border-[#c9a84c]/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="text-sm font-serif text-[#f5f5f0] truncate">{dish.name}</p>
                              <p className="text-xs text-[#c9a84c] mt-0.5">₹{dish.price}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {cart[dish.id] ? (
                                <>
                                  <button
                                    onClick={() => remove(dish.id)}
                                    className="w-7 h-7 flex items-center justify-center border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span className="text-[#f5f5f0] font-bold text-sm w-5 text-center">{cart[dish.id]}</span>
                                  <button
                                    onClick={() => add(dish.id)}
                                    className="w-7 h-7 flex items-center justify-center border border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#f0c040] transition-colors"
                                  >
                                    <Plus size={11} />
                                  </button>
                                  <button
                                    onClick={() => clear(dish.id)}
                                    className="text-[#8b0000]/60 hover:text-[#8b0000] transition-colors ml-0.5"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => add(dish.id)}
                                  className="px-4 py-1.5 border border-[#c9a84c]/35 text-[#c9a84c] text-[10px] tracking-widest uppercase hover:bg-[#c9a84c]/10 transition-colors"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cart summary + proceed */}
                    {cartItems.length > 0 && (
                      <div className="flex-shrink-0 border-t border-[#c9a84c]/15 px-6 md:px-8 py-4 bg-[#0f0f0f]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="space-y-0.5 flex-1 mr-4 max-h-16 overflow-y-auto">
                            {cartItems.map(d => (
                              <div key={d.id} className="flex justify-between text-[10px] text-[#f5f5f0]/50">
                                <span className="truncate mr-2">{d.name} ×{cart[d.id]}</span>
                                <span className="flex-shrink-0">₹{d.price * cart[d.id]}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[9px] tracking-[0.2em] text-[#c9a84c]/50 uppercase mb-0.5">Total</p>
                            <p className="text-lg font-bold text-[#c9a84c]">₹{total}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep("details")}
                          className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_24px_rgba(201,168,76,0.5)] transition-all duration-300"
                        >
                          Proceed — {totalItems} item{totalItems > 1 ? "s" : ""}
                        </button>
                      </div>
                    )}
                  </motion.div>

                ) : (
                  /* STEP 3: DETAILS */
                  <motion.div key="details-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="overflow-y-auto flex-1 px-6 md:px-8 py-5">
                    <button
                      onClick={() => setStep("menu")}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[#c9a84c]/50 uppercase mb-5 hover:text-[#c9a84c] transition-colors"
                    >
                      <ChevronLeft size={13} /> Back to Menu
                    </button>

                    {/* Table info badge */}
                    <div className="flex items-center gap-2 px-4 py-3 border border-[#c9a84c]/20 bg-[#c9a84c]/5 mb-5">
                      <MapPin size={14} className="text-[#c9a84c] flex-shrink-0" />
                      <div>
                        <p className="text-[9px] tracking-[0.2em] text-[#c9a84c]/50 uppercase">Dining At</p>
                        <p className="text-sm text-[#c9a84c] font-serif">{currentHall?.name} — Table {selectedTable}</p>
                      </div>
                    </div>

                    {/* Mini order recap */}
                    <div className="bg-white/[0.02] border border-[#c9a84c]/15 p-4 mb-5 space-y-1.5">
                      {cartItems.map(d => (
                        <div key={d.id} className="flex justify-between text-xs text-[#f5f5f0]/60">
                          <span>{d.name} ×{cart[d.id]}</span>
                          <span>₹{d.price * cart[d.id]}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold text-[#c9a84c] pt-2 border-t border-[#c9a84c]/15 mt-1">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/60 pointer-events-none" />
                        <input
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          placeholder="Your Name"
                          className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-4 py-3 text-sm placeholder-[#f5f5f0]/30 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                        />
                      </div>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/60 pointer-events-none" />
                        <input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                          placeholder="Phone Number"
                          type="tel"
                          className="w-full bg-white/[0.03] border border-[#c9a84c]/20 text-[#f5f5f0] pl-9 pr-4 py-3 text-sm placeholder-[#f5f5f0]/30 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_24px_rgba(201,168,76,0.5)] transition-all duration-300"
                      >
                        Place Order via WhatsApp
                      </button>
                    </form>
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
