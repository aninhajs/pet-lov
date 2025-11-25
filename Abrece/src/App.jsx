// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Login from "./pages/Login";
import AdminDashboard from "./pages/(protegido)/AdminDashboard";
import AdminAdoptants from "./pages/(protegido)/AdminAdoptants";
import CadastrarPet from "./pages/(protegido)/CadastrarPet";
import GerenciarPets from "./pages/(protegido)/GerenciarPets";
import CartaoVacina from "./pages/(protegido)/CartaoVacina";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Administrativas (Protegidas) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/adoptants"
            element={
              <ProtectedRoute>
                <AdminAdoptants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cadastrar-pet"
            element={
              <ProtectedRoute>
                <CadastrarPet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gerenciar-pets"
            element={
              <ProtectedRoute>
                <GerenciarPets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cartao-vacina"
            element={
              <ProtectedRoute>
                <CartaoVacina />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
