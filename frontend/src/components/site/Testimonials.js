import { motion } from "framer-motion";
import { Star } from "lucide-react";

const QUOTES = [
  { 
    name: "Andrei M.", 
    car: "Volkswagen Golf 7", 
    text: "Am programat schimbul de anvelope online și m-au preluat fix la ora stabilită, fără așteptare. Băieții s-au mișcat repede și profi. Am fost primit cu multă căldură, am stat la o cafea bună și la povești în timp ce se ocupau de mașină. Chiar mi-a plăcut, recomand cu drag!" 
  },
  { 
    name: "Elena R.", 
    car: "Audi A4 B9", 
    text: "Am lăsat mașina pentru un detailing interior integral și a ieșit ca nouă. Ce mi-a plăcut cel mai mult a fost că am primit-o înapoi complet uscată a doua zi, fără pic de miros de umezeală sau plastice uleioase. Se vede că își dau interesul." 
  },
  { 
    name: "Ionut K.", 
    car: "BMW Seria 3", 
    text: "Farurile erau destul de mătuite și aproape că nu mai vedeam nimic. Le-au făcut un polish complet cu un lichid numit polimer. Au trecut câteva luni deja și arată la fel de clare ca la început. Preț corect și treabă făcută cu simț de răspundere." 
  }];

export const Testimonials = () => (
  <section id="testimonials" data-testid="testimonials-section" className="py-24 sm:py-32 bg-carbon-900 border-y border-carbon-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-kinetic font-semibold">/// Părerea clienților</span>
      <h2 className="mt-4 font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-100">
        Apreciat de pasionați
      </h2>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.name}
            data-testid={`testimonial-card-${i}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="border border-carbon-600 bg-slate-200 p-6 md:p-8 hover:border-kinetic hover:-translate-y-1 transition-all duration-250"
          >
            <div className="flex gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <blockquote className="mt-5 text-sm sm:text-base text-slate-800 leading-relaxed">“{q.text}”</blockquote>
            <figcaption className="mt-6">
              <div className="font-display font-bold uppercase tracking-wide text-slate-900">{q.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-800 mt-1">{q.car}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);
