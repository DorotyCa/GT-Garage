import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SiteEntryGate from "@/components/SiteEntryGate";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SiteEntryGate><Home /></SiteEntryGate>} />
            <Route path="/admin/login" element={<Navigate to="/" replace />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster theme="dark" position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
