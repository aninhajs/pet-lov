import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  // Debug: log do status de autenticação
  console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("Usuário não logado, redirecionando para /login");
    return <Navigate to="/login" replace />;
  }

  console.log("Usuário autenticado, renderizando componente");
  return children;
};

export default ProtectedRoute;
