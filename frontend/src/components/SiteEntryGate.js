import { cloneElement, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiError } from "@/lib/api";
import { LogoMark } from "@/components/site/LogoMark";
import { toast } from "sonner";

const INPUT_CLS = "w-full bg-carbon-800 border border-carbon-600 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-kinetic transition-colors";

export default function SiteEntryGate({ children }) {
  const { user, login, logout } = useAuth();
  const [entered, setEntered] = useState(() => Boolean(sessionStorage.getItem("site-entry-email")));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const leaveSite = async () => {
    if (user?.role === "admin") {
      try {
        await logout();
      } catch {
        toast.error("Nu s-a putut confirma deconectarea. Verifică conexiunea și încearcă din nou.");
        return;
      }
    }
    sessionStorage.removeItem("site-entry-email");
    setEmail("");
    setPassword("");
    setRequiresPassword(false);
    setError("");
    setEntered(false);
  };

  useEffect(() => {
    if (user?.role === "admin") setEntered(true);
  }, [user]);

  const submitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/site-entry", { email });
      if (data.requires_password) {
        setRequiresPassword(true);
      } else {
        sessionStorage.setItem("site-entry-email", email.trim().toLowerCase());
        setEntered(true);
      }
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const submitAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const admin = await login(email, password);
      if (admin.role !== "admin") {
        setError("E-mailul sau parola sunt incorecte.");
        return;
      }
      sessionStorage.setItem("site-entry-email", email.trim().toLowerCase());
      setEntered(true);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  if (user === null) {
    return (
      <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 animate-pulse">Se încarcă…</div>
      </div>
    );
  }

  return (
    <>
      {cloneElement(children, { onLogout: leaveSite })}
      {!entered && user?.role !== "admin" && (
        <main data-testid="site-entry-gate" className="fixed inset-0 z-50 bg-carbon-950/60 backdrop-blur-sm text-slate-100 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <LogoMark size={38} />
              <div>
                <div className="font-display font-extrabold text-xl uppercase tracking-wide">GT-Garage</div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase">Service auto</div>
              </div>
            </div>
            <form
              onSubmit={requiresPassword ? submitAdmin : submitEmail}
              className="border border-carbon-600/80 bg-carbon-900/90 backdrop-blur-md p-8 space-y-5"
            >
              <div>
                <label htmlFor="site-entry-email" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">
                  Adresa de e-mail
                </label>
                <input
                  id="site-entry-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={requiresPassword}
                  data-testid="site-entry-email"
                  className={INPUT_CLS}
                />
              </div>
              {requiresPassword && (
                <div>
                  <label htmlFor="site-entry-password" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">
                    Parola atelierului
                  </label>
                  <input
                    id="site-entry-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="site-entry-password"
                    className={INPUT_CLS}
                  />
                </div>
              )}
              {error && <div role="alert" className="border border-kinetic/40 bg-kinetic/10 text-red-400 text-sm px-4 py-3">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                data-testid="site-entry-submit"
                className="w-full bg-kinetic text-white font-display font-bold uppercase tracking-wider py-4 hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Se verifică…" : requiresPassword ? "Intră în atelier" : "Continuă"}
              </button>
              {requiresPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setRequiresPassword(false);
                    setPassword("");
                    setError("");
                  }}
                  className="w-full font-mono text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-slate-100"
                >
                  Folosește alt e-mail
                </button>
              )}
            </form>
          </div>
        </main>
      )}
    </>
  );
}
