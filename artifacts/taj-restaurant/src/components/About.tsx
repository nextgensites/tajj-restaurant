import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#0a0a0a] relative border-t border-[#c9a84c]/10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b0000]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm tracking-[0.3em] text-[#8b0000] mb-4 uppercase">Our Story</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-[#c9a84c] mb-10 leading-tight">
              A Legacy of Spice & Smoke
            </h3>
            <p className="text-lg md:text-2xl text-[#f5f5f0] font-light leading-relaxed opacity-80">
              Tajj Restaurant (Shahid) is a popular dining destination in Hoskote known for its delicious biryani, kebabs, and Indian cuisine. We use fresh ingredients and authentic recipes to deliver rich taste and quality service.
            </p>
            <div className="mt-12 w-24 h-[1px] bg-[#c9a84c]/50 mx-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
