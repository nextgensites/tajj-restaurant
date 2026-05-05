import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import gallery6 from "@/assets/gallery-6.png";

const photos = [
  { src: gallery1, label: "Dining Hall" },
  { src: gallery2, label: "Dum Biryani" },
  { src: gallery3, label: "Tandoor Kitchen" },
  { src: gallery4, label: "Table Setting" },
  { src: gallery5, label: "Kebab Platter" },
  { src: gallery6, label: "Chai Ritual" },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox(i => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () =>
    setLightbox(i => (i === null ? null : (i + 1) % photos.length));

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-[#8b0000] mb-4 uppercase">Visuals</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c]">Atmosphere</h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              onClick={() => setLightbox(idx)}
              className="relative group aspect-square overflow-hidden border border-[#c9a84c]/10 cursor-pointer"
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                <div className="w-8 h-px bg-[#c9a84c]" />
                <span className="text-[#c9a84c] font-serif tracking-[0.2em] uppercase text-sm">
                  {photo.label}
                </span>
                <div className="w-8 h-px bg-[#c9a84c]" />
              </div>

              {/* Gold corner accent */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c9a84c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c9a84c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors z-10 p-2"
            >
              <ChevronLeft size={36} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full border border-[#c9a84c]/25 shadow-[0_0_80px_rgba(201,168,76,0.12)]"
            >
              <img
                src={photos[lightbox].src}
                alt={photos[lightbox].label}
                className="w-full object-cover max-h-[80vh]"
              />
              <div className="absolute bottom-0 inset-x-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[#c9a84c] font-serif tracking-widest text-sm uppercase">
                  {photos[lightbox].label}
                </p>
              </div>
            </motion.div>

            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors z-10 p-2"
            >
              <ChevronRight size={36} />
            </button>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-[#f5f5f0]/50 hover:text-[#c9a84c] transition-colors"
            >
              <X size={26} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === lightbox ? "bg-[#c9a84c] w-4" : "bg-[#c9a84c]/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
