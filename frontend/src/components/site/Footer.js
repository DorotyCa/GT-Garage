import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SITE_HOURS, SITE_PHONE, SITE_PHONE_DISPLAY } from "@/constants/siteInfo";
import { LogoMark } from "./LogoMark";

export const Footer = () => {
  const { user } = useAuth();
  const links = [
    ["Servicii", "#services", "footer-services-link"],
    ["Atelier", "#atelier", "footer-atelier-link"],
    ["Contact", "#contact", "footer-contact-link"],
  ];
  if (user?.role === "admin") links.push(["Administrare", "/admin", "footer-admin-link"]);

  return (
  <footer data-testid="site-footer" className="border-t border-carbon-600 bg-carbon-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <div className="flex items-center gap-3">
          <LogoMark size={30} />
          <span className="font-display font-extrabold text-lg uppercase tracking-wide">GT-Garage</span>
        </div>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
         Servicii profesionale de vulcanizare rapidă și detailing auto. Treabă făcută cu grijă pentru mașina ta.
        </p>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4">Navigare</div>
        <div className="space-y-2.5">
          {links.map(([label, href, id]) => (
            href.startsWith("/") ? (
              <Link key={id} to={href} data-testid={id} className="block text-sm text-slate-400 hover:text-kinetic transition-colors duration-250">{label}</Link>
            ) : (
              <a key={id} href={href} data-testid={id} className="block text-sm text-slate-400 hover:text-kinetic transition-colors duration-250">{label}</a>
            )
          ))}
        </div>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4">Atelier</div>
        <div className="text-sm text-slate-400 space-y-2.5">
          <p>Hamba, Sibiu</p>
          <p><a href={`tel:${SITE_PHONE}`} className="hover:text-kinetic transition-colors">{SITE_PHONE_DISPLAY}</a></p>
          <p>{SITE_HOURS}</p>
        </div>
      </div>
    </div>
    <div className="border-t border-carbon-600 py-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
      © 2016 GT-Garage Atelier auto /// Toată forța, rezervată
    </div>
  </footer>
  );
};
