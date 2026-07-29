"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Car, Wrench, Calendar, 
  FileText, History, User, LogOut 
} from 'lucide-react';

export default function ClientSidebar() {
  const pathname = usePathname();

  // Lista personalizată doar pentru Clienți, conform cerinței tale
  const menuItems = [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Masinile mele', href: '/client/my-cars', icon: Car },
    { name: 'Servicii', href: '/client/services', icon: Wrench },
    { name: 'Programarile mele', href: '/client/my-appointments', icon: Calendar },
    { name: 'Facturile mele', href: '/client/my-invoices', icon: FileText },
    { name: 'Istoric', href: '/client/history', icon: History },
    { name: 'Profilul meu', href: '/client/profile', icon: User },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0B0E11] border-r border-zinc-800/40 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-8">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm tracking-wider border border-red-500 shadow-md shadow-red-600/20">
            GT
          </div>
          <div>
            <span className="font-black text-sm tracking-tight block text-white">GT GARAGE</span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 block -mt-1 font-medium">ZONĂ CLIENT</span>
          </div>
        </div>

        {/* NAVIGARE CLIENT */}
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

      {/* LOGOUT BTN - Te duce la pagina principală publică */}
      <Link href="/">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500/80 hover:bg-red-500/5 hover:text-red-500 transition-all duration-200">
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </Link>
    </aside>
  );
}
