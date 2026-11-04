import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { SITE_HOURS, SITE_PHONE, SITE_PHONE_DISPLAY } from "@/constants/siteInfo";

const INFO = [
  { icon: MapPin, label: "Atelier", value: "Hamba, Sibiu" },
  { icon: Phone, label: "Telefon", value: SITE_PHONE_DISPLAY, href: `tel:${SITE_PHONE}` },
  { icon: Mail, label: "E-mail", value: "office.gtsibiu@gmail.com", href: "mailto:office.gtsibiu@gmail.com" },
  { icon: Clock, label: "Program", value: SITE_HOURS },
];

const INPUT_CLS = "w-full bg-carbon-800 border border-carbon-600 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-kinetic transition-colors duration-250";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enquiries", form);
      toast.success("Am primit mesajul. Îți vom răspunde în următoarea zi lucrătoare.");
      setForm({ name: "", email: "", phone: "", vehicle: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
    setSending(false);
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-kinetic font-semibold">/// Contact</span>
          <h2 className="mt-4 font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-100">
            Discută cu echipa atelierului
          </h2>
          <p className="mt-6 text-sm sm:text-base text-slate-400 leading-relaxed">
            Ai întrebări despre o modificare, un zgomot neobișnuit sau o ofertă? Scrie-ne — un
            tehnician expert citește fiecare mesaj.
          </p>
          <div className="mt-10 space-y-5">
            {INFO.map((i) => (
              <div key={i.label} className="flex items-center gap-4">
                <div className="w-10 h-10 border border-carbon-600 bg-carbon-800 flex items-center justify-center text-kinetic shrink-0">
                  <i.icon size={18} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{i.label}</div>
                  {i.href ? (
                    <a href={i.href} className="text-sm text-slate-200 mt-0.5 hover:text-kinetic transition-colors">
                      {i.value}
                    </a>
                  ) : (
                    <div className="text-sm text-slate-200 mt-0.5">{i.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          data-testid="contact-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-3 border border-carbon-600 bg-carbon-900 p-6 md:p-10 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input required data-testid="contact-form-name-input" value={form.name} onChange={set("name")} placeholder="Numele tău" className={INPUT_CLS} />
            <input required type="email" data-testid="contact-form-email-input" value={form.email} onChange={set("email")} placeholder="Adresa de e-mail" className={INPUT_CLS} />
            <input data-testid="contact-form-phone-input" value={form.phone} onChange={set("phone")} placeholder="Telefon (opțional)" className={INPUT_CLS} />
            <input data-testid="contact-form-vehicle-input" value={form.vehicle} onChange={set("vehicle")} placeholder="Mașină (ex. BMW M4 2022)" className={INPUT_CLS} />
          </div>
          <textarea
            required
            rows={5}
            data-testid="contact-form-message-input"
            value={form.message}
            onChange={set("message")}
            placeholder="Spune-ne despre mașina ta și de ce are nevoie…"
            className={`${INPUT_CLS} resize-none`}
          />
          <button
            type="submit"
            disabled={sending}
            data-testid="contact-form-submit-button"
            className="w-full sm:w-auto bg-kinetic text-white font-display font-bold uppercase tracking-wider px-10 py-4 hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Se trimite…" : "Trimite mesajul"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
