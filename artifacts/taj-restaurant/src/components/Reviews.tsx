import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    name: "Mehbub Pasha",
    rating: 5,
    date: "Recent · Google",
    review:
      "Excellent experience. The food was very tasty and the service was good. Highly recommended for anyone who loves nice food.",
    dish: "Teetar Fry, Dal Khichdi, Pepper Teetar",
    initials: "MP",
  },
  {
    name: "Sam D",
    rating: 5,
    date: "Recent · Google",
    review:
      "Awesome flavourful food. Teetar fry, Chicken pepper tandoori, Chicken curry — all tasted fantastic. Must try! Ambience was good, suited for a family dinner small or big.",
    dish: "Teetar Fry, Chicken Pepper Tandoori",
    initials: "SD",
  },
  {
    name: "Syed Suhail",
    rating: 5,
    date: "Recent · Google",
    review:
      "The experience was really good — amazing food and the employees were very cooperative. Will definitely come back again.",
    dish: "Chicken Biryani",
    initials: "SS",
  },
  {
    name: "Aziz Shah",
    rating: 5,
    date: "Google Review",
    review:
      "Explored this place for the first time and I must say it's one of the good places with tasty food. They have lots of varieties in Chicken, Mutton & Seafood. Best place for family with a long drive from Bangalore city.",
    dish: "Mutton Biryani, Seafood",
    initials: "AS",
  },
  {
    name: "Laddu Brand",
    rating: 5,
    date: "Recent · Google",
    review:
      "Nice food and fast service. Everything was cooked perfectly. The pepper chicken and fried prawns were outstanding. Great value for money.",
    dish: "Pepper Chicken, Fried Prawns",
    initials: "LB",
  },
  {
    name: "Dilwar Hussain",
    rating: 5,
    date: "Recent · Google",
    review:
      "The food is very tasty and service is full fast. One of the best non-veg restaurants on the Bangalore highway. Perfect place for a weekend outing.",
    dish: "Chicken Biryani, Ghee Rice",
    initials: "DH",
  },
];

const platforms = [
  { name: "Google", rating: "4.5", count: "7,500+" },
  { name: "Restaurant Guru", rating: "4.5", count: "6,948" },
  { name: "Yappe.in", rating: "4.5", count: "5,472" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "fill-[#c9a84c] text-[#c9a84c]" : "text-[#c9a84c]/20"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [active, setActive] = useState(0);

  return (
    <section id="reviews" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.03] blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-sm tracking-[0.3em] text-[#8b0000] mb-4 uppercase">What Guests Say</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c]">Real Reviews</h3>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {platforms.map(p => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-5 py-3 border border-[#c9a84c]/20 bg-white/[0.02]"
            >
              <div>
                <p className="text-[9px] tracking-[0.3em] text-[#f5f5f0]/40 uppercase">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Star size={12} className="fill-[#c9a84c] text-[#c9a84c]" />
                  <span className="text-[#c9a84c] font-bold text-sm">{p.rating}</span>
                  <span className="text-[#f5f5f0]/40 text-xs">({p.count} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured review (large) */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto mb-10 relative border border-[#c9a84c]/20 bg-white/[0.02] p-8 md:p-12"
        >
          <Quote size={36} className="text-[#c9a84c]/20 absolute top-6 left-6" />
          <div className="relative z-10">
            <StarRow rating={reviews[active].rating} />
            <p className="text-[#f5f5f0]/85 text-lg md:text-xl font-serif leading-relaxed mt-5 mb-6 italic">
              "{reviews[active].review}"
            </p>
            <div className="flex items-center gap-4 border-t border-[#c9a84c]/10 pt-5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b0000] flex items-center justify-center text-[#0a0a0a] font-bold text-sm flex-shrink-0">
                {reviews[active].initials}
              </div>
              <div>
                <p className="text-[#f5f5f0] font-semibold text-sm">{reviews[active].name}</p>
                <p className="text-[#f5f5f0]/40 text-xs mt-0.5">{reviews[active].date}</p>
              </div>
              <div className="ml-auto text-right hidden sm:block">
                <p className="text-[9px] tracking-[0.25em] text-[#c9a84c]/50 uppercase">Ordered</p>
                <p className="text-xs text-[#c9a84c] mt-0.5">{reviews[active].dish}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dot selector */}
        <div className="flex justify-center gap-2 mb-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[#c9a84c]" : "w-1.5 bg-[#c9a84c]/25 hover:bg-[#c9a84c]/50"
              }`}
            />
          ))}
        </div>

        {/* Grid of all review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, idx) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => setActive(idx)}
              className={`cursor-pointer p-5 border transition-all duration-300 ${
                idx === active
                  ? "border-[#c9a84c]/50 bg-[#c9a84c]/[0.05] shadow-[0_0_20px_rgba(201,168,76,0.1)]"
                  : "border-[#c9a84c]/10 bg-white/[0.02] hover:border-[#c9a84c]/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b0000] flex items-center justify-center text-[#0a0a0a] font-bold text-xs flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-[#f5f5f0] text-sm font-medium">{r.name}</p>
                    <p className="text-[#f5f5f0]/35 text-[10px]">{r.date}</p>
                  </div>
                </div>
                <StarRow rating={r.rating} />
              </div>
              <p className="text-[#f5f5f0]/60 text-xs leading-relaxed line-clamp-3">{r.review}</p>
              <p className="text-[#c9a84c]/60 text-[10px] mt-3 tracking-wide">{r.dish}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-[#f5f5f0]/40 text-sm mb-4">
            Rated <span className="text-[#c9a84c] font-bold">4.5 / 5</span> across{" "}
            <span className="text-[#c9a84c] font-bold">7,500+</span> real Google reviews
          </p>
          <a
            href="https://maps.google.com/?q=Taj+Restaurant+Shahid+Hoskote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] text-xs tracking-[0.25em] uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-300"
          >
            Read All Reviews on Google
          </a>
        </motion.div>
      </div>
    </section>
  );
}
