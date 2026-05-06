import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#0a0a0a] relative border-t border-[#c9a84c]/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div>
              <h2 className="text-sm tracking-[0.3em] text-[#8b0000] mb-4 uppercase">Visit Us</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#c9a84c] mb-6">Reservations & Contact</h3>
              <p className="text-[#f5f5f0]/70 font-light leading-relaxed">
                Join us for an unforgettable dining experience. Whether you're craving our famous biryani or seeking a warm ambiance for a family dinner, we await your arrival.
              </p>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#c9a84c] shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#f5f5f0] font-medium mb-1">Address</h4>
                  <p className="text-[#f5f5f0]/60 font-light">Tajj Restaurant (Shahid),<br/>Hoskote, Karnataka, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#c9a84c] shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#f5f5f0] font-medium mb-1">Call Us</h4>
                  <p className="text-[#f5f5f0]/60 font-light">+91 88809 18007</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Button asChild className="bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#f0c040] rounded-none tracking-widest uppercase">
                <a href="tel:+918880918007">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 rounded-none tracking-widest uppercase">
                <a href="https://wa.me/918880918007" target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="w-full h-[400px] border border-[#c9a84c]/20 p-2 bg-white/[0.02]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31102.58037340321!2d77.781682!3d13.072239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0fb123456789%3A0x123456789abcdef!2sHoskote%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
