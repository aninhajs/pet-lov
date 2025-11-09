// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../lib/api";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOk(false);
        setChecking(false);
        return;
      }
      try {
        const res = await api.get("/api/auth/me");
        const valid = Boolean(res?.data?.user);
        if (!valid) localStorage.removeItem("token");
        setOk(valid);
      } catch {
        localStorage.removeItem("token");
        setOk(false);
      } finally {
        setChecking(false);
      }
    };
    run();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Verificando sessão...
      </div>
    );
  }

  if (!ok) return <Navigate to="/login" replace />;

  return children ?? <Outlet />;
}
