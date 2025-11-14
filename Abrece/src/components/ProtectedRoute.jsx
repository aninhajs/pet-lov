// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("token");
      console.log(
        "🔐 ProtectedRoute - Verificando token:",
        token ? "Token presente" : "Token ausente"
      );

      if (!token) {
        console.log("❌ ProtectedRoute - Sem token, redirecionando para login");
        setOk(false);
        setChecking(false);
        return;
      }

      try {
        // Verifica se é um JWT (formato: xxx.yyy.zzz)
        const parts = token.split(".");
        if (parts.length === 3) {
          // É um JWT real do backend
          console.log("✅ ProtectedRoute - Token JWT válido detectado");

          // Decodifica o payload (parte central do JWT)
          // Remove caracteres especiais que podem causar erro no atob
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(
            decodeURIComponent(
              atob(base64)
                .split("")
                .map(
                  (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
            )
          );

          console.log("📋 ProtectedRoute - Payload do token:", payload);

          // Verifica se o token expirou (exp está em segundos)
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.log("⏰ ProtectedRoute - Token expirado");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setOk(false);
          } else {
            console.log("✅ ProtectedRoute - Token válido, acesso liberado");
            setOk(true);
          }
        } else {
          console.log("❌ ProtectedRoute - Formato de token inválido");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setOk(false);
        }
      } catch (error) {
        console.error("❌ ProtectedRoute - Erro ao validar token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setOk(false);
      } finally {
        setChecking(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
