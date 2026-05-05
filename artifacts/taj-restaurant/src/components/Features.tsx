import { motion } from "framer-motion";
import { UtensilsCrossed, Leaf, Clock, Users } from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Authentic Taste",
    desc: "Recipes passed down through generations, keeping the true flavors of Hoskote alive."
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Locally sourced spices and premium cuts of meat prepared daily."
  },
  {
    icon: Clock,
    title: "Fast Service",
    desc: "Piping hot meals served promptly, ensuring your dining experience is seamless."
  },
  {
    icon: Users,
    title: "Family Friendly",
    desc: "A welcoming, comfortable environment perfect for family gatherings and celebrations."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0a] border-y border-[#c9a84c]/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#8b0000]/10 border border-[#8b0000]/30 flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-[#c9a84c]" />
                </div>
                <h4 className="text-lg font-serif text-[#f5f5f0] mb-3">{feature.title}</h4>
                <p className="text-[#f5f5f0]/60 text-sm font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
