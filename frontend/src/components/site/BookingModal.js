import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { Calendar } from "@/components/ui/calendar";

const INPUT_CLS = "w-full bg-carbon-800 border border-carbon-600 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-kinetic transition-colors duration-250";
const LABEL_CLS = "block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2";
const toLocalDateString = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
);
const formatServicePrice = (price) => {
  if (price === 0 || (typeof price === "string" && price.trim() !== "" && Number(price) === 0)) {
    return "Nespecificat";
  }
  if (price?.toString().toLowerCase().includes("discutabil") || price === "-") return price;
  return `${price} RON`;
};

export const BookingModal = ({ open, onClose, presetService }) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [booked, setBooked] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [unavailableDay, setUnavailableDay] = useState(false);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "", mileage: "", notes: "" });
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [confirmation, setConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/services")
        .then((r) => setServices(r.data))
        .catch(() => toast.error("Nu s-au putut încărca serviciile. Reîncearcă."));
      setStep(1);
      setService(presetService || null);
      setConfirmation(null);
      setDate("");
      setSlot("");
      setAvailableSlots([]);
      setBooked([]);
      setBlockedSlots([]);
      setUnavailableDay(false);
      setAvailabilityLoaded(false);
    }
  }, [open, presetService]);

  useEffect(() => {
    if (date) {
      setSlot("");
      setAvailabilityLoaded(false);
      setAvailableSlots([]);
      setBlockedSlots([]);
      setUnavailableDay(false);
      api.get("/bookings/availability", { params: { date } })
        .then((r) => {
          setAvailableSlots(r.data.slots);
          setBooked(r.data.booked_slots);
          setBlockedSlots(r.data.blocked_slots || []);
          setUnavailableDay(Boolean(r.data.unavailable));
          setAvailabilityLoaded(true);
        })
        .catch(() => {
          setBooked([]);
          setBlockedSlots([]);
          setUnavailableDay(false);
          toast.error("Nu s-a putut încărca disponibilitatea. Reîncearcă.");
        });
    } else {
      setAvailableSlots([]);
      setBooked([]);
      setBlockedSlots([]);
      setUnavailableDay(false);
      setAvailabilityLoaded(false);
    }
  }, [date]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/bookings", {
        service_id: service.id,
        service_name: service.name,
        date,
        time_slot: slot,
        vehicle_make: vehicle.make,
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        mileage: vehicle.mileage,
        notes: vehicle.notes,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
      setConfirmation(data);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
    setSubmitting(false);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="booking-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-carbon-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-carbon-900 border border-carbon-600"
          >
            <div className="sticky top-0 bg-carbon-900/95 backdrop-blur border-b border-carbon-600 px-6 md:px-8 py-5 flex items-center justify-between z-10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-kinetic">/// Programare</span>
                <h3 className="font-display font-bold uppercase tracking-wide text-xl text-slate-100 mt-1">
                  {confirmation ? "Loc rezervat" : `Pasul ${step} din 4`}
                </h3>
              </div>
              <button onClick={onClose} data-testid="booking-close-button" className="text-slate-500 hover:text-kinetic transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {confirmation ? (
                <div data-testid="booking-confirmation-modal" className="text-center py-8">
                  <CheckCircle2 size={56} className="mx-auto text-kinetic" />
                  <h4 className="mt-6 font-display font-bold uppercase text-2xl text-slate-100">Programarea ta este confirmată</h4>
                  <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    {confirmation.service_name} · {confirmation.date}, la ora {confirmation.time_slot}. Confirmarea a fost
                    înregistrată pentru {confirmation.email}.
                  </p>
                  <div className="mt-6 inline-block border border-kinetic bg-carbon-800 px-6 py-3 font-mono text-sm tracking-[0.2em] text-kinetic" data-testid="booking-reference">
                    {confirmation.reference}
                  </div>
                  <div className="mt-8">
                    <button onClick={onClose} data-testid="booking-done-button" className="bg-kinetic text-white font-display font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-red-500 transition-colors duration-250">
                      Gata
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {step === 1 && (
                    <div data-testid="booking-step-service-select" className="space-y-3">
                      <p className={LABEL_CLS}>Alege un serviciu</p>
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setService(s); setStep(2); }}
                          data-testid={`booking-service-option-${s.slug}`}
                          className="w-full text-left border border-carbon-600 bg-carbon-800 px-5 py-4 hover:border-kinetic transition-colors duration-250 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="font-display font-bold uppercase tracking-wide text-slate-100">{s.name}</div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{s.tagline}</div>
                          </div>
                          <div className="font-mono text-xs text-gold whitespace-nowrap">
                            {formatServicePrice(s.price_from)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && service && (
                    <div className="space-y-6">
                      <div className="border border-carbon-600 bg-carbon-800 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
                        {service.name} · {formatServicePrice(service.price_from)}
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Data preferată</label>
                        <Calendar
                          mode="single"
                          selected={date ? new Date(`${date}T00:00:00`) : undefined}
                          onSelect={(selectedDate) => setDate(selectedDate ? toLocalDateString(selectedDate) : "")}
                          disabled={[{ before: now }, { dayOfWeek: [0] }]}
                          data-testid="booking-step-date-picker"
                          className="w-fit rounded border border-carbon-600 bg-carbon-900 text-slate-100"
                          classNames={{
                            caption_label: "text-sm font-display uppercase tracking-wide text-slate-100",
                            head_cell: "text-slate-500 rounded-md w-9 font-mono text-[10px]",
                            day: "h-8 w-8 p-0 font-normal text-slate-300 hover:bg-carbon-800",
                            day_selected: "bg-kinetic text-white hover:bg-kinetic focus:bg-kinetic",
                            day_today: "bg-carbon-800 text-kinetic",
                            day_disabled: "text-slate-600 opacity-40",
                          }}
                        />
                        {date && <p className="mt-2 font-mono text-xs text-slate-400">Data selectată: {date}</p>}
                      </div>
                      {date && (
                        <div data-testid="booking-step-time-slot">
                          <label className={LABEL_CLS}>Interval orar</label>
                          {unavailableDay && (
                            <p className="mb-3 border border-red-400/40 bg-red-400/10 px-3 py-2 font-mono text-xs text-red-300" data-testid="booking-unavailable-day">
                              Atelierul este închis pentru programări în această zi.
                            </p>
                          )}
                          <div className="grid grid-cols-4 gap-2.5">
                            {availableSlots.map((t) => {
                              const isBooked = booked.includes(t) || blockedSlots.includes(t);
                              return (
                                <button
                                  key={t}
                                  disabled={isBooked || unavailableDay || !availabilityLoaded}
                                  onClick={() => setSlot(t)}
                                  data-testid={`booking-slot-${t.replace(":", "")}`}
                                  className={`py-3 font-mono text-sm border transition-colors duration-250 ${
                                    isBooked
                                      ? "border-carbon-600 text-slate-600 line-through cursor-not-allowed"
                                      : slot === t
                                      ? "border-kinetic bg-kinetic text-white"
                                      : "border-carbon-600 text-slate-300 hover:border-kinetic"
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!date || !slot || !availabilityLoaded} nextTestId="booking-step2-next" />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={LABEL_CLS}>Marcă</label>
                          <input required value={vehicle.make} onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} placeholder="ex. Volkswagen" data-testid="booking-input-make-model" className={INPUT_CLS} />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Model</label>
                          <input required value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} placeholder="ex. Golf" data-testid="booking-input-model" className={INPUT_CLS} />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Număr înmatriculare</label>
                          <input required value={vehicle.mileage} onChange={(e) => setVehicle({ ...vehicle, mileage: e.target.value })} placeholder="ex. SB 23 ABC" data-testid="booking-input-plate" className={INPUT_CLS} />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Anul fabricației</label>
                          <input value={vehicle.year} onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })} placeholder="ex. 2018 (Opțional)" data-testid="booking-input-year" className={INPUT_CLS} />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>Note / Detalii suplimentare</label>
                        <textarea rows={3} value={vehicle.notes} onChange={(e) => setVehicle({ ...vehicle, notes: e.target.value })} placeholder="ex. Mențiuni despre jante, antifurt, starea tapițeriei sau alte detalii importante..." data-testid="booking-input-notes" className={`${INPUT_CLS} resize-none`} />
                      </div>
                      <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} nextDisabled={!vehicle.make || !vehicle.model || !vehicle.mileage} nextTestId="booking-step3-next" />
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={LABEL_CLS}>Nume complet</label>
                          <input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Numele tău" data-testid="booking-input-name" className={INPUT_CLS} />
                        </div>
                        <div>
                          <label className={LABEL_CLS}>Telefon</label>
                          <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+40 …" data-testid="booking-input-phone" className={INPUT_CLS} />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL_CLS}>E-mail</label>
                        <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="email@exemplu.ro" data-testid="booking-input-email" className={INPUT_CLS} />
                      </div>
                      <div className="border border-carbon-600 bg-carbon-800 p-4 font-mono text-xs text-slate-400 space-y-1.5">
                        <div><span className="text-slate-500">SERVICIU:</span> {service.name} ({formatServicePrice(service.price_from)})</div>
                        <div><span className="text-slate-500">PROGRAMARE:</span> {date} · {slot}</div>
                        <div><span className="text-slate-500">MAȘINĂ:</span> {vehicle.make} {vehicle.model} ({vehicle.year})</div>
                        <div><span className="text-slate-500">NR. INMATRICULARE:</span> {vehicle.mileage}</div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <button onClick={() => setStep(3)} data-testid="booking-step4-back" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-100 transition-colors">
                          <ArrowLeft size={14} /> Înapoi
                        </button>
                        <button
                          onClick={submit}
                          disabled={submitting || !contact.name || !contact.email || !contact.phone}
                          data-testid="booking-submit-button"
                          className="bg-kinetic text-white font-display font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-red-500 transition-colors duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Se rezervă…" : "Confirmă programarea"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StepNav = ({ onBack, onNext, nextDisabled, nextTestId }) => (
  <div className="flex items-center justify-between pt-2">
    <button onClick={onBack} data-testid={`${nextTestId}-back`} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-100 transition-colors">
      <ArrowLeft size={14} /> Înapoi
    </button>
    <button
      onClick={onNext}
      disabled={nextDisabled}
      data-testid={nextTestId}
      className="bg-kinetic text-white font-display font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-red-500 transition-colors duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continuă
    </button>
  </div>
);
