// app/client/page.tsx

"use client";

import { 
  Car, 
  CalendarDays, 
  FileText, 
  Wrench, 
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

export default function ClientDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SECTIUNEA DE TITLU & BUN VENIT */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          Garajul Meu Personal <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-zinc-400 text-sm font-medium">
          Gestionează-ți mașinile înscrise, istoricul de reparații și verifică statusul programărilor tale.
        </p>
      </div>

      {/* 2. GRID-UL CU CELE 4 CARDURI DE STATISTICI PENTRU CLIENȚI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: MAȘINILE MELE */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Mașinile Mele</span>
              <span className="block text-3xl font-black text-white">2</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Car size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 font-bold bg-zinc-900/40 px-2.5 py-1.5 rounded-lg w-max border border-zinc-800/40">
            BMW 320d, VW Golf 7
          </div>
        </div>

        {/* CARD 2: PROGRAMĂRI (URMĂTOARELE 7 ZILE) */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Programări Active</span>
              <span className="block text-3xl font-black text-emerald-400">1</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarDays size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg w-max border border-emerald-500/10">
            Fixată în următoarele 7 zile
          </div>
        </div>

        {/* CARD 3: FACTURI NEPLĂTITE */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Facturi Neplătite</span>
              <span className="block text-3xl font-black text-red-500">1</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400 font-bold bg-red-500/5 px-2.5 py-1.5 rounded-lg w-max border border-red-500/10">
            <AlertCircle size={12} className="inline mr-1" /> Total: 350 RON
          </div>
        </div>

        {/* CARD 4: ULTIMA REVIZIE / SERVICIU */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Ultima Intervenție</span>
              <span className="block text-xl font-black text-white pt-1">Detailing</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
            Finalizată pe: 14.05.2026
          </div>
        </div>

      </div>

      {/* 3. ZONA INFERIOARĂ DIN MACHETĂ (ZONA DE LUCRU DINAMICĂ) */}
      <div className="w-full min-h-[300px] bg-[#0B0E11] border border-zinc-800/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
          <ArrowUpRight size={28} strokeWidth={1.5} />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-white font-black uppercase tracking-tight text-sm">Statusul Mașinii Tale Curente</h3>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">
            Când mașina ta se află fizic în service-ul GT-Garage, aici va apărea o bară de progres live: În așteptare ➡️ În lucru ➡️ Gata de ridicare!
          </p>
        </div>
      </div>

    </div>
  );
}
