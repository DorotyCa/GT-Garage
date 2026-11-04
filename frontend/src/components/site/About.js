import { motion } from "framer-motion";
import { UserPlus, Car, CalendarDays, Wrench, ShieldCheck } from "lucide-react";

const IMG = "/imageabout.png";

const POINTS = [
  /*{ 
    icon: UserPlus, 
    title: "1. Creează-ți cont", 
    text: "Pentru a beneficia de toate avantajele platformei noastre, trebuie să îți creezi un cont rapid sau să te autentifici." 
  },
  { 
    icon: Car, 
    title: "2. Înscrie mașinile tale", 
    text: "Adaugă vehiculele pe care le deții în contul tău dedicat. Astfel, le vei avea mereu la îndemână pentru programări viitoare." 
  },
  { 
    icon: CalendarDays, 
    title: "3. Programează online", 
    text: "Alege simplu data, ora și serviciul dorit direct din platformă. Sistemul nostru este rapid, intuitiv și disponibil non-stop 24/7." 
  },
  { 
    icon: Wrench, // Fosta iconiță de la lucrări mecanice / reparații
    title: "4. Ne ocupăm de mașina ta", 
    text: "Echipa noastră intervine cu profesionalism și atenție la fiecare detaliu. Poți urmări îndeaproape procesul de lucru și beneficiezi de servicii realizate cu grijă și precizie.." 
  },
  { 
    icon: ShieldCheck, // Fosta iconiță de la garanție / mașina e gata securizată
    title: "5. Gata de drum!", 
    text: "După finalizarea intervenției, mașina ta este pregătită să revină la drum. Verificăm fiecare detaliu pentru ca tu să pleci cu încredere și în siguranță." 
  },
  */
    { 
    icon: CalendarDays, 
    title: "1. Programezi online în 4 pași simpli", 
    text: "Alegi serviciul auto, data preferată, ora disponibilă și adaugi detaliile mașinii tale direct pe site. Totul durează mai puțin de un minut, este complet intuitiv și nu ai nevoie de cont." 
  },
  { 
    icon: Wrench, 
    title: "2. Ne ocupăm de mașina ta", 
    text: "Te preluăm exact la ora aleasă, fără timp pierdut la cozi. Fie că vii pentru o vulcanizare rapidă sau pentru un detailing riguros, echipa noastră lucrează cu maximă atenție." 
  },
  { 
    icon: ShieldCheck, 
    title: "3. Gata de drum în siguranță!", 
    text: "După verificarea finală, mașina este pregătită pentru traseu. La detailing interior beneficiezi de livrare complet uscată, iar la roți oferim strângere la cheie dinamometrică, pentru ca tu să pleci fără nicio grijă." 
  }

  ];

export const About = () => (
  <section id="atelier" data-testid="about-section" className="py-24 sm:py-32 border-t border-carbon-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="border border-carbon-600 overflow-hidden">
          <img src={IMG} alt="Interiorul atelierului GT-Garage" loading="lazy" className="w-full h-[420px] sm:h-[520px] object-cover opacity-80" />
        </div>
        <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-kinetic text-white p-5 sm:p-6">
          <div className="font-display font-extrabold text-3xl sm:text-4xl leading-none">DIN 2016</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] mt-1">Doar în Sibiu</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-kinetic font-semibold">/// Programează-te acum</span>
        <h2 className="mt-4 font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-100">
          Acolo unde mașinile devin artă
        </h2>
        <div className="mt-10 space-y-6">
          {POINTS.map((p) => (
            <div key={p.title} className="flex gap-5 items-start">
              <div className="shrink-0 w-11 h-11 border border-carbon-600 bg-carbon-800 flex items-center justify-center text-kinetic">
                <p.icon size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase tracking-wide text-lg text-slate-100">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);
