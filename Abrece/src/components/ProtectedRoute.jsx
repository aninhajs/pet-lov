// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      // Simula delay de verificação
      await new Promise((resolve) => setTimeout(resolve, 300));

      const token = localStorage.getItem("token");

      if (!token) {
        setOk(false);
        setChecking(false);
        return;
      }

      try {
        // Decodifica o token mockado
        const decoded = JSON.parse(atob(token));

        // Verifica se o token expirou
        if (decoded.exp && decoded.exp < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setOk(false);
        } else {
          setOk(true);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setOk(false);
      } finally {
        setChecking(false);
      }
    };
    run();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (!ok) return <Navigate to="/login" replace />;

  return children ?? <Outlet />;
}
