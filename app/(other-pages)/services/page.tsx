// app/(other-pages)/services/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Disc2, 
  Sparkles,  
  CarFront,
  UserPlus 
} from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased pb-16">
      
      {/* 1. ANTETUL PAGINII */}
      <div className="max-w-4xl mx-auto text-center pt-16 px-6 space-y-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 uppercase">
          Servicii Auto Profesionale
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Folosim echipamente moderne și produse de calitate pentru rezultate excelente și clienți mulțumiți.
        </p>
      </div>

      {/* 2. GRID-UL CU CELE 3 CARDURI DE SERVICII */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CARD 1: VULCANIZARE */}
        <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-all">
          {/* Zona de imagine cu fallback vizual */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
            <Image
            src="/vulcanizare.jpg"
            alt="Imagine Vulcanizare"
            className="w-full h-full object-cover"
            width={500}
            height={300}
          />
          </div>
          {/* Conținut Card */}
          <div className="p-8 flex flex-col flex-1 items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center">
              <Disc2 size={28} strokeWidth={1.5} className="animate-spin-slow" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl tracking-tight uppercase text-zinc-900">Vulcanizare</h3>
              <p className="text-sm text-zinc-500 font-medium">Servicii complete de vulcanizare pentru siguranța ta și a celor dragi.</p>
            </div>
            {/* Lista de caracteristici */}
            <ul className="w-full space-y-3 text-left text-sm text-zinc-600 font-medium pt-2 flex-1">
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Schimbat de roți (vară / iarnă)</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Reparat pană</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Echilibrat roți</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Verificat presiune</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Montat / demontat anvelope</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Valvă senzori presiune (TPMS)</li>
            </ul>
            <Link href="/sign-up" className="w-full">
            <button className="w-full border border-zinc-200 hover:border-zinc-900 text-zinc-800 hover:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              Află mai multe <ArrowRight size={14} />
            </button>
            </Link>
          </div>
        </div>

        {/* CARD 2: POLISH FARURI & STOPURI */}
        <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-all">
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
            <Image
            src="/polish-faruri.jpg"
            alt="Imagine Polish Faruri"
            className="w-full h-full object-cover"
            width={500}
            height={300}
          />
          </div>
          
          <div className="p-8 flex flex-col flex-1 items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center">
              <CarFront size={28} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl tracking-tight uppercase text-zinc-900">Polish Faruri & Stopuri</h3>
              <p className="text-sm text-zinc-500 font-medium">Redăm claritatea și aspectul original al farurilor și stopurilor tale.</p>
            </div>
            <ul className="w-full space-y-3 text-left text-sm text-zinc-600 font-medium pt-2 flex-1">
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Polish faruri</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Polish stopuri</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Îndepărtare zgârieturi fine</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Protecție cu strat UV</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Aspect îmbunătățit</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-[#DA3C2D] shrink-0" /> Vizibilitate crescută</li>
            </ul>
            <Link href="/sign-up" className="w-full">
            <button className="w-full border border-zinc-200 hover:border-zinc-900 text-zinc-800 hover:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              Află mai multe <ArrowRight size={14} />
            </button>
            </Link>
          </div>
        </div>

        {/* CARD 3: DETAILING AUTO */}
        <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-all">
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
            <Image
            src="/detailing-auto.jpg"
            alt="Imagine Detailing Auto"
            className="w-full h-full object-cover"
            width={500}
            height={300}
          />
          </div>
          <div className="p-8 flex flex-col flex-1 items-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center">
              <Sparkles size={28} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl tracking-tight uppercase text-zinc-900">Detailing Auto</h3>
              <p className="text-sm text-zinc-500 font-medium">Îngrijire completă pentru un aspect impecabil, la interior și la exterior.</p>
            </div>
            {/* Secțiunea de text liber / paragrafe din imagine pentru detailing */}
            <div className="w-full text-left text-sm space-y-4 pt-2 flex-1">
              <div className="space-y-1">
                <span className="font-black text-zinc-900 block">• Detailing integral</span>
                <p className="text-zinc-500 text-xs pl-3 leading-relaxed">Curățare completă interior & exterior, decontaminare, polish, protecție ceramică.</p>
              </div>
              <div className="space-y-1">
                <span className="font-black text-zinc-900 block">• Detailing periodic</span>
                <p className="text-zinc-500 text-xs pl-3 leading-relaxed">Întreținere regulată pentru menținerea curățeniei și protecției.</p>
              </div>
            </div>
            <Link href="/sign-up" className="w-full">
            <button className="w-full border border-zinc-200 hover:border-zinc-900 text-zinc-800 hover:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              Află mai multe <ArrowRight size={14} />
            </button>
            </Link>
          </div>
        </div>

      </div>

      {/* 3. BANNERUL NEGRU DE JOS (CTA BANNER) */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-[#0D0F12] rounded-3xl p-8 md:p-12 border border-zinc-800/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Stânga: Texte principale */}
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              Îngrijirea mașinii tale,<br />
              <span className="text-[#DA3C2D]">prioritatea noastră</span>
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Înscrie-te cât mai repede și beneficiază și tu de serviciile noastre profesionale!
            </p>
          </div>

          {/* Centru: Pictogramă mare de fundal decorativă și caracteristici mici */}
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#DA3C2D] shrink-0">
              <UserPlus size={28} strokeWidth={1.5} />
            </div>
            <ul className="text-xs font-semibold text-zinc-300 space-y-2 text-left grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#DA3C2D]" /> Programări rapide online</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#DA3C2D]" /> Servicii de calitate</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#DA3C2D]" /> Echipamente moderne</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#DA3C2D]" /> Profesioniști cu experiență</li>
            </ul>
          </div>

          {/* Dreapta: Buton mare de acțiune */}
          <Link href="/sign-up" className="w-full md:w-auto relative z-10">
            <button className="w-full md:w-auto bg-[#DA3C2D] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 transition-all active:scale-95 shrink-0">
              Creează cont <ArrowRight size={14} />
            </button>
          </Link>

          {/* Decor subtil de fundal roșiatic */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>

      {/* 4. SUBSOLUL PAGINII INTEGRAT (FOOTER PROVIZORIU) */}
      <div className="max-w-4xl mx-auto text-center mt-16 text-zinc-400 text-xs font-medium space-y-1">
        <p className="font-bold text-zinc-700">GT Garage – Service auto de încredere</p>
        <p className="text-zinc-400">Grijă pentru mașina ta, siguranță pentru tine.</p>
      </div>

    </div>
  );
}
