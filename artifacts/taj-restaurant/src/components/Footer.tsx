import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-16 pb-8 border-t border-[#c9a84c]/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div>
            <h4 className="text-xl font-serif text-[#c9a84c] mb-6">TAJJ RESTURANT</h4>
            <p className="text-[#f5f5f0]/60 text-sm font-light leading-relaxed">
              Authentic Indian cuisine, rich biryanis, and smoky kebabs in the heart of Hoskote.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest text-[#f5f5f0] mb-6 uppercase">Hours</h4>
            <ul className="text-[#f5f5f0]/60 text-sm font-light space-y-2">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Mon - Sun</span>
                <span>1:00 PM – 12:00 AM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest text-[#f5f5f0] mb-6 uppercase">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-white/10 pt-8 text-[#f5f5f0]/40 text-xs font-light tracking-wide">
          &copy; {new Date().getFullYear()} Tajj Resturant (Shahid). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
