// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Questionnaire from "./pages/Questionnaire";
import Login from "./pages/Login";
import AdminDashboard from "./pages/(protegido)/AdminDashboard";
import AdminAdoptants from "./pages/(protegido)/AdminAdoptants";
import CadastrarPet from "./pages/(protegido)/CadastrarPet";
import GerenciarPets from "./pages/(protegido)/GerenciarPets";
import TestePage from "./pages/TestePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teste" element={<TestePage />} />

          {/* Grupo protegido */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/adoptants" element={<AdminAdoptants />} />
            <Route path="/admin/cadastrar-pet" element={<CadastrarPet />} />
            <Route path="/admin/gerenciar-pets" element={<GerenciarPets />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
