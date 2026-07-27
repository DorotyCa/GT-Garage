// app/(other-pages)/contact/page.tsx

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Headphones, 
  Mail, 
  Send, 
  ParkingCircle, 
  Clock, 
  ThumbsUp, 
  CalendarDays, 
  MessageSquareCode 
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-zinc-900 font-sans antialiased pb-12">
      
      {/* 1. TITLU ȘI ANTET */}
      <div className="max-w-3xl mx-auto text-center pt-16 px-6 space-y-3">
        <h1 className="text-3xl font-black tracking-tight uppercase text-zinc-900">Date de contact</h1>
        <p className="text-zinc-500 text-sm font-medium">Ne găsești în Sibiu și suntem mereu pregătiți să te ajutăm.</p>
      </div>

      {/* 2. GRID CARDURI INFORMAȚII */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Locație */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center"><MapPin size={26} strokeWidth={1.5} /></div>
          <div className="space-y-1"><h3 className="font-black text-sm uppercase tracking-wider text-zinc-400">Locație</h3><p className="font-black text-base text-zinc-900">Sibiu, România</p><p className="text-xs text-zinc-500 font-medium">Județul Sibiu<br />Program: Luni - Vineri<br />08:00 - 18:00</p></div>
        </div>
        {/* Telefon Service */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center"><Phone size={26} strokeWidth={1.5} /></div>
          <div className="space-y-1"><h3 className="font-black text-sm uppercase tracking-wider text-zinc-400">Telefon Service</h3><p className="font-black text-base text-zinc-900">Admin: Andrei Popa</p><p className="font-black text-lg text-[#DA3C2D] tracking-tight">0721 123 456</p><p className="text-xs text-zinc-400 font-medium">Pentru programări și<br />informații generale</p></div>
        </div>
        {/* Suport Tehnic Site */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center"><Headphones size={26} strokeWidth={1.5} /></div>
          <div className="space-y-1"><h3 className="font-black text-sm uppercase tracking-wider text-zinc-400">Suport Tehnic Site</h3><p className="font-black text-base text-zinc-900">Cristina Ionescu</p><p className="font-black text-lg text-[#DA3C2D] tracking-tight">0733 987 654</p><p className="text-xs text-zinc-400 font-medium">Pentru probleme legate<br />de site și cont</p></div>
        </div>
        {/* Email */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#DA3C2D]/10 text-[#DA3C2D] flex items-center justify-center"><Mail size={26} strokeWidth={1.5} /></div>
          <div className="space-y-1"><h3 className="font-black text-sm uppercase tracking-wider text-zinc-400">Email</h3><p className="font-black text-sm text-[#DA3C2D] break-all">contact@gtgarage.ro</p><p className="text-xs text-zinc-500 font-medium pt-4">Răspundem în cel<br />mai scurt timp</p></div>
        </div>
      </div>

      {/* 3. SECȚIUNEA FORMULAR + HARTĂ */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stânga: Formular */}
        <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Trimite-ne un mesaj</h2>
            <p className="text-sm text-zinc-500 font-medium">Completează formularul și îți vom răspunde cât mai curând posibil.</p>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Nume complet" className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-300 font-medium" />
              <input type="email" placeholder="Email" className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-300 font-medium" />
            </div>
            <input type="text" placeholder="Telefon" className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-300 font-medium" />
            <input type="text" placeholder="Subiect" className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-300 font-medium" />
            <textarea placeholder="Mesaj" rows={4} className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-300 font-medium resize-none"></textarea>
            <button type="submit" className="w-full sm:w-auto bg-[#DA3C2D] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-red-600/10">
              <Send size={14} /> Trimite mesaj
            </button>
          </form>
        </div>

        {/* Dreapta: Hartă Mockup + Casetă Neagră */}
        <div className="lg:col-span-6 space-y-6">
          {/* Hartă simulat vizual */}
          <div className="w-full aspect-[16/9] bg-zinc-200 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-100" />
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-zinc-200/50 shadow-md">
              <MapPin size={24} className="text-[#DA3C2D] animate-bounce" />
              <span className="text-xs font-black uppercase tracking-wider text-zinc-800">GT Garage – Service Auto</span>
              <span className="text-[10px] text-zinc-500 font-medium">Sibiu, România</span>
            </div>
          </div>
          {/* Caseta Neagră: Unde ne găsești? */}
          <div className="bg-[#0D0F12] rounded-2xl p-8 border border-zinc-800/40 text-white space-y-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">Unde ne găsești?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">Ne aflăm în Sibiu, într-o locație ușor accesibilă, gata să îți oferim servicii de calitate pentru mașina ta.</p>
            </div>
            {/* Grid Beneficii Mici */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/40">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-[#DA3C2D]"><ParkingCircle size={20} strokeWidth={1.5} /></div><div><span className="block text-xs font-black uppercase tracking-wide">Parcare</span><span className="block text-[10px] text-zinc-500 font-medium">gratuită</span></div></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-[#DA3C2D]"><Clock size={20} strokeWidth={1.5} /></div><div><span className="block text-xs font-black uppercase tracking-wide">Programări</span><span className="block text-[10px] text-zinc-500 font-medium">rapide</span></div></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-[#DA3C2D]"><ThumbsUp size={20} strokeWidth={1.5} /></div><div><span className="block text-xs font-black uppercase tracking-wide">Profesioniști</span><span className="block text-[10px] text-zinc-500 font-medium">dedicați</span></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BANNERUL JOS: AI ÎNTREBĂRI? */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-[#0D0F12] rounded-2xl p-8 md:p-10 border border-zinc-800/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#DA3C2D] shrink-0"><MessageSquareCode size={24} strokeWidth={1.5} /></div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Ai întrebări? <span className="text-[#DA3C2D] block sm:inline">Noi suntem aici să te ajutăm!</span></h2>
              <p className="text-zinc-400 text-xs font-medium max-w-md">Echipa GT Garage îți stă la dispoziție pentru orice informație sau programare. Nu ezita să ne contactezi!</p>
            </div>
          </div>
          <Link href="/sign-up" className="w-full md:w-auto relative z-10">
            <button className="w-full md:w-auto bg-[#DA3C2D] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 transition-all active:scale-95 whitespace-nowrap">
              <CalendarDays size={14} /> Programează-te acum
            </button>
          </Link>
          {/* Decor subtil de fundal roșiatic */}
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-red-600/5 rounded-full blur-[60px] pointer-events-none" />
        </div>
      </div>

      {/* 5. FOOTER */}
      <div className="max-w-4xl mx-auto text-center mt-12 text-zinc-400 text-[11px] font-medium space-y-0.5 border-t border-zinc-200/40 pt-8">
        <p className="font-bold text-zinc-500 uppercase tracking-wider text-[10px]">GT Garage – Service auto de încredere</p>
        <p className="text-zinc-400 font-medium">Grijă pentru mașina ta, siguranță pentru tine.</p>
      </div>

    </div>
  );
}
