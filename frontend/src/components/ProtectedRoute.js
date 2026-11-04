import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div data-testid="admin-loading" className="min-h-screen bg-carbon-950 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 animate-pulse">Se autentifică…</div>
      </div>
    );
  }
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
