// app/components/AdminSidebar.tsx

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, Users, Car, Wrench, Calendar, 
  Layers, FileText, History, LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  // Definim lista de link-uri pentru Admin
  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Utilizatori', href: '/admin/users', icon: Users },
    { name: 'Masini', href: '/admin/cars', icon: Car },
    { name: 'Servicii', href: '/admin/services', icon: Wrench },
    { name: 'Programari', href: '/admin/appointments', icon: Calendar },
    { name: 'Piese', href: '/admin/parts', icon: Layers },
    { name: 'Facturi', href: '/admin/invoices', icon: FileText },
    { name: 'Istoric Service', href: '/admin/history', icon: History },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0B0E11] border-r border-zinc-800/40 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-8">
        {/* LOGO GT GARAGE */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm tracking-wider border border-red-500 shadow-md shadow-red-600/20">
            GT
          </div>
          <div>
            <span className="font-black text-sm tracking-tight block text-white">GT GARAGE</span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 block -mt-1 font-medium">SERVICE AUTO</span>
          </div>
        </div>

        {/* LISTA DE NAVIGARE */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isActive 
                    ? 'bg-[#DA3C2D] text-white shadow-md shadow-red-600/10' 
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                }`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                  {item.name}
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500/80 hover:bg-red-500/5 hover:text-red-500 transition-all duration-200">
          <LogOut size={18} strokeWidth={1.5} />
            Logout
        </button>
      </SignOutButton>
    </aside>
  );
}
