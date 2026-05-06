import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, CalendarCheck, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menu" },
  { name: "Features", href: "#features" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

interface Props {
  onReserve: () => void;
  onFoodBook: () => void;
  onStaffLogin: () => void;
}

export default function Navbar({ onReserve, onFoodBook, onStaffLogin }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const clickBuf = useRef<number[]>([]);
  const onLogoClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    clickBuf.current = [...clickBuf.current.filter(t => now - t < 3000), now];
    if (clickBuf.current.length >= 5) {
      clickBuf.current = [];
      e.preventDefault();
      onStaffLogin();
    }
  }, [onStaffLogin]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/85 backdrop-blur-md border-b border-[#c9a84c]/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo — 5 rapid clicks trigger staff login */}
        <a
          href="#home"
          onClick={onLogoClick}
          className="text-lg md:text-xl font-serif text-[#c9a84c] font-bold tracking-wider flex-shrink-0 select-none"
        >
          TAJJ RESTAURANT
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#f5f5f0] hover:text-[#c9a84c] text-[11px] tracking-widest uppercase transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onReserve}
            className="flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/50 text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] hover:shadow-[0_0_16px_rgba(201,168,76,0.25)] transition-all duration-300 cursor-pointer"
          >
            <CalendarCheck size={13} />
            Reserve Table
          </button>
          <button
            onClick={onFoodBook}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#0a0a0a] text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0c040] hover:shadow-[0_0_20px_rgba(201,168,76,0.45)] transition-all duration-300 cursor-pointer"
          >
            <ShoppingBag size={13} />
            Food Booking
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#f5f5f0] hover:text-[#c9a84c] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-[#c9a84c]/20"
          >
            <div className="flex flex-col py-4 px-6 space-y-3">
              {links.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#f5f5f0] hover:text-[#c9a84c] text-sm tracking-widest uppercase transition-colors py-2 border-b border-[#c9a84c]/10"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onReserve(); }}
                  className="flex items-center justify-center gap-2 py-3 border border-[#c9a84c]/50 text-[#c9a84c] text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#c9a84c]/10 transition-all"
                >
                  <CalendarCheck size={14} />
                  Reserve Table
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onFoodBook(); }}
                  className="flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-[#0a0a0a] text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-[#f0c040] transition-all"
                >
                  <ShoppingBag size={14} />
                  Food Booking
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
