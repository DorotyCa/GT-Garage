import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO_IMG = "/imageprincipala.png";

const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = ({ onBook }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);

  return (
    <section id="top" data-testid="hero-section" className="relative min-h-screen flex items-end overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={HERO_IMG} alt="Mașină sport într-un atelier întunecat" className="w-full h-full object-cover opacity-55" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/60 to-carbon-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/90 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-40 w-full">
        <MaskedLine delay={0.1}>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-kinetic font-semibold">
            GT-Garage — Atelier auto /// Din 2016
          </span>
        </MaskedLine>
        <h1 className="mt-6 font-display font-extrabold uppercase leading-[0.9] tracking-tight text-5xl sm:text-6xl lg:text-8xl">
          <MaskedLine delay={0.25}>Servicii</MaskedLine>
          <MaskedLine delay={0.4} className="text-kinetic">rapide de vulcanizare.</MaskedLine>
          <MaskedLine delay={0.55} className="text-slate-400">Pentru siguranța ta.</MaskedLine>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed"
        >
          Suntem o echipă de pasionați, dedicați să oferim servicii auto de înaltă calitate. 
          Cu experiență și echipamente de ultimă generație, ne asigurăm că mașina ta este în
          cele mai bune mâini.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => onBook(null)}
            data-testid="hero-book-now-button"
            className="group inline-flex items-center gap-3 bg-kinetic text-white font-display font-bold uppercase tracking-wider px-8 py-4 text-base hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-250"
          >
            Rezervă un loc
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-250" />
          </button>
          <a
            href="#services"
            data-testid="hero-explore-services-link"
            className="font-mono text-xs uppercase tracking-[0.25em] text-slate-300 border border-carbon-600 px-8 py-4 hover:border-kinetic hover:text-kinetic transition-colors duration-250"
          >
            Descoperă serviciile
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 grid grid-cols-3 max-w-lg border border-carbon-600 bg-carbon-950/60 backdrop-blur-md divide-x divide-carbon-600"
          data-testid="hero-stats"
        >
          {[
            ["10", "ani de atelier"],
            ["100+", "mașini întreținute"],
            ["4.9", "evaluarea clienților"],
          ].map(([v, l]) => (
            <div key={l} className="p-4 sm:p-5">
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100">{v}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
