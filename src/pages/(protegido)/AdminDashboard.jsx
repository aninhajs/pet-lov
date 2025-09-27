import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    petsAdotados: 0,
    candidatos: 12,
    processosPendentes: 5,
  });

  // Carregar estatísticas reais do localStorage
  useEffect(() => {
    const pets = JSON.parse(localStorage.getItem("pets") || "[]");
    const totalPets = pets.length;
    const petsAdotados = pets.filter((pet) => pet.status === "adotado").length;

    setStats((prevStats) => ({
      ...prevStats,
      totalPets,
      petsAdotados,
    }));
  }, []);

  const [recentActivity] = useState([
    {
      id: 1,
      acao: "Nova candidatura de adoção",
      pet: "Luna",
      candidato: "Maria Silva",
      tempo: "2h atrás",
    },
    {
      id: 2,
      acao: "Pet adotado",
      pet: "Max",
      candidato: "João Santos",
      tempo: "5h atrás",
    },
    {
      id: 3,
      acao: "Novo pet cadastrado",
      pet: "Buddy",
      candidato: "-",
      tempo: "1 dia atrás",
    },
    {
      id: 4,
      acao: "Formulário aprovado",
      pet: "Mila",
      candidato: "Ana Costa",
      tempo: "2 dias atrás",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                🐾 Pet Lov Admin
              </h1>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Site Principal
              </Link>
              <Link
                to="/admin/adoptants"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Ver Candidatos
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie pets, adoções e candidatos
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="bg-white  hover:bg-indigo-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🐕</div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Pets
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalPets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white  hover:bg-indigo-100 rounded-lg shadow-sm p-6 ">
            <div className="flex items-center">
              <div className="text-2xl mr-3">❤️</div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pets Adotados
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.petsAdotados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white  hover:bg-indigo-100 rounded-lg shadow-sm p-6 ">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Candidatos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.candidatos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white  hover:bg-indigo-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⏳</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendências</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.processosPendentes}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Atividades Recentes */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Atividades Recentes
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.acao}</span>
                        {activity.pet && (
                          <>
                            {" - "}
                            <span className="text-indigo-600">
                              {activity.pet}
                            </span>
                          </>
                        )}
                        {activity.candidato && activity.candidato !== "-" && (
                          <>
                            {" por "}
                            <span className="font-medium">
                              {activity.candidato}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{activity.tempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Ações Rápidas
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/admin/adoptants"
                  className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mr-4">📋</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Gerenciar Candidatos
                    </p>
                    <p className="text-sm text-gray-600">
                      Ver e aprovar formulários de adoção
                    </p>
                  </div>
                </Link>
                <Link
                  to="/admin/gerenciar-pets"
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mr-4">🐾</div>
                  <div>
                    <p className="font-medium text-gray-900">Gerenciar Pets</p>
                    <p className="text-sm text-gray-600">
                      Ver, editar e controlar status dos pets
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
