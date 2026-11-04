import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (active) setUser(data);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await api.post("/auth/refresh");
            const { data } = await api.get("/auth/me");
            if (active) setUser(data);
            return;
          } catch {
            // An expired or missing refresh cookie means the user must log in again.
          }
        }
        if (active) setUser(false);
      }
    };
    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(false);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
