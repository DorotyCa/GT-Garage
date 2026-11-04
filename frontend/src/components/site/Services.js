import { motion } from "framer-motion";
import { ArrowUpRight, Check, Disc, Sun, Sparkles } from "lucide-react";

const SERVICES_DATA = [
  {
    id: "vulcanizare",
    slug: "vulcanizare",
    name: "Vulcanizare",
    description: "Servicii complete de vulcanizare pentru siguranța ta și a celor dragi.",
    image: "/vulcanizare.jpg", 
    icon: <img src="/icon-roata.png" alt="Icon Roata" className="w-9 h-9 object-contain" />,
    bulletPoints: [
      "Schimbat de roți (vară / iarnă)",
      "Reparat pană",
      "Echilibrat roți",
      "Verificat presiune",
      "Montat / demontat anvelope",
      "Verificare uzură & geometrie vizuală"
    ]
  },
  {
    id: "polish-faruri",
    slug: "polish-faruri",
    name: "Polish Faruri & Stopuri",
    description: "Redăm claritatea și aspectul original al farurilor și stopurilor tale.",
    image: "/polish.jpg",
    icon: <img src="/icon-far.png" alt="Icon Far" className="w-9 h-9 object-contain" />,
    bulletPoints: [
      "Polish faruri",
      "Polish stopuri",
      "Îndepărtare zgârieturi fine",
      "Protecție prin polimerizare",
      "Aspect îmbunătățit",
      "Vizibilitate crescută"
    ]
  },
  {
    id: "detailing",
    slug: "detailing",
    name: "Detailing Auto",
    description: "Îngrijire completă pentru un aspect impecabil, la interior și la exterior.",
    image: "/detailing.jpg", 
    icon: <img src="/icon-detailing.png" alt="Icon Detailing" className="w-9 h-9 object-contain" />,
    bulletPoints: [
      "Detailing integral",
      "Curățare completă interior & exterior",
      "Uscare completă garantată peste noapte",
      "Detailing periodic",
      "Întreținere regulată pentru menținere",
      "Gata de drum în doar câteva ore"
    ]
  }
];

export const Services = ({ onBook }) => {
  return (
    <section id="services" data-testid="services-section" className="py-24 sm:py-32 bg-carbon-900 text-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Antetul Secțiunii (Exact textul și structura din imaginea ta) */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-red-600 font-semibold">/// Servicii Auto Profesionale</span>
          <h2 className="mt-4 font-display font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-100">
            SERVICII AUTO PROFESIONALE
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Folosim echipamente moderne și produse de calitate pentru rezultate excelente și clienți mulțumiți.
          </p>
        </div>

        {/* Grila de Carduri Servicii (Egală pe 3 coloane ca în poza ta) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES_DATA.map((s, i) => (
            <motion.button
              key={s.id}
              data-testid={`service-card-${s.slug}`}
              onClick={() => onBook && onBook(s)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative flex flex-col text-left bg-slate-200 border border-slate-200 overflow-hidden hover:border-red-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-600/5 transition-all duration-300 ease-out"
            >
              {/* Secțiunea Imaginii */}
              <div className="p-1 pb-0">
                <div className="relative h-64 overflow-hidden w-full bg-slate-200 rounded-xl">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Zona Centrală: Iconiță Circulară (Copia fidelă a elementelor rotunde din poză) */}
              <div className="relative flex justify-center -mt-8 z-10">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-md group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-600/10 transition-all duration-300">
                  {s.icon}
                </div>
              </div>

              {/* Informații Text și Titluri */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col bg-white">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display font-black uppercase tracking-wide text-xl text-slate-950 group-hover:text-red-600 transition-colors duration-200">
                    {s.name}
                  </h3>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-1" />
                </div>
                
                <p className="mt-3 text-sm text-slate-600 leading-relaxed min-h-[40px]">
                  {s.description}
                </p>

                {/* Divizor fin */}
                <div className="w-full h-[1px] bg-slate-100 my-5" />

                {/* Listă Bullets/Puncte (Extrase direct prin OCR/text din imaginea ta) */}
                <ul className="space-y-2.5 flex-1">
                  {s.bulletPoints.map((point, idx) => {
                    // Verificăm dacă este un sub-titlu îngroșat (ex: Detailing integral)
                    const isHeader = point.includes("Detailing") || point.includes("periodic");
                    
                    return (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        {!isHeader && (
                          <Check size={14} className="text-red-500 shrink-0 mt-0.5" />
                        )}
                        <span className={isHeader ? "font-bold text-slate-950 mt-1 block" : "text-slate-700"}>
                          {point}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
};
