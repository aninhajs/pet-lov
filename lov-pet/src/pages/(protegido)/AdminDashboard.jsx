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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Pet Lov Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Pet Lov Admin
              </h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/"
                className="text-sky-700 hover:text-sky-800 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-yellow-300"
              >
                Site Principal
              </Link>
              <Link
                to="/admin/adoptants"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg border-2 border-yellow-300"
              >
                Ver Candidatos
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg border-2 border-red-300"
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
          <div className="bg-white hover:bg-gradient-to-br hover:from-sky-50 hover:to-yellow-50 rounded-lg shadow-lg hover:shadow-xl p-6 transition-all duration-300 border-l-4 border-sky-400">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🐕</div>
              <div>
                <p className="text-sm font-medium text-sky-600">
                  Total de Pets
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
                  {stats.totalPets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-sky-50 rounded-lg shadow-lg hover:shadow-xl p-6 transition-all duration-300 border-l-4 border-yellow-400">
            <div className="flex items-center">
              <div className="text-2xl mr-3">❤️</div>
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Pets Adotados
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {stats.petsAdotados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white hover:bg-gradient-to-br hover:from-sky-50 hover:to-yellow-50 rounded-lg shadow-lg hover:shadow-xl p-6 transition-all duration-300 border-l-4 border-sky-500">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <p className="text-sm font-medium text-sky-600">Candidatos</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                  {stats.candidatos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 rounded-lg shadow-lg hover:shadow-xl p-6 transition-all duration-300 border-l-4 border-orange-400">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⏳</div>
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Pendências
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
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
                    <div className="w-2 h-2 bg-gradient-to-r from-sky-500 to-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.acao}</span>
                        {activity.pet && (
                          <>
                            {" - "}
                            <span className="bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent font-medium">
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
                  className="flex items-center p-4 bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-yellow-100 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-sky-200 hover:border-yellow-300"
                >
                  <div className="text-2xl mr-4">📋</div>
                  <div>
                    <p className="font-medium text-sky-800">
                      Gerenciar Candidatos
                    </p>
                    <p className="text-sm text-sky-600">
                      Ver e aprovar formulários de adoção
                    </p>
                  </div>
                </Link>
                <Link
                  to="/admin/gerenciar-pets"
                  className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-sky-100 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-yellow-200 hover:border-sky-300"
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
