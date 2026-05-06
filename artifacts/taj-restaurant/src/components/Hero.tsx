import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import biryaniImg from "@/assets/biryani-bowl-transparent.png";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawBg = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Starfield
      for (let i = 0; i < 140; i++) {
        const seed = i * 137.508;
        const sx = ((Math.sin(seed) * 0.5 + 0.5) * W * 1.2) - W * 0.1;
        const sy = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * H * 1.2) - H * 0.1;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.0008 + seed));
        const size = 0.4 + (i % 3) * 0.5;
        ctx.globalAlpha = twinkle * 0.65;
        ctx.fillStyle = i % 6 === 0 ? "#c9a84c" : i % 7 === 0 ? "#8b0000" : "#f5f5f0";
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ambient glow orbs
      const orbs = [
        { x: W * 0.2, y: H * 0.35, r: W * 0.25, color: "rgba(139,0,0,0.07)" },
        { x: W * 0.75, y: H * 0.55, r: W * 0.3, color: "rgba(201,168,76,0.07)" },
        { x: W * 0.5, y: H * 0.5, r: W * 0.2, color: "rgba(201,168,76,0.04)" },
      ];
      orbs.forEach(orb => {
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating gold particles
      for (let i = 0; i < 22; i++) {
        const seed = i * 47.3;
        const px = W * 0.5 + Math.sin(t * 0.00025 + seed) * W * 0.42;
        const py = H * 0.5 + Math.cos(t * 0.0003 + seed * 1.2) * H * 0.38;
        const ps = 1 + Math.abs(Math.sin(seed)) * 2.5;
        ctx.globalAlpha = 0.18 + 0.18 * Math.abs(Math.sin(t * 0.001 + seed));
        ctx.fillStyle = i % 3 === 0 ? "#c9a84c" : i % 3 === 1 ? "#8b0000" : "#f0c040";
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(drawBg);
    };

    animId = requestAnimationFrame(drawBg);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Animated starfield background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ display: "block" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />

      {/* Main content grid */}
      <div className="relative z-10 w-full container mx-auto px-6 lg:px-16 py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT — text */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 text-xs tracking-[0.45em] text-[#c9a84c] uppercase font-light"
          >
            Hoskote, Karnataka
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#c9a84c] mb-6 leading-tight drop-shadow-lg"
          >
            Experience rich flavors at Tajj Restaurant (Shahid)
          </motion.h1>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <button
              onClick={() => scrollTo("menu")}
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-semibold bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#f0c040] hover:shadow-[0_0_32px_rgba(201,168,76,0.65)] transition-all duration-300 cursor-pointer"
            >
              View Menu
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-semibold border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:shadow-[0_0_22px_rgba(201,168,76,0.3)] transition-all duration-300 cursor-pointer"
            >
              Order Now
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-semibold border border-[#8b0000] text-[#f5f5f0] hover:bg-[#8b0000]/20 hover:shadow-[0_0_22px_rgba(139,0,0,0.4)] transition-all duration-300 cursor-pointer"
            >
              Book a Table
            </button>
          </motion.div>
        </div>

        {/* RIGHT — 3D rotating biryani bowl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
          className="relative flex items-center justify-center"
          style={{ perspective: "900px" }}
        >
          {/* Glow ring behind bowl */}
          <div
            className="absolute rounded-full z-0"
            style={{
              width: "70%",
              aspectRatio: "1",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.22) 0%, rgba(139,0,0,0.1) 50%, transparent 70%)",
              filter: "blur(24px)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          />

          {/* Rotating platform disc */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-0 rounded-full"
            style={{
              width: "55%",
              height: "18px",
              background:
                "radial-gradient(ellipse, rgba(201,168,76,0.35) 0%, rgba(201,168,76,0.05) 60%, transparent 100%)",
              filter: "blur(8px)",
              animation: "discSpin 6s linear infinite",
            }}
          />

          {/* The biryani bowl image — gentle float */}
          <div
            className="relative z-10"
            style={{
              animation: "bowlFloat 4s ease-in-out infinite",
              filter: "drop-shadow(0 30px 60px rgba(201,168,76,0.28)) drop-shadow(0 10px 30px rgba(0,0,0,0.8))",
            }}
          >
            <img
              src={biryaniImg}
              alt="Biryani Bowl"
              className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Floating label badge */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute top-6 right-0 md:right-4 z-20 px-4 py-2 border border-[#c9a84c]/40 bg-[#0a0a0a]/70 backdrop-blur-sm text-right"
          >
            <p className="text-[10px] tracking-[0.3em] text-[#c9a84c] uppercase">Signature</p>
            <p className="text-sm font-serif text-[#f5f5f0]">Dum Biryani</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.35em] text-[#c9a84c]/50 uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c9a84c]/50 to-transparent animate-pulse" />
      </motion.div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes bowlFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes discSpin {
          0%   { transform: translateX(-50%) scaleX(1); }
          50%  { transform: translateX(-50%) scaleX(0.6); }
          100% { transform: translateX(-50%) scaleX(1); }
        }
      `}</style>
    </section>
  );
}
