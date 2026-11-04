import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BookingModal } from "@/components/site/BookingModal";

export default function Home({ onLogout }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preset, setPreset] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    const onAnchor = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (a) {
        const el = document.querySelector(a.getAttribute("href"));
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80 });
        }
      }
    };
    document.addEventListener("click", onAnchor);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.removeEventListener("click", onAnchor);
    };
  }, []);

  const openBooking = (service) => {
    setPreset(service || null);
    setBookingOpen(true);
  };

  return (
    <div data-testid="home-page" className="bg-carbon-950 min-h-screen text-slate-100">
      <Navbar onBook={openBooking} onLogout={onLogout} />
      <Hero onBook={openBooking} />
      <Marquee />
      <Services onBook={openBooking} />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} presetService={preset} />
    </div>
  );
}
