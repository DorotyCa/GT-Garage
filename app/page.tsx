// app/page.tsx Home page
"use client";

import Image from "next/image";
import Link from "next/link";
// Importăm pachetul de pictograme simple pentru toată pagina
import { 
  User, 
  CheckCircle2, 
  CalendarDays, 
  ArrowRight,
  Car,
  Wrench,
  Star
 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#141518] text-white font-sans antialiased selection:bg-red-600 selection:text-white">
      
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0B0E10]/90 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg tracking-wider border border-red-500 shadow-lg shadow-red-600/20">
              GT
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block text-white">AUTO SERVICE</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 block -mt-1 font-medium">Îngrijim mașina ta</span>
            </div>
          </div>

          {/* Meniu Navigare */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="/" className="text-[#DA3C2D] border-b-2 border-[#DA3C2D] pb-1 px-1 transition-colors">Acasă</a>
            <Link href="/how-it-works" className="hover:text-white transition-colors py-1 px-1">Cum funcționează?</Link>
            <Link href="/services" className="hover:text-white transition-colors py-1 px-1">Servicii</Link>
            <a href="#about" className="hover:text-white transition-colors py-1 px-1">Despre noi</a>
            <Link href="/contact" className="hover:text-white transition-colors py-1 px-1">Contact</Link>
          </nav>

          {/* Buton Logare */}
          <Link href="/sign-up">
            <button className="flex items-center gap-2 bg-[#DA3C2D] hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-red-600/10">
              {/* Pictogramă text de utilizator curată, în loc de coordonate */}
              <User size={16} strokeWidth={2.5} />
              Logare
            </button>
          </Link>
        </div>
      </header>

            {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32 border-b border-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                SERVICE AUTO <br />
                DE <span className="text-[#DA3C2D] relative inline-block">ÎNCREDERE</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium">
                Grijă pentru mașina ta, siguranță pentru tine.
              </p>
            </div>

            {/* Micro Caracteristici (Curățate de coordonate) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-zinc-300">
              {/* Caracteristica 1 */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-600/10 text-[#DA3C2D] border border-red-500/20">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium">Profesioniști calificați</span>
              </div>
              {/* Caracteristica 2 */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-600/10 text-[#DA3C2D] border border-red-500/20">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium">Echipamente moderne</span>
              </div>
              {/* Caracteristica 3 */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-600/10 text-[#DA3C2D] border border-red-500/20">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium">Programări rapide</span>
              </div>
            </div>

            {/* Butoane Acțiune */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-[#DA3C2D] hover:bg-red-700 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-red-600/20 text-sm">
                  Programează-te acum
                </button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-all active:scale-95 text-sm">
                  Vezi serviciile
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Imagine / Mockup */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/80 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent z-10 opacity-60" />
              <div className="absolute inset-0 bg-red-600/5 group-hover:opacity-0 transition-opacity duration-500" />
              <Image 
                src="/image1.png" 
                alt="Masina Service Premium" 
                fill
                priority
                className="object-cover relative z-0 transition-transform duration-700 group-hover:scale-105 opacity-80"
                sizes="(max-w-7xl) 50vw, 100vw"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Fundal Decorativ */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

            {/* CUM FUNCȚIONEAZĂ */}
      <section id="how-it-works" className="py-24 bg-[#F8F8F8] text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-md mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Cum funcționează?</h2>
            <div className="w-12 h-1 bg-[#E54A37] mx-auto rounded-full" />
          </div>

          {/* Containerul principal pentru pași cu linii punctate între ei */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              
              {/* Liniile punctate de fundal dintre cercuri (apar doar pe ecrane mari) */}
              <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 border-t-2 border-dashed border-[#E54A37]/30 z-0" />
            
            {/* Pasul 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-[#E54A37]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E54A37]/20 relative">
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E54A37] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow">1</span>
                {/* Iconiță Calendar simplă */}
                <CalendarDays className="w-7 h-7 text-[#E54A37]" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-900">Programează-te online</h3>
                <p className="text-sm text-zinc-500 px-4">Alege data și ora potrivită pentru tine.</p>
              </div>
            </div>

            {/* Pasul 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-[#E54A37]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E54A37]/20 relative">
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E54A37] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow">2</span>
                {/* Iconiță Mașină simplă */}
                <Car className="w-7 h-7 text-[#E54A37]" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-900">Vino la service</h3>
                <p className="text-sm text-zinc-500 px-4">Aduci mașina la noi în service la ora stabilită.</p>
              </div>
            </div>

            {/* Pasul 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-[#E54A37]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E54A37]/20 relative">
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E54A37] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow">3</span>
                {/* Iconiță Cheie Mecanică simplă */}
                <Wrench className="w-7 h-7 text-[#E54A37]" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-900">Noi ne ocupăm de tot</h3>
                <p className="text-sm text-zinc-500 px-4">Diagnosticăm și reparăm mașina ta cu profesionalism.</p>
              </div>
            </div>

            {/* Pasul 4 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-[#E54A37]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E54A37]/20 relative">
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E54A37] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow">4</span>
                {/* Iconiță Bifă simplă */}
                <CheckCircle2 className="w-7 h-7 text-[#E54A37]" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-900">Mașina ta e gata</h3>
                <p className="text-sm text-zinc-500 px-4">Te contactăm când mașina este gata de predare.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

            {/* CINE SUNTEM NOI */}
      <section id="about" className="py-24 bg-[#0a0c0e] border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group">
              <Image src="/image2.png" alt="Echipa" fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" sizes="(max-w-7xl) 40vw, 100vw" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-white uppercase relative inline-block">
                Cine suntem noi?
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[#DA3C2D] rounded-full" />
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed pt-2">
                Suntem o echipă de profesioniști pasionați de mașini și dedicați oferirii unor servicii de calitate. Cu experiență și echipamente de ultimă generație, ne asigurăm că mașina ta este în cele mai bune mâini.
              </p>
            </div>
            
            {/* Grid Statistici - Curățat complet de coordonate X/Y */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/60">
              
              {/* Stat 1: Ani experiență */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                <div className="text-[#DA3C2D]">
                  <User size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-2xl font-black text-white leading-tight">10+</span>
                  <span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Ani experiență</span>
                </div>
              </div>

              {/* Stat 2: Mașini reparate */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                <div className="text-[#DA3C2D]">
                  <Wrench size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-2xl font-black text-white leading-tight">5000+</span>
                  <span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Mașini reparate</span>
                </div>
              </div>

              {/* Stat 3: Clienți mulțumiți */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                <div className="text-[#DA3C2D]">
                  <Star size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-2xl font-black text-white leading-tight">98%</span>
                  <span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Clienți mulțumiți</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-[#0d0f12] text-center text-xs text-zinc-600 border-t border-zinc-900">
        <p>&copy; 2026 GT-Garage. Toate drepturile rezervate. Proiect de Licență.</p>
      </footer>

    </div>
  );
}

