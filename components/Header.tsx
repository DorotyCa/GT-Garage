// app/components/header.tsx

"use client";

import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  userRole: "admin" | "client";
  userName: string;
  userEmail: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({ userRole, userName, userEmail, onMenuClick}: HeaderProps) {
  return (
    <header className="h-20 bg-[#0B0E11] border-b border-zinc-800/40 px-8 flex items-center justify-between z-40">
      
      {/* STÂNGA: Buton Meniu + Căutare */}
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Caută..." 
            className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors font-medium"
          />
        </div>
      </div>

      {/* DREAPTA: Notificări + Profil Utilizator ca în machetă */}
      <div className="flex items-center gap-6">
        {/* Clopoțel Notificări cu bulină roșie */}
        <button className="relative text-zinc-400 hover:text-white transition-colors p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DA3C2D] rounded-full border border-[#0B0E11]" />
        </button>

        {/* Profil Date */}
        <div className="flex items-center gap-3 border-l border-zinc-800/60 pl-6">
          <div className="text-right">
            <span className="block text-xs font-black text-white leading-tight">{userName}</span>
            <span className="block text-[10px] text-zinc-500 font-medium">{userEmail}</span>
          </div>
          {/* Avatarul cu inițiale */}
          <div className="w-10 h-10 rounded-full bg-[#DA3C2D]/10 border border-[#DA3C2D]/30 flex items-center justify-center font-bold text-xs text-[#DA3C2D] shadow-inner tracking-wider">
            {userRole === 'admin' ? 'AP' : 'CU'}
          </div>
        </div>
      </div>

    </header>
  );
}
