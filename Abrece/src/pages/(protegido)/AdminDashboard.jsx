import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPets: 0,
    petsAdotados: 0,
    candidatos: 12,
    processosPendentes: 5,
  });

  const [vacinas, setVacinas] = useState([]);
  const [todasVacinas, setTodasVacinas] = useState([]);
  const [buscaPet, setBuscaPet] = useState("");

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

    // Carregar vacinas do localStorage
    const vacinasStorage = JSON.parse(localStorage.getItem("vacinas") || "[]");
    // Ordenar por data mais recente
    const vacinasOrdenadas = vacinasStorage.sort((a, b) => {
      return (
        new Date(b.dataCadastro || b.dataVacina) -
        new Date(a.dataCadastro || a.dataVacina)
      );
    });
    setTodasVacinas(vacinasOrdenadas);
    setVacinas(vacinasOrdenadas.slice(0, 2)); // Mostrar apenas as 2 mais recentes
  }, []);

  // Filtrar vacinas por busca
  useEffect(() => {
    if (buscaPet.trim() === "") {
      setVacinas(todasVacinas.slice(0, 2));
    } else {
      const vacinasFiltradas = todasVacinas.filter((vacina) =>
        vacina.petNome.toLowerCase().includes(buscaPet.toLowerCase())
      );
      setVacinas(vacinasFiltradas.slice(0, 2));
    }
  }, [buscaPet, todasVacinas]);

  const handleLogout = () => {
    // remove só o que quebra a sessão
    localStorage.removeItem("token");
    // opcional: limpe outros dados de sessão se existir (ex.: user)
    // localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-sm border-b-2 border-sky-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-2xl font-bold text-sky-600">
                🐾 Central de Gerenciamento
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Site Principal
              </Link>
              <Link
                to="/admin/adoptants"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md"
              >
                Ver Candidatos
              </Link>
              <button
                onClick={handleLogout}
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
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🐕</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Total de Pets</p>
                <p className="text-4xl font-extrabold text-gray-900">
                  {stats.totalPets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3">❤️</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Pets Adotados</p>
                <p className="text-4xl font-extrabold text-green-700">
                  {stats.petsAdotados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3">👥</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Candidatos</p>
                <p className="text-4xl font-extrabold text-blue-700">
                  {stats.candidatos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3">⏳</div>
              <div>
                <p className="text-sm font-bold text-gray-800">Pendências</p>
                <p className="text-4xl font-extrabold text-orange-700">
                  {stats.processosPendentes}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cartão de Vacinas Recentes */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-lg">
            <div className="p-6 border-b-2 border-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-300">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                💉 Vacinas Recentes
              </h2>
              {/* Campo de Busca */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nome do pet..."
                  value={buscaPet}
                  onChange={(e) => setBuscaPet(e.target.value)}
                  className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                />
                {buscaPet && (
                  <button
                    onClick={() => setBuscaPet("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              {vacinas.length > 0 ? (
                <div className="space-y-4">
                  {vacinas.map((vacina) => (
                    <div
                      key={vacina.id}
                      className="border-l-4 border-green-600 pl-4 py-2 bg-white rounded-r-lg shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-base font-bold text-gray-900">
                            🐾 {vacina.petNome}
                          </p>
                          <p className="text-sm text-green-700 font-bold mt-1">
                            {vacina.nomeVacina}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-700 font-semibold">
                              📅 Aplicada em:{" "}
                              <span className="font-bold text-gray-900">
                                {new Date(vacina.dataVacina).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </p>
                            {vacina.dataRevacina && (
                              <p className="text-xs text-orange-700 font-semibold">
                                🔔 Revacinar em:{" "}
                                <span className="font-extrabold text-orange-800">
                                  {new Date(
                                    vacina.dataRevacina
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💉</div>
                  <p className="text-sm">
                    {buscaPet
                      ? `Nenhuma vacina encontrada para "${buscaPet}"`
                      : "Nenhuma vacina registrada ainda"}
                  </p>
                  {!buscaPet && (
                    <Link
                      to="/admin/cartao-vacina"
                      className="text-sky-600 hover:text-sky-700 text-sm font-medium mt-2 inline-block"
                    >
                      Cadastrar primeira vacina →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-lg">
            <div className="p-6 border-b-2 border-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-300">
              <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/admin/adoptants"
                  className="flex items-center p-4 bg-white hover:bg-green-50 rounded-lg transition-all transform hover:scale-105 shadow-md border-l-4 border-green-600"
                >
                  <div className="text-3xl mr-4">📋</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Gerenciar Candidatos
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      Ver e aprovar formulários de adoção
                    </p>
                  </div>
                </Link>
                <Link
                  to="/admin/gerenciar-pets"
                  className="flex items-center p-4 bg-white hover:bg-blue-50 rounded-lg transition-all transform hover:scale-105 shadow-md border-l-4 border-blue-600"
                >
                  <div className="text-3xl mr-4">🐾</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Gerenciar Pets
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      Ver, editar e controlar status dos pets
                    </p>
                  </div>
                </Link>
                <Link
                  to="/admin/cartao-vacina"
                  className="flex items-center p-4 bg-white hover:bg-purple-50 rounded-lg transition-all transform hover:scale-105 shadow-md border-l-4 border-purple-600"
                >
                  <div className="text-3xl mr-4">💉</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Cartão de Vacina
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      Registrar vacinas e histórico de saúde
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
