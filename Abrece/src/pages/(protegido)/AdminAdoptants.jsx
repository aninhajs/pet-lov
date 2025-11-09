import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminAdoptants = () => {
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Dados mockados dos candidatos
  const [candidatos, setCandidatos] = useState([
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria.silva@email.com",
      telefone: "(11) 99999-9999",
      petPreferido: "Luna",
      status: "pendente",
      dataEnvio: "2024-09-20",
      tipoMoradia: "Casa com quintal",
      experiencia: "Já tive cães antes",
      motivacao: "Quero dar amor e carinho para um pet resgatado",
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao.santos@email.com",
      telefone: "(11) 88888-8888",
      petPreferido: "Milo",
      status: "aprovado",
      dataEnvio: "2024-09-18",
      tipoMoradia: "Apartamento",
      experiencia: "Primeira vez com pets",
      motivacao: "Sempre quis ter um gato de estimação",
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      telefone: "(11) 77777-7777",
      petPreferido: "Thor",
      status: "rejeitado",
      dataEnvio: "2024-09-15",
      tipoMoradia: "Casa sem quintal",
      experiencia: "Tive vários pets",
      motivacao: "Quero um cão grande para proteção",
    },
    {
      id: 4,
      nome: "Pedro Lima",
      email: "pedro.lima@email.com",
      telefone: "(11) 66666-6666",
      petPreferido: "Qualquer um",
      status: "pendente",
      dataEnvio: "2024-09-22",
      tipoMoradia: "Sítio/Chácara",
      experiencia: "Criador de animais há 10 anos",
      motivacao: "Tenho espaço e amor para oferecer",
    },
  ]);

  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);

  const filteredCandidatos =
    selectedStatus === "todos"
      ? candidatos
      : candidatos.filter((candidato) => candidato.status === selectedStatus);

  const updateStatus = (id, newStatus) => {
    setCandidatos(
      candidatos.map((candidato) =>
        candidato.id === id ? { ...candidato, status: newStatus } : candidato
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "aprovado":
        return "Aprovado";
      case "rejeitado":
        return "Rejeitado";
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg border-b-2 border-yellow-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Gerenciar Candidatos
              </h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/admin"
                className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🌐 Site Principal
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
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gerenciar Candidatos
          </h1>
          <p className="text-gray-600 mb-6">
            Analise e aprove formulários de adoção
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all hover:scale-105 ${
                selectedStatus === "todos"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "bg-white text-gray-700 hover:bg-sky-50"
              }`}
            >
              Todos ({candidatos.length})
            </button>
            <button
              onClick={() => setSelectedStatus("pendente")}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all hover:scale-105 ${
                selectedStatus === "pendente"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "bg-white text-gray-700 hover:bg-sky-50"
              }`}
            >
              Pendentes (
              {candidatos.filter((c) => c.status === "pendente").length})
            </button>
            <button
              onClick={() => setSelectedStatus("aprovado")}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all hover:scale-105 ${
                selectedStatus === "aprovado"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "bg-white text-gray-700 hover:bg-sky-50"
              }`}
            >
              Aprovados (
              {candidatos.filter((c) => c.status === "aprovado").length})
            </button>
            <button
              onClick={() => setSelectedStatus("rejeitado")}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all hover:scale-105 ${
                selectedStatus === "rejeitado"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "bg-white text-gray-700 hover:bg-sky-50"
              }`}
            >
              Rejeitados (
              {candidatos.filter((c) => c.status === "rejeitado").length})
            </button>
          </div>
        </div>

        {/* Lista de candidatos */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border-2 border-sky-200">
          <div className="px-6 py-4 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-yellow-50">
            <h2 className="text-lg font-semibold text-sky-700">
              Candidatos ({filteredCandidatos.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredCandidatos.map((candidato) => (
              <div key={candidato.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {candidato.nome}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          candidato.status
                        )}`}
                      >
                        {getStatusText(candidato.status)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      <p>
                        📧 {candidato.email} • 📞 {candidato.telefone}
                      </p>
                      <p>
                        🐾 Interesse em: {candidato.petPreferido} • 📅{" "}
                        {new Date(candidato.dataEnvio).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCandidatoSelecionado(candidato)}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                    >
                      Ver Detalhes
                    </button>

                    {candidato.status === "pendente" && (
                      <>
                        <button
                          onClick={() => updateStatus(candidato.id, "aprovado")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(candidato.id, "rejeitado")
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                        >
                          Rejeitar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCandidatos.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                Nenhum candidato encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalhes */}
      {candidatoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-sky-200">
            <div className="px-6 py-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-yellow-50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-sky-700">
                Detalhes do Candidato
              </h2>
              <button
                onClick={() => setCandidatoSelecionado(null)}
                className="text-gray-400 hover:text-sky-600 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Informações Pessoais
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p>
                    <strong>Nome:</strong> {candidatoSelecionado.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {candidatoSelecionado.email}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {candidatoSelecionado.telefone}
                  </p>
                  <p>
                    <strong>Data do Formulário:</strong>{" "}
                    {new Date(
                      candidatoSelecionado.dataEnvio
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Sobre a Moradia
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p>
                    <strong>Tipo de Moradia:</strong>{" "}
                    {candidatoSelecionado.tipoMoradia}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Experiência e Motivação
                </h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <p>
                    <strong>Pet Preferido:</strong>{" "}
                    {candidatoSelecionado.petPreferido}
                  </p>
                  <p>
                    <strong>Experiência:</strong>{" "}
                    {candidatoSelecionado.experiencia}
                  </p>
                  <p>
                    <strong>Motivação:</strong> {candidatoSelecionado.motivacao}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    candidatoSelecionado.status
                  )}`}
                >
                  {getStatusText(candidatoSelecionado.status)}
                </span>
              </div>

              {candidatoSelecionado.status === "pendente" && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      updateStatus(candidatoSelecionado.id, "aprovado");
                      setCandidatoSelecionado(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                  >
                    Aprovar Candidato
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(candidatoSelecionado.id, "rejeitado");
                      setCandidatoSelecionado(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                  >
                    Rejeitar Candidato
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptants;
