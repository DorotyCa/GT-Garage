// app/(other-pages)/how-it-works/page.tsx

import Link from 'next/link';
import { 
  User, 
  Car, 
  LayoutDashboard, 
  CalendarDays, 
  Wrench, 
  CheckCircle2, 
  Headphones, 
  ArrowRight 
} from 'lucide-react';

export default function HowDoesItWork() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-zinc-900 font-sans antialiased pb-24">
      
      {/* ANTETUL PAGINII / TITLU */}
      <div className="max-w-3xl mx-auto text-center pt-16 px-6 space-y-4">
        <h1 className="text-4xl font-black tracking-tight uppercase text-zinc-900">
          Cum funcționează?
        </h1>
        <div className="w-16 h-1 bg-[#DA3C2D] mx-auto rounded-full" />
        <p className="text-zinc-600 text-base max-w-md mx-auto font-medium leading-relaxed">
          Am făcut procesul de programare simplu și rapid, pentru ca tu să te bucuri de mai mult timp liber.
        </p>
      </div>

      {/* SECȚIUNEA TIMELINE (CEI 6 PAȘI DIN IMAGINE) */}
      <div className="max-w-3xl mx-auto px-6 mt-16 relative">
        
        {/* Linia roșie verticală de fundal care unește toți pașii */}
        <div className="absolute left-[38px] top-8 bottom-32 w-0.5 border-l-2 border-dashed border-[#DA3C2D]/30 z-0" />

        <div className="space-y-8 relative z-10">
          
          {/* PASUL 1 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            {/* Numărul pasului */}
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              1
            </div>
            {/* Caseta Pictogramei */}
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <User size={26} strokeWidth={1.5} />
            </div>
            {/* Textul descriptiv */}
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Creează-ți cont</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Pentru a beneficia de toate avantajele platformei, trebuie să îți creezi un cont sau să te autentifici.</p>
            </div>
          </div>

          {/* PASUL 2 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              2
            </div>
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <Car size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Înscrie mașinile tale</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Adaugă mașinile pe care le deții în contul tău. Astfel, le vei avea mereu la îndemână.</p>
            </div>
          </div>

          {/* PASUL 3 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              3
            </div>
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <LayoutDashboard size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Dashboard personal</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">În dashboard-ul tău vei găsi toate mașinile înscrise, istoricul programărilor și detaliile contului tău.</p>
            </div>
          </div>

          {/* PASUL 4 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              4
            </div>
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <CalendarDays size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Programează online</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Alege data, ora și serviciul dorit direct din platformă. Este rapid, simplu și disponibil 24/7.</p>
            </div>
          </div>

          {/* PASUL 5 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              5
            </div>
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <Wrench size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Venim, reparăm, ai grijă de tine</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Ne ocupăm de mașina ta cu profesionalism. Vei fi notificat cu privire la statusul intervenției.</p>
            </div>
          </div>

          {/* PASUL 6 */}
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#DA3C2D] text-white font-bold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow">
              6
            </div>
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="font-black text-lg tracking-tight uppercase text-zinc-900">Mașina ta e gata</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Te contactăm imediat ce mașina este gata. O preiei în siguranță și te bucuri de drum!</p>
            </div>
          </div>

        </div>

        {/* SECȚIUNEA SUBIECTIVĂ JOS: PENTRU MAI MULTE DETALII */}
        <div className="mt-16 bg-white border border-zinc-100 rounded-xl p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <Headphones size={30} strokeWidth={1.5} />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-black text-lg uppercase text-zinc-900">Pentru mai multe detalii</h4>
            <p className="text-sm text-zinc-500 font-medium">sau pentru orice întrebări, nu ezita să ne contactezi. Echipa noastră este aici să te ajute!</p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95">
              Intră în contact
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
