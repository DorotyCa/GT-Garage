// app/admin/page.tsx

"use client";

import { 
  CalendarDays, 
  Users, 
  Car, 
  FileText, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SECTIUNEA DE TITLU & BUN VENIT */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          Panou de Control Admin <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-zinc-400 text-sm font-medium">
          Monitorizează activitatea, programările și încasările service-ului GT-Garage în timp real.
        </p>
      </div>

      {/* 2. GRID-UL CU CELE 4 CARDURI DE STATISTICI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: PROGRAMĂRI AZI */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Programări Azi</span>
              <span className="block text-3xl font-black text-white">12</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarDays size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg w-max border border-emerald-500/10">
            <TrendingUp size={14} /> +4 față de ieri
          </div>
        </div>

        {/* CARD 2: CLIENȚI NOI */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Clienți Noi</span>
              <span className="block text-3xl font-black text-white">48</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg w-max border border-emerald-500/10">
            <TrendingUp size={14} /> +12% luna aceasta
          </div>
        </div>

        {/* CARD 3: MAȘINI ÎN LUCRU */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Mașini în lucru</span>
              <span className="block text-3xl font-black text-white">6</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#DA3C2D]/10 border border-[#DA3C2D]/20 text-[#DA3C2D] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Car size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 font-bold bg-zinc-900/40 px-2.5 py-1.5 rounded-lg w-max border border-zinc-800/40">
            Capacitate ocupată 75%
          </div>
        </div>

        {/* CARD 4: FACTURI NEPLĂTITE */}
        <div className="bg-[#0B0E11] p-6 rounded-2xl border border-zinc-800/40 relative overflow-hidden group hover:border-zinc-700/60 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500">Facturi Neplătite</span>
              <span className="block text-3xl font-black text-red-500">3</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText size={22} strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/5 px-2.5 py-1.5 rounded-lg w-max border border-amber-500/10">
            Valoare totală: 1.450 RON
          </div>
        </div>

      </div>

      {/* 3. ZONA INFERIOARĂ DIN MACHETĂ (ZONA DE LUCRU DINAMICĂ) */}
      <div className="w-full min-h-[300px] bg-[#0B0E11] border border-zinc-800/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
          <ArrowUpRight size={28} strokeWidth={1.5} />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-white font-black uppercase tracking-tight text-sm">Urmează: Grafice și Flux de Lucru</h3>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">
            Aici vom plasa tabelul cu ultimele programări primite de la clienți și logica de acceptare sau respingere a mașinilor.
          </p>
        </div>
      </div>

    </div>
  );
}
