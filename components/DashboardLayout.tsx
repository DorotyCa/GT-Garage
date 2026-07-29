"use client";

import { useState } from "react";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    rol: string;
    nume: string | null;
    prenume: string | null;
    email: string;
  };
}

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#080A0C]">

      {sidebarOpen && <AdminSidebar />}

      <div className="flex flex-col flex-1 overflow-hidden">

        <Header
          userRole={user.rol === "client" ? "client" : "admin"}
          userName={`${user.nume ?? ""} ${user.prenume ?? ""}`}
          userEmail={user.email}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>
    </div>
  );
}