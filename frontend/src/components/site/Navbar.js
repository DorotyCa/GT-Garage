import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { label: "Servicii", href: "#services", id: "nav-services-link" },
  { label: "Atelier", href: "#atelier", id: "nav-atelier-link" },
  { label: "Contact", href: "#contact", id: "nav-contact-link" },
];

export const Navbar = ({ onBook, onLogout }) => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-carbon-950/85 backdrop-blur-md border-b border-carbon-600" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#top" data-testid="nav-home-link" className="flex items-center gap-3 group">
          <LogoMark size={34} />
          <div className="leading-none">
            <span className="font-display font-extrabold text-xl tracking-wide uppercase">Auto Service</span>
            <span className="block font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase mt-0.5">Îngrijim mașina ta</span>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              data-testid={l.id}
              className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-kinetic transition-colors duration-250"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user?.role !== "admin" && (
            <button
              type="button"
              onClick={onLogout}
              data-testid="nav-logout-button"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-100 border border-carbon-600 hover:border-slate-400 px-4 py-2.5 transition-colors duration-250"
            >
              <LogOut size={14} /> Deconectare
            </button>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              data-testid="nav-admin-login-button"
              className="hidden sm:inline-flex font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-100 border border-carbon-600 hover:border-slate-400 px-4 py-2.5 transition-colors duration-250"
            >
              Administrare
            </Link>
          )}
          {user?.role === "admin" ? (
            <button
              type="button"
              onClick={onLogout}
              data-testid="nav-admin-logout-button"
              className="inline-flex items-center gap-2 bg-kinetic text-white font-display font-bold uppercase tracking-wider text-sm px-5 py-2.5 hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-250"
            >
              <LogOut size={14} /> Deconectare
            </button>
          ) : (
            <button
              onClick={() => onBook(null)}
              data-testid="nav-booking-link"
              className="bg-kinetic text-white font-display font-bold uppercase tracking-wider text-sm px-5 py-2.5 hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-250"
            >
              Programează-te
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
