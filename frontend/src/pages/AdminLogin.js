import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { LogoMark } from "@/components/site/LogoMark";

const INPUT_CLS = "w-full bg-carbon-800 border border-carbon-600 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-kinetic transition-colors duration-250";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    }
    setLoading(false);
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen bg-carbon-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <LogoMark size={36} />
          <div>
            <span className="font-display font-extrabold text-xl uppercase tracking-wide">GT-Garage</span>
            <span className="block font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase">Panou de administrare</span>
          </div>
        </div>
        <form onSubmit={submit} data-testid="admin-login-form" className="border border-carbon-600 bg-carbon-900 p-8 space-y-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="office.gtsibiu@gmail.com" data-testid="admin-login-username-input" className={INPUT_CLS} />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">Parolă</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" data-testid="admin-login-password-input" className={INPUT_CLS} />
          </div>
          {error && <div data-testid="admin-login-error" className="border border-kinetic/40 bg-kinetic/10 text-red-400 text-sm px-4 py-3">{error}</div>}
          <button type="submit" disabled={loading} data-testid="admin-login-submit-button" className="w-full bg-kinetic text-white font-display font-bold uppercase tracking-wider py-4 hover:bg-red-500 transition-colors duration-250 disabled:opacity-50">
            {loading ? "Se autentifică…" : "Intră în atelier"}
          </button>
        </form>
        <Link to="/" data-testid="admin-login-back-link" className="block mt-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-kinetic transition-colors">
          ← Înapoi la site
        </Link>
      </motion.div>
    </div>
  );
}
