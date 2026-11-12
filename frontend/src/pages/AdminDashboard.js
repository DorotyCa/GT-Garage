import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, CalendarClock, Inbox, Wrench, LayoutDashboard, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LogoMark } from "@/components/site/LogoMark";
import { Calendar } from "@/components/ui/calendar";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const toLocalDateString = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
);

const LoadError = ({ message }) => (
  <div role="alert" className="border border-red-400/40 bg-red-400/10 p-4 font-mono text-xs text-red-300">
    {message}
  </div>
);
const STATUS_LABELS = {
  pending: "în așteptare",
  confirmed: "confirmată",
  completed: "finalizată",
  cancelled: "anulată",
};
const STATUS_COLORS = {
  pending: "text-gold border-gold/40 bg-gold/10",
  confirmed: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  completed: "text-sky-400 border-sky-400/40 bg-sky-400/10",
  cancelled: "text-red-400 border-red-400/40 bg-red-400/10",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("bookings");
  const [stats, setStats] = useState(null);
  const [loadErrors, setLoadErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [availabilityBlocks, setAvailabilityBlocks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [services, setServices] = useState([]);

  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockFullDay, setBlockFullDay] = useState(true);
  const [blockSlots, setBlockSlots] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceTagline, setNewServiceTagline] = useState("");

  const loadData = useCallback((key, request, setData, errorMessage) => {
    request
      .then((r) => {
        setData(r.data);
        setLoadErrors((errors) => ({ ...errors, [key]: null }));
      })
      .catch(() => {
        setLoadErrors((errors) => ({ ...errors, [key]: errorMessage }));
        toast.error(errorMessage);
      });
  }, []);

  const loadAll = useCallback(() => {
    loadData("stats", api.get("/admin/stats"), setStats, "Nu s-au putut încărca statisticile.");
    loadData("bookings", api.get("/admin/bookings"), setBookings, "Nu s-au putut încărca programările.");
    loadData("availability", api.get("/admin/availability"), setAvailabilityBlocks, "Nu s-au putut încărca indisponibilitățile.");
    loadData("enquiries", api.get("/admin/enquiries"), setEnquiries, "Nu s-au putut încărca mesajele.");
    loadData("services", api.get("/admin/services"), setServices, "Nu s-au putut încărca serviciile.");
  }, [loadData]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateBooking = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { status });
      setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
      toast.success(`Programarea a fost marcată ca ${STATUS_LABELS[status]}`);
    } catch {
      toast.error("Nu s-a putut actualiza programarea.");
    }
  };

  const saveAvailabilityBlock = async (e) => {
    e.preventDefault();
    if (!blockDate) return toast.error("Selectează o dată.");
    if (!blockFullDay && blockSlots.length === 0) {
      return toast.error("Selectează cel puțin un interval orar.");
    }

    try {
      const { data } = await api.post("/admin/availability", {
        date: blockDate,
        full_day: blockFullDay,
        slots: blockFullDay ? [] : blockSlots,
      });
      setAvailabilityBlocks((blocks) => [
        ...blocks.filter((block) => block.date !== data.date),
        data,
      ].sort((a, b) => a.date.localeCompare(b.date)));
      setBlockDate("");
      setBlockSlots([]);
      setBlockFullDay(true);
      setShowAvailabilityForm(false);
      toast.success("Indisponibilitatea a fost salvată.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Nu s-a putut salva indisponibilitatea.");
    }
  };

  const deleteAvailabilityBlock = async (block) => {
    try {
      await api.delete(`/admin/availability/${block.id}`);
      setAvailabilityBlocks((blocks) => blocks.filter((item) => item.id !== block.id));
      toast.success("Indisponibilitatea a fost eliminată.");
    } catch {
      toast.error("Nu s-a putut elimina indisponibilitatea.");
    }
  };

  const editAvailabilityBlock = (block) => {
    setBlockDate(block.date);
    setBlockFullDay(block.full_day);
    setBlockSlots(block.slots || []);
    setShowAvailabilityForm(true);
  };

  const toggleRead = async (enq) => {
    try {
      await api.patch(`/admin/enquiries/${enq.id}`, { read: !enq.read });
      setEnquiries((e) => e.map((x) => (x.id === enq.id ? { ...x, read: !x.read } : x)));
    } catch {
      toast.error("Nu s-a putut actualiza mesajul.");
    }
  };

  const saveService = async (svc) => {
    try {
      await api.patch(`/admin/services/${svc.id}`, { 
        price_from: Number(svc.price_from), 
        duration_min: Number(svc.duration_min), 
        duration_unit: svc.duration_unit || "minutes",
        active: svc.active,
        name: svc.name,
        tagline: svc.tagline
      });
      toast.success(`Modificările pentru ${svc.name} au fost salvate.`);
    } catch {
      toast.error("Nu s-a putut actualiza serviciul.");
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newServiceName) return toast.error("Numele serviciului este obligatoriu.");
    try {
      const slug = newServiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await api.post("/admin/services", {
        name: newServiceName,
        tagline: newServiceTagline || "Serviciu profesional",
        price_from: 0,
        duration_min: 30,
        duration_unit: "minutes",
        active: true,
        slug: slug
      });
      setServices([...services, res.data]);
      setNewServiceName("");
      setNewServiceTagline("");
      setShowAddForm(false);
      toast.success("Serviciul a fost adăugat cu succes!");
      loadAll();
    } catch {
      toast.error("Nu s-a putut adăuga serviciul. Verifică backend-ul.");
    }
  };

  const deleteService = async (id, name) => {
    if (!confirm(`Sigur vrei să ștergi definitiv serviciul "${name}"?`)) return;
    try {
      await api.delete(`/admin/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
      toast.success("Serviciul a fost șters.");
      loadAll();
    } catch {
      toast.error("Nu s-a putut șterge serviciul.");
    }
  };

  const signOut = async () => {
    try {
      await logout();
      sessionStorage.removeItem("site-entry-email");
      navigate("/");
    } catch {
      toast.error("Nu s-a putut confirma deconectarea. Verifică conexiunea și încearcă din nou.");
    }
  };

  const TABS = [
    { id: "bookings", label: "Programări", icon: CalendarClock, testid: "admin-tab-bookings" },
    { id: "enquiries", label: "Mesaje", icon: Inbox, testid: "admin-tab-enquiries" },
    { id: "services", label: "Servicii", icon: Wrench, testid: "admin-tab-services" },
  ];

  // Separăm programările recente/importante de cele vechi/anulate (istoric)
  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed");
  const historyBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-carbon-950 text-slate-100">
      <header className="border-b border-carbon-600 bg-carbon-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={28} />
            <span className="font-display font-bold uppercase tracking-wide">Administrarea atelierului</span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 ml-2">/// {user?.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" data-testid="admin-view-site-link" className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-kinetic transition-colors">Vezi site-ul</Link>
            <button onClick={signOut} data-testid="admin-logout-button" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-kinetic transition-colors">
              <LogOut size={14} /> Deconectare
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loadErrors.stats ? (
          <LoadError message={loadErrors.stats} />
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10" data-testid="admin-stats">
            {[
              ["Programări în așteptare", stats.pending_bookings, "text-gold"],
              ["Total programări", stats.total_bookings, "text-slate-100"],
              ["Mesaje necitite", stats.unread_enquiries, "text-kinetic"],
              ["Servicii active", stats.active_services, "text-slate-100"],
            ].map(([label, value, color]) => (
              <div key={label} className="border border-carbon-600 bg-carbon-900 p-5">
                <div className={`font-display font-extrabold text-3xl ${color}`}>{value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b border-carbon-600">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={t.testid}
              className={`inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] border-b-2 -mb-px transition-colors duration-250 ${
                tab === t.id ? "border-kinetic text-slate-100" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="space-y-3" data-testid="admin-bookings-list">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowAvailabilityForm((visible) => !visible)}
                data-testid="admin-edit-availability-button"
                className="inline-flex items-center gap-2 bg-carbon-800 border border-carbon-600 font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 hover:border-kinetic hover:text-kinetic transition-colors"
              >
                <CalendarClock size={14} /> {showAvailabilityForm ? "Anulează" : "Modifică programări"}
              </button>
            </div>

            {showAvailabilityForm && (
              <form
                onSubmit={saveAvailabilityBlock}
                data-testid="admin-availability-form"
                className="border border-kinetic/40 bg-carbon-900 p-5 mb-4 space-y-5"
              >
                <div>
                  <label className="block font-mono text-xs text-slate-400">
                    Data indisponibilă
                    <Calendar
                      mode="single"
                      selected={blockDate ? new Date(`${blockDate}T00:00:00`) : undefined}
                      onSelect={(selectedDate) => setBlockDate(selectedDate ? toLocalDateString(selectedDate) : "")}
                      disabled={[{ before: now }, { dayOfWeek: [0] }]}
                      data-testid="admin-availability-date"
                      className="mt-2 w-fit rounded border border-carbon-600 bg-carbon-900 text-slate-100"
                      classNames={{
                        caption_label: "text-sm font-display uppercase tracking-wide text-slate-100",
                        head_cell: "text-slate-500 rounded-md w-9 font-mono text-[10px]",
                        day: "h-8 w-8 p-0 font-normal text-slate-300 hover:bg-carbon-800",
                        day_selected: "bg-kinetic text-white hover:bg-kinetic focus:bg-kinetic",
                        day_today: "bg-carbon-800 text-kinetic",
                        day_disabled: "text-slate-600 opacity-40",
                      }}
                    />
                    {blockDate && <span className="mt-2 block font-mono text-xs text-slate-400">Data selectată: {blockDate}</span>}
                  </label>
                </div>

                <label className="flex items-center gap-3 font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={blockFullDay}
                    onChange={(e) => {
                      setBlockFullDay(e.target.checked);
                      setBlockSlots([]);
                    }}
                    data-testid="admin-availability-full-day"
                    className="accent-red-500"
                  />
                  Blochează întreaga zi
                </label>

                {!blockFullDay && (
                  <fieldset>
                    <legend className="font-mono text-xs text-slate-400 mb-3">Selectează intervalele orare indisponibile</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <label key={slot} className="flex items-center gap-2 border border-carbon-600 bg-carbon-800 px-3 py-2 font-mono text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={blockSlots.includes(slot)}
                            onChange={(e) => setBlockSlots((slots) => (
                              e.target.checked ? [...slots, slot] : slots.filter((item) => item !== slot)
                            ))}
                            data-testid={`admin-availability-slot-${slot.replace(":", "")}`}
                            className="accent-red-500"
                          />
                          {slot}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                <button
                  type="submit"
                  data-testid="admin-availability-save"
                  className="bg-kinetic text-white font-display font-bold uppercase tracking-wider text-xs px-6 py-3 hover:bg-red-500 transition-colors"
                >
                  Salvează indisponibilitatea
                </button>
              </form>
            )}

            {loadErrors.availability ? <LoadError message={loadErrors.availability} /> : availabilityBlocks.length > 0 && (
              <section className="space-y-2" aria-label="Date și intervale indisponibile">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Indisponibilități salvate</h3>
                {availabilityBlocks.map((block) => (
                  <div key={block.id} data-testid={`admin-availability-row-${block.date}`} className="border border-carbon-600 bg-carbon-900 p-4 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-slate-100">{block.date}</span>
                    <span className="font-mono text-xs text-slate-400">
                      {block.full_day ? "Toată ziua" : block.slots.join(", ")}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editAvailabilityBlock(block)}
                        data-testid={`admin-availability-edit-${block.date}`}
                        className="border border-carbon-600 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:border-kinetic hover:text-kinetic transition-colors"
                      >
                        Editează
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAvailabilityBlock(block)}
                        data-testid={`admin-availability-delete-${block.date}`}
                        className="border border-carbon-600 p-2 text-slate-500 hover:text-red-400 hover:border-red-400/50 transition-colors"
                        aria-label={`Elimină indisponibilitatea pentru ${block.date}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {loadErrors.bookings ? <LoadError message={loadErrors.bookings} /> : bookings.length === 0 && <Empty label="Nu există încă programări" />}
            
                {/* 1. Secțiunea de Programări Active */}
                {activeBookings.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-kinetic font-bold">Programări Recente / Importante</div>
                    {activeBookings.map((b) => (
                      <div key={b.id} data-testid={`admin-booking-row-${b.reference}`} className="border border-carbon-600 bg-carbon-900 p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
                        <div className="font-mono text-xs text-kinetic tracking-[0.15em] w-24">{b.reference}</div>
                        <div className="min-w-[160px]">
                          <div className="font-display font-bold uppercase tracking-wide">{b.service_name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-0.5">{b.date} · {b.time_slot}</div>
                        </div>
                        <div className="min-w-[160px]">
                          <div className="text-sm text-slate-200">{b.name}</div>
                          <div className="font-mono text-[10px] text-slate-500 mt-0.5">{b.email} · {b.phone}</div>
                        </div>
                        <div className="text-sm text-slate-400 min-w-[140px]">
                          <div>{b.vehicle_make} {b.vehicle_model} ({b.vehicle_year})</div>
                          <div className="font-mono text-[10px] text-slate-500 mt-0.5">Nr. înmatriculare: {b.vehicle_plate}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                      <span data-testid="admin-booking-status-badge" className={`font-mono text-[10px] uppercase tracking-[0.2em] border px-3 py-1.5 ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status] || b.status}</span>
                      <select
                        value={b.status}
                        onChange={(e) => updateBooking(b.id, e.target.value)}
                        data-testid={`admin-booking-status-select-${b.reference}`}
                        className="bg-carbon-800 border border-carbon-600 text-xs font-mono px-3 py-2 focus:outline-none focus:border-kinetic"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "enquiries" && (
          <div className="space-y-3" data-testid="admin-enquiries-list">
            {loadErrors.enquiries ? <LoadError message={loadErrors.enquiries} /> : enquiries.length === 0 && <Empty label="Nu există încă mesaje" />}
            {enquiries.map((e) => (
              <div key={e.id} data-testid={`admin-enquiry-row-${e.id}`} className={`border p-5 ${e.read ? "border-carbon-600 bg-carbon-900 opacity-70" : "border-kinetic/50 bg-carbon-900"}`}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="font-display font-bold uppercase tracking-wide">{e.name}</div>
                  <div className="font-mono text-[10px] text-slate-500">{e.email}{e.phone ? ` · ${e.phone}` : ""}</div>
                  {e.vehicle && <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{e.vehicle}</div>}
                  <div className="ml-auto flex items-center gap-3">
                    <a href={`mailto:${e.email}`} data-testid="admin-enquiry-reply-button" className="font-mono text-[10px] uppercase tracking-[0.2em] border border-carbon-600 px-3 py-1.5 text-slate-300 hover:border-kinetic hover:text-kinetic transition-colors">Răspunde</a>
                    <button onClick={() => toggleRead(e)} data-testid={`admin-enquiry-read-toggle-${e.id}`} className="font-mono text-[10px] uppercase tracking-[0.2em] border border-carbon-600 px-3 py-1.5 text-slate-400 hover:text-slate-100 transition-colors">
                      {e.read ? "Marchează necitit" : "Marchează citit"}
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{e.message}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "services" && (
          <div className="space-y-3" data-testid="admin-services-list">
            {loadErrors.services && <LoadError message={loadErrors.services} />}

            {/* Secțiunea Buton Adăugare Serviciu Nou */}
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowAddForm(!showAddForm)} 
                className="inline-flex items-center gap-2 bg-carbon-800 border border-carbon-600 font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 hover:border-kinetic hover:text-kinetic transition-colors"
              >
                <Plus size={14} /> {showAddForm ? "Anulează" : "Adaugă Serviciu Nou"}
              </button>
            </div>

            {/* Formular dinamic pentru Serviciu Nou */}
            {showAddForm && (
              <form onSubmit={addService} className="border border-kinetic/40 bg-carbon-900 p-5 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <label className="block font-mono text-xs text-slate-400">
                  Nume Serviciu:
                  <input 
                    type="text" 
                    value={newServiceName} 
                    onChange={(e) => setNewServiceName(e.target.value)} 
                    placeholder="Ex: Schimb Ulei" 
                    className="w-full mt-1 bg-carbon-800 border border-carbon-600 px-3 py-2 text-slate-100 focus:outline-none focus:border-kinetic"
                  />
                </label>
                <label className="block font-mono text-xs text-slate-400">
                  Descriere Scurtă:
                  <input 
                    type="text" 
                    value={newServiceTagline} 
                    onChange={(e) => setNewServiceTagline(e.target.value)} 
                    placeholder="Ex: Include filtru și manoperă" 
                    className="w-full mt-1 bg-carbon-800 border border-carbon-600 px-3 py-2 text-slate-100 focus:outline-none focus:border-kinetic"
                  />
                </label>
                <button type="submit" className="bg-kinetic text-white font-display font-bold uppercase tracking-wider text-xs px-6 py-3 hover:bg-red-500 transition-colors">
                  Creează Serviciu
                </button>
              </form>
            )}

             {/* Lista de servicii cu opțiune de editare text inline și ștergere */}
              {services.map((s, i) => {
                const durationUnit = s.duration_unit || "minutes";
                const displayedDuration = durationUnit === "hours" ? s.duration_min / 60 : s.duration_min;
                
                return (
                  <div key={s.id} data-testid={`admin-service-row-${s.slug}`} className="border border-carbon-600 bg-carbon-900 p-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div className="min-w-[220px] flex-1">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => setServices((arr) => arr.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)))}
                        className="bg-transparent border-b border-transparent font-display font-bold uppercase tracking-wide w-full focus:outline-none focus:border-kinetic focus:bg-carbon-800 px-1"
                      />
                      <input
                        type="text"
                        value={s.tagline || ""}
                        onChange={(e) => setServices((arr) => arr.map((x) => (x.id === s.id ? { ...x, tagline: e.target.value } : x)))}
                        className="bg-transparent border-b border-transparent font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 w-full mt-1 focus:outline-none focus:border-kinetic focus:bg-carbon-800 px-1"
                      />
                    </div>

                    {/* 1. Moneda Schimbată în RON și Input tip TEXT (permite cifre, disc., -) */}
                    <label className="flex items-center gap-2 font-mono text-xs text-slate-400">
                      RON
                      <input
                        type="text"
                        value={s.price_from}
                        onChange={(e) => setServices((arr) => arr.map((x) => (x.id === s.id ? { ...x, price_from: e.target.value } : x)))}
                        data-testid={`admin-service-price-${s.slug}`}
                        placeholder="ex. 150 sau -"
                        className="w-32 bg-carbon-800 border border-carbon-600 px-3 py-2 focus:outline-none focus:border-kinetic text-slate-100"
                      />
                    </label>

                    {/* 2. Selectarea unității de timp (Ore sau Minute) + Input numeric */}
                    <div className="flex items-center bg-carbon-800 border border-carbon-600 px-2 py-1 gap-1">
                      <input
                        type="number"
                        min="0"
                        step={durationUnit === "hours" ? "any" : "1"}
                        value={displayedDuration}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const duration_min = Math.round(durationUnit === "hours" ? value * 60 : value);
                          setServices((arr) => arr.map((x) => (x.id === s.id ? { ...x, duration_min } : x)));
                        }}
                        data-testid={`admin-service-duration-${s.slug}`}
                        className="w-16 bg-transparent font-mono text-xs text-slate-100 px-1 py-1 focus:outline-none"
                      />
                      <select
                        value={durationUnit}
                        onChange={(e) => setServices((arr) => arr.map((x) => (
                          x.id === s.id ? { ...x, duration_unit: e.target.value } : x
                        )))}
                        className="bg-carbon-900 border-none text-[10px] font-mono text-slate-400 uppercase tracking-wider py-1 cursor-pointer focus:outline-none"
                      >
                        <option value="minutes">Min.</option>
                        <option value="hours">Ore</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setServices((arr) => arr.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))}
                      data-testid={`admin-service-active-${s.slug}`}
                      className={`font-mono text-[10px] uppercase tracking-[0.2em] border px-3 py-1.5 transition-colors ${s.active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400" : "border-red-400/40 bg-red-400/10 text-red-400"}`}
                    >
                      {s.active ? "Activ" : "Ascuns"}
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => saveService(s)} data-testid={`admin-service-save-${s.slug}`} className="bg-kinetic text-white font-display font-bold uppercase tracking-wider text-sm px-6 py-2.5 hover:bg-red-500 transition-colors duration-250">
                        Salvează
                      </button>
                      <button 
                        onClick={() => deleteService(s.id, s.name)} 
                        className="border border-carbon-600 p-2.5 text-slate-500 hover:text-red-400 hover:border-red-400/50 transition-colors"
                        title="Șterge Serviciu"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}

const Empty = ({ label }) => (
  <div className="border border-dashed border-carbon-600 p-12 text-center font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
    <LayoutDashboard size={20} className="mx-auto mb-3 text-slate-600" />
    {label}
  </div>
);
