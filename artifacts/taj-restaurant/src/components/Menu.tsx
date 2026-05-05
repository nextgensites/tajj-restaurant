import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import chickenBiryaniImg from "@/assets/chicken-biryani.png";
import muttonBiryaniImg from "@/assets/mutton-biryani.png";
import butterChickenImg from "@/assets/butter-chicken.png";
import chickenKebabImg from "@/assets/chicken-kebab.png";
import butterNaanImg from "@/assets/butter-naan.png";

const featuredItems = [
  {
    name: "Chicken Biryani",
    price: "₹120",
    description: "Aromatic basmati rice cooked with tender chicken pieces and secret spices.",
    img: chickenBiryaniImg,
    tag: "Bestseller",
  },
  {
    name: "Mutton Biryani",
    price: "₹250",
    description: "Slow-cooked mutton with saffron-infused rice and caramelized onions.",
    img: muttonBiryaniImg,
    tag: "Chef's Pick",
  },
  {
    name: "Butter Chicken",
    price: "₹280",
    description: "Roasted chicken in a rich, creamy tomato and butter gravy.",
    img: butterChickenImg,
    tag: "Fan Favourite",
  },
  {
    name: "Chicken Kebab",
    price: "₹180",
    description: "Smoky, charred chicken chunks marinated in yogurt and fiery spices.",
    img: chickenKebabImg,
    tag: "Grilled",
  },
  {
    name: "Butter Naan",
    price: "₹40",
    description: "Soft, fluffy tandoor-baked flatbread brushed generously with fresh butter.",
    img: butterNaanImg,
    tag: "Classic",
  },
];

const menuCategories = [
  {
    name: "Biryani",
    items: [
      { name: "Chicken Biriyani", price: 120 },
      { name: "Mutton Biriyani", price: 250 },
      { name: "Ghee Rice", price: 70 },
      { name: "Ghee Rice Half", price: 40 },
      { name: "Masala Rice", price: 50 },
    ],
  },
  {
    name: "Chicken",
    items: [
      { name: "Chicken Shahi Kurma", price: 300 },
      { name: "Afgani Chicken", price: 300 },
      { name: "Al-faham Gravy Half", price: 300 },
      { name: "Banjara Chicken", price: 280 },
      { name: "Chicken Chettinad", price: 280 },
      { name: "Chicken Doo Pyaza", price: 280 },
    ],
  },
  {
    name: "Mutton",
    items: [
      { name: "Mutton Masala", price: 350 },
      { name: "Mutton Chops", price: 400 },
      { name: "Mutton Handi", price: 380 },
      { name: "Mutton Pepper Dry", price: 380 },
      { name: "Mutton Rogan Josh", price: 360 },
    ],
  },
  {
    name: "Kabab",
    items: [
      { name: "Chicken Kebab", price: 180 },
      { name: "Seekh Kebab", price: 200 },
      { name: "Mutton Seekh Kebab", price: 250 },
      { name: "Tandoori Chicken", price: 280 },
      { name: "Chicken Tikka", price: 260 },
    ],
  },
  {
    name: "Teetar",
    items: [
      { name: "Teetar Dry Tadka", price: 180 },
      { name: "Teetar Hara Masala", price: 200 },
      { name: "Teetar Lemon Masala", price: 200 },
      { name: "Teetar 65 Masala", price: 200 },
      { name: "Teetar Chilly Masala", price: 200 },
      { name: "Teetar Ghee Roast", price: 200 },
    ],
  },
  {
    name: "Nati Teetar",
    items: [
      { name: "Nati Teetar 300 Shahi Masala", price: 300 },
      { name: "Nati Teetar Pepper Dry", price: 320 },
      { name: "Nati Teetar Chilly", price: 300 },
    ],
  },
  {
    name: "Prawns",
    items: [
      { name: "Prawns Pepper Dry", price: 300 },
      { name: "Prawns Masala", price: 300 },
      { name: "Prawns Butter Garlic", price: 320 },
    ],
  },
  {
    name: "Fish",
    items: [
      { name: "Fish Masala", price: 280 },
      { name: "Fish Fry", price: 260 },
      { name: "Fish Pepper Dry", price: 280 },
    ],
  },
  {
    name: "Rice",
    items: [
      { name: "Jeera Rice", price: 80 },
      { name: "Veg Fried Rice", price: 80 },
      { name: "Chicken Fried Rice", price: 150 },
      { name: "Egg Fried Rice", price: 120 },
      { name: "Steamed Rice", price: 60 },
    ],
  },
  {
    name: "Parota & Roti",
    items: [
      { name: "Wheat Parota", price: 30 },
      { name: "Butter Naan", price: 40 },
      { name: "Tandoori Roti", price: 30 },
      { name: "Lacha Paratha", price: 40 },
      { name: "Puri", price: 30 },
    ],
  },
  {
    name: "Chinese",
    items: [
      { name: "Chicken Manchurian", price: 200 },
      { name: "Chicken 65", price: 220 },
      { name: "Gobi Manchurian", price: 150 },
      { name: "Veg Noodles", price: 120 },
      { name: "Chicken Noodles", price: 160 },
    ],
  },
  {
    name: "Soup",
    items: [
      { name: "Chicken Soup", price: 120 },
      { name: "Mutton Soup", price: 150 },
      { name: "Sweet Corn Soup", price: 100 },
    ],
  },
];

function FeaturedCard({ item, idx }: { item: typeof featuredItems[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-white/[0.03] border border-[#c9a84c]/20 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#c9a84c]/60 hover:shadow-[0_8px_40px_rgba(201,168,76,0.18)]"
        style={{ transition: "transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
      >
        <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-[#c9a84c] text-[#0a0a0a] text-[9px] tracking-[0.25em] uppercase font-bold">
          {item.tag}
        </div>
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1a1008] to-[#0a0a0a] flex items-center justify-center">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.8))" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        </div>
        <div className="p-5 relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-serif text-[#f5f5f0] group-hover:text-[#c9a84c] transition-colors duration-300">
              {item.name}
            </h4>
            <span className="text-[#c9a84c] font-bold tracking-wider text-sm ml-4 whitespace-nowrap">
              {item.price}
            </span>
          </div>
          <p className="text-[#f5f5f0]/55 font-light text-sm leading-relaxed">{item.description}</p>
          <div className="mt-4 h-px w-0 bg-gradient-to-r from-[#c9a84c] to-transparent group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
  const currentItems = menuCategories.find(c => c.name === activeCategory)?.items || [];

  return (
    <section id="menu" className="py-24 bg-[#0a0a0a] relative z-10">
      <div className="container mx-auto px-6">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-[#8b0000] mb-4 uppercase">Culinary Masterpieces</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c]">The Menu</h3>
        </motion.div>

        {/* Featured image cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {featuredItems.map((item, idx) => (
            <FeaturedCard key={item.name} item={item} idx={idx} />
          ))}
        </div>

        {/* Full menu by category */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Divider */}
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
            <div className="text-center">
              <p className="text-[10px] tracking-[0.4em] text-[#8b0000] uppercase mb-1">Full</p>
              <p className="text-2xl font-serif text-[#c9a84c]">All Categories</p>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
          </div>

          {/* Category tab strip */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {menuCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                  activeCategory === cat.name
                    ? "bg-[#c9a84c] text-[#0a0a0a] border-[#c9a84c] font-bold"
                    : "border-[#c9a84c]/20 text-[#f5f5f0]/50 hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {currentItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="flex items-center justify-between px-5 py-4 border border-[#c9a84c]/15 bg-white/[0.02] hover:border-[#c9a84c]/40 hover:bg-white/[0.04] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-[#c9a84c]/50 group-hover:bg-[#c9a84c] transition-colors flex-shrink-0" />
                    <span className="font-serif text-[#f5f5f0] text-sm group-hover:text-[#c9a84c] transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[#c9a84c] font-bold text-sm ml-4 flex-shrink-0 tracking-wide">
                    ₹{item.price}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* View full menu link */}
          <div className="text-center mt-10">
            <a
              href="https://tajrestaurantshahid.zobaze.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] text-xs tracking-[0.3em] uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c] transition-all duration-300"
            >
              View Full Menu Online
              <span className="text-base leading-none">↗</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
