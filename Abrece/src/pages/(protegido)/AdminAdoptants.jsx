import React, { useState, useEffect } from "react";

// Mapeamento campo -> pergunta
const adoptionCandidateQuestions = [
  { field: "nome", label: "Nome Completo" },
  { field: "endereco", label: "Endereço (Rua e Bairro)" },
  { field: "CEP", label: "CEP" },
  { field: "cidade", label: "Cidade" },
  { field: "cpf", label: "CPF" },
  // ...existing code...
  { field: "local_dormir", label: "Onde o animalzinho irá dormir:" },
  // ...existing code...
  // (coloque o bloco de renderização dentro do return principal, substituindo a lista antiga de candidatos)
  {
    field: "tempo_preso",
    label:
      "O animal ficará amarrado/preso em algum lugar? Caso sim, por quais razões? Ele passaria quantas horas amarrado/preso?",
  },
  {
    field: "providencia_crescimento",
    label:
      "Caso o animal cresça mais que o esperado, qual serão as providências:",
  },
  {
    field: "responsavel_viagem",
    label: "Em caso de viagem, quem ficará com o animal?",
  },
  {
    field: "pretende_mudar_5_anos",
    label:
      "Pretende se mudar em um espaço de 5 anos? Caso sim, como ficará o animal?",
  },
  {
    field: "reacao_choro_latido",
    label:
      "O que fará se o animalzinho chorar/latir/uivar durante o dia e noite?",
  },
  {
    field: "vacinas_que_dara",
    label: "Quais vacinas irá dar ao animal adotado?",
  },
  {
    field: "marca_racao_adotado",
    label: "Qual a marca de ração pretende dar ao adotado?",
  },
  {
    field: "criterios_alimentacao",
    label: "Quais são os seus critérios ao escolher essa alimentação?",
  },
  {
    field: "filhotes_ou_castrar",
    label:
      "Pretende por o animalzinho para ter filhotes ou irá castrar? O que pensa a respeito?",
  },
  {
    field: "preparado_responsabilidade",
    label:
      "O seu adotado pode viver de 10 a 15 anos. Já pensou sobre essa responsabilidade e está preparado?",
  },
  {
    field: "disposto_adaptacao",
    label:
      "A adaptação do animal pode levar de 1 semana a 1 mês, tanto com o ambiente como com os outros moradores da casa (contando outros animais também). Está disposto a esperar esse tempo com paciência?",
  },
  {
    field: "clinica_veterinario",
    label:
      "Qual clínica e veterinário levará ou leva os seus animais? Por favor coloque nome do estabelecimento, endereço e nome do veterinário responsável.",
  },
  {
    field: "reacao_doenca",
    label:
      "O que faria se o animalzinho fosse diagnosticado com as devidas doenças (Calazar/Cinomose/Parvovirose/Erliquiose):",
  },
  {
    field: "conhece_doencas",
    label:
      "Conhece essas doenças citadas acima? Sabe as formas de precaução e tratamento?",
  },
  {
    field: "frequencia_remedio_verme",
    label:
      "Seus animais, tomam/tomavam/tomará o remédio de verme/carrapato/pulga com qual frequência?",
  },
  {
    field: "frequencia_veterinario",
    label:
      "Com qual frequência leva/levava/levará seus animais para o veterinário?",
  },
];
import { Link } from "react-router-dom";
import { AdoptantServices } from "../../services/AdoptantServices";
import { sections } from "../Questionnaire";
import { useMemo } from "react";

const AdminAdoptants = () => {
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [detalhesCandidato, setDetalhesCandidato] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);

  // Controle de seções abertas no modal de detalhes
  const [openSections, setOpenSections] = useState(() => {
    const map = {};
    (sections || []).forEach((s) => {
      map[s.id] = false;
    });
    return map;
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDisplayValue = (field, val) => {
    if (!val && val !== 0) return "-";
    if (field === "dt_nacimento" || field === "data_nascimento") {
      try {
        return val ? new Date(val).toLocaleDateString("pt-BR") : "-";
      } catch {
        return val;
      }
    }
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object" && val !== null) return JSON.stringify(val);
    return val;
  };

  const [historicoIndex, setHistoricoIndex] = useState(0);

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await AdoptantServices.getAllAdoptants({ limit: 100 });
        setCandidatos(res.data || []);
      } catch {
        setError("Erro ao buscar candidatos");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatos();
  }, []);

  // Ordenar interesses de todos os candidatos antes de filtrar/exibir
  function ordenarInteresses(interesses) {
    return [...(interesses || [])].sort((a, b) => {
      const dataA = a.data_interesse ? new Date(a.data_interesse).getTime() : 0;
      const dataB = b.data_interesse ? new Date(b.data_interesse).getTime() : 0;
      return dataB - dataA;
    });
  }

  const candidatosOrdenados = candidatos.map((c) => ({
    ...c,
    cidade: ordenarInteresses(c.cidade),
  }));

  const filteredCandidatos = candidatosOrdenados.filter((candidato) => {
    const interesses = candidato.cidade || [];
    const ultimaTentativa = interesses[0];

    if (selectedStatus === "todos") return true; // mostra todos cadastrados
    if (!ultimaTentativa) return false; // só mostra nos outros filtros quem já tentou adotar
    if (selectedStatus === "aprovado") {
      return ultimaTentativa.status === "aprovado";
    }
    if (selectedStatus === "rejeitado") {
      return ultimaTentativa.status === "rejeitado";
    }
    if (selectedStatus === "pendente") {
      return ultimaTentativa.status === "pendente";
    }
    return true;
  });

  // Atualizado para exigir pet_id
  const updateStatus = async (id, newStatus, observacoes = "", pet_id) => {
    if (!pet_id) {
      alert(
        "pet_id não encontrado. Não é possível aprovar/rejeitar sem o pet."
      );
      return;
    }
    try {
      await AdoptantServices.updateAdoptantStatus(
        id,
        newStatus,
        observacoes,
        pet_id
      );
      const res = await AdoptantServices.getAllAdoptants({ limit: 100 });
      setCandidatos(res.data || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Erro ao atualizar status do candidato";
      alert(errorMessage);
    }
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
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header */}
      <header
        className="shadow-lg border-b-2 border-yellow-300"
        style={{ backgroundColor: "#f4f0e4" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-2 sm:py-0 gap-2">
            <div className="flex items-center space-x-3 w-full sm:w-auto mb-2 sm:mb-0">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <h1
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent leading-tight break-words max-w-[120px] sm:max-w-none"
                  style={{ wordBreak: "break-word" }}
                >
                  Central de Gerenciamento
                </h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                to="/admin"
                class="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
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
              {
                candidatos.filter((c) => c.cidade?.[0]?.status === "pendente")
                  .length
              }
              )
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
              {
                candidatos.filter((c) => c.cidade?.[0]?.status === "aprovado")
                  .length
              }
              )
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
              {
                candidatos.filter((c) => c.cidade?.[0]?.status === "rejeitado")
                  .length
              }
              )
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
          {loading ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">Carregando candidatos...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCandidatos.map((candidato) => {
                const interesses = candidato.cidade || [];
                const ultimaTentativa = interesses[0];
                return (
                  <div
                    key={candidato.id || candidato.cpf}
                    className="px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {candidato.nome}
                          </h3>
                          {ultimaTentativa && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                ultimaTentativa.status
                              )}`}
                            >
                              {getStatusText(ultimaTentativa.status)}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-base text-gray-700">
                          <p>
                            {candidato.email} • Tel:{" "}
                            {candidato.telefone || candidato.celular_01}
                          </p>
                          {ultimaTentativa && (
                            <p>
                              Interesse em: {ultimaTentativa.pet?.nome || "-"} •
                              Data: {new Date().toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            setLoadingDetalhes(true);
                            setCandidatoSelecionado(candidato);
                            try {
                              if (candidato.cpf) {
                                const res =
                                  await AdoptantServices.getAdoptantById(
                                    candidato.cpf
                                  );
                                setDetalhesCandidato(res.data);
                              } else {
                                alert(
                                  "CPF do candidato não encontrado. Não é possível exibir detalhes."
                                );
                                setDetalhesCandidato(null);
                              }
                            } catch {
                              setDetalhesCandidato(null);
                            }
                            setLoadingDetalhes(false);
                          }}
                          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                        >
                          Ver Detalhes
                        </button>

                        {ultimaTentativa &&
                          ultimaTentativa.status === "aprovado" && (
                            <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-700">
                              ✓ Já aprovado - Adoção ativa
                            </div>
                          )}
                        {ultimaTentativa &&
                          ultimaTentativa.status === "rejeitado" && (
                            <div className="bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700">
                              ✗ Rejeitado anteriormente
                            </div>
                          )}
                        {ultimaTentativa &&
                          ultimaTentativa.status === "pendente" && (
                            <>
                              <button
                                onClick={async () => {
                                  if (
                                    candidato.cpf &&
                                    ultimaTentativa?.pet_id
                                  ) {
                                    const confirmar = window.confirm(
                                      `Tem certeza que deseja APROVAR o candidato "${
                                        candidato.nome
                                      }" para o pet "${
                                        ultimaTentativa.pet?.nome || "Pet"
                                      }"?\n\nEsta ação criará automaticamente uma adoção ativa e marcará o pet como adotado.`
                                    );

                                    if (confirmar) {
                                      await updateStatus(
                                        candidato.cpf,
                                        "aprovado",
                                        "",
                                        ultimaTentativa.pet_id
                                      );
                                    }
                                  } else {
                                    alert(
                                      "CPF ou pet_id não encontrado. Não é possível aprovar."
                                    );
                                  }
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => {
                                  if (candidato.cpf) {
                                    const confirmar = window.confirm(
                                      `Tem certeza que deseja REJEITAR o candidato "${
                                        candidato.nome
                                      }" para o pet "${
                                        ultimaTentativa.pet?.nome || "Pet"
                                      }"?`
                                    );

                                    if (confirmar) {
                                      const motivo = prompt(
                                        "Motivo da rejeição:",
                                        ""
                                      );
                                      if (motivo !== null) {
                                        // Usuario não cancelou o prompt
                                        updateStatus(
                                          candidato.cpf,
                                          "rejeitado",
                                          motivo,
                                          ultimaTentativa?.pet_id
                                        );
                                      }
                                    }
                                  } else {
                                    alert(
                                      "CPF do candidato não encontrado. Não é possível rejeitar."
                                    );
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow-md transition-all hover:scale-105"
                              >
                                Rejeitar
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !error && filteredCandidatos.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                Nenhum candidato encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>

        {/* Modal de detalhes */}
        {candidatoSelecionado && (
          <div>
            <div onClick={() => setCandidatoSelecionado(null)} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-sky-200 overflow-hidden">
                <div className="max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-yellow-50 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-sky-700">
                    Detalhes do Candidato
                  </h2>
                  <button
                    onClick={() => setCandidatoSelecionado(null)}
                    className="text-gray-400 hover:text-sky-600 text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="px-6 py-4 space-y-6">
                  {(() => {
                    if (detalhesCandidato) {
                      console.log(
                        "DEBUG - detalhesCandidato:",
                        detalhesCandidato
                      );
                    }
                    return null;
                  })()}
                  {loadingDetalhes ? (
                    <div className="text-center py-8 text-sky-700 font-semibold">
                      Carregando detalhes...
                    </div>
                  ) : detalhesCandidato ? (
                    <>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Informações Pessoais
                        </h3>
                        <div className="bg-gray-50 p-3 rounded grid grid-cols-1 gap-2 text-sm">
                          {(() => {
                            const adotanteSection = (sections || []).find(
                              (s) => s.id === "adotante"
                            );
                            if (!adotanteSection) {
                              return (
                                <div>
                                  <p>
                                    <strong>Nome:</strong> {detalhesCandidato.nome}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {detalhesCandidato.email}
                                  </p>
                                </div>
                              );
                            }

                            return adotanteSection.items.map((item) => {
                              const val = detalhesCandidato?.[item.field];
                              return (
                                  <div key={item.field} className="flex flex-col">
                                    <span className="text-base text-gray-800 font-semibold">{item.label}</span>
                                    <span className="text-base text-gray-900">{formatDisplayValue(item.field, val)}</span>
                                  </div>
                                );
                            });
                          })()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mt-4 mb-2">
                          Respostas do Formulário
                        </h3>
                        <div className="bg-gray-50 p-3 rounded grid grid-cols-1 gap-4 text-base">
                          {(sections || []).filter(s => s.id !== 'adotante').map((section) => (
                            <div key={section.id} className="border rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => toggleSection(section.id)}
                                className="w-full text-left px-4 py-3 bg-white flex items-center justify-between hover:bg-gray-50"
                              >
                                <span className="font-medium text-gray-800">{section.title}</span>
                                <span className="text-gray-500">{openSections[section.id] ? '−' : '+'}</span>
                              </button>
                              {openSections[section.id] && (
                                <div className="px-4 py-3 bg-gray-50">
                                  {section.items.map((item) => {
                                    const val = detalhesCandidato?.[item.field];
                                    return (
                                      <div key={item.field} className="mb-2" style={{ whiteSpace: 'pre-line' }}>
                                        <div className="text-base text-gray-800 font-semibold">{item.label}</div>
                                        <div className="text-base text-gray-900">{formatDisplayValue(item.field, val)}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Histórico de Rejeições */}
                      {detalhesCandidato.historico_rejeicoes &&
                        detalhesCandidato.historico_rejeicoes.length > 0 && (
                          <div>
                            <h3 className="font-medium text-red-700 mt-4 mb-2 flex items-center">
                              Histórico de Rejeições (
                              {detalhesCandidato.historico_rejeicoes.length})
                            </h3>
                            <div className="bg-red-50 border border-red-200 p-3 rounded max-h-[200px] overflow-y-auto">
                              {detalhesCandidato.historico_rejeicoes.map(
                                (rejeicao, idx) => (
                                  <div
                                    key={idx}
                                    className="mb-3 pb-2 border-b border-red-100 last:border-b-0"
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-red-800 text-sm">
                                        Pet:{" "}
                                        {rejeicao.pet?.nome || "Pet removido"}
                                      </p>
                                      <span className="text-xs text-red-600">
                                        {rejeicao.data_avaliacao &&
                                          new Date(
                                            rejeicao.data_avaliacao
                                          ).toLocaleDateString("pt-BR")}
                                      </span>
                                    </div>
                                    <p className="text-sm text-red-700 mt-1">
                                      <strong>Motivo:</strong>{" "}
                                      {rejeicao.observacoes_admin}
                                    </p>
                                  </div>
                                )
                              )}
                              <p className="text-xs text-red-600 italic mt-2">
                                Considere esses motivos ao avaliar nova
                                solicitação
                              </p>
                            </div>
                          </div>
                        )}

                      {detalhesCandidato.cidade &&
                        detalhesCandidato.cidade.length > 1 && (
                          <div>
                            <button
                              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium shadow-md transition-all"
                              onClick={() => setShowHistorico(true)}
                            >
                              Histórico de Tentativas de Adoção
                            </button>
                          </div>
                        )}
                      {/* Aprovação/Rejeição da última tentativa (forçado para teste) */}
                      {detalhesCandidato && (
                        <div className="flex space-x-3 pt-4">
                          <button
                            onClick={() => {
                              if (detalhesCandidato.cpf) {
                                const petNome =
                                  detalhesCandidato?.cidade?.[0]?.pet?.nome ||
                                  "Pet";
                                const confirmar = window.confirm(
                                  `Tem certeza que deseja APROVAR o candidato "${detalhesCandidato.nome}" para o pet "${petNome}"?\n\nEsta ação criará automaticamente uma adoção ativa e marcará o pet como adotado.`
                                );

                                if (confirmar) {
                                  // Busca o pet_id da última tentativa do candidato nos detalhes
                                  const petIdAprovar =
                                    detalhesCandidato?.cidade?.[0]?.pet_id;
                                  updateStatus(
                                    detalhesCandidato.cpf,
                                    "aprovado",
                                    "",
                                    petIdAprovar
                                  );
                                  setCandidatoSelecionado(null);
                                  setDetalhesCandidato(null);
                                }
                              } else {
                                alert(
                                  "CPF do candidato não encontrado. Não é possível aprovar."
                                );
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                          >
                            Aprovar Candidato
                          </button>
                          <button
                            onClick={() => {
                              if (detalhesCandidato.cpf) {
                                const petNome =
                                  detalhesCandidato?.cidade?.[0]?.pet?.nome ||
                                  "Pet";
                                const confirmar = window.confirm(
                                  `Tem certeza que deseja REJEITAR o candidato "${detalhesCandidato.nome}" para o pet "${petNome}"?`
                                );

                                if (confirmar) {
                                  const motivo = prompt(
                                    "Motivo da rejeição:",
                                    ""
                                  );
                                  if (motivo !== null) {
                                    // Usuario não cancelou o prompt
                                    const petIdRejeitar =
                                      detalhesCandidato?.cidade?.[0]?.pet_id;
                                    updateStatus(
                                      detalhesCandidato.cpf,
                                      "rejeitado",
                                      motivo,
                                      petIdRejeitar
                                    );
                                    setCandidatoSelecionado(null);
                                    setDetalhesCandidato(null);
                                  }
                                }
                              } else {
                                alert(
                                  "CPF do candidato não encontrado. Não é possível rejeitar."
                                );
                              }
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                          >
                            Rejeitar Candidato
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-red-700 font-semibold">
                      Não foi possível carregar os detalhes do candidato.
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
            {/* Modal flutuante do histórico */}
            {showHistorico && candidatoSelecionado && (
              <div
                style={{ zIndex: 9999 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
              >
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border-2 border-sky-200 animate-fade-in">
                  <button
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg"
                    onClick={() => setShowHistorico(false)}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold text-sky-700 mb-4 text-center">
                    Histórico de Tentativas de Adoção
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() =>
                        setHistoricoIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={historicoIndex === 0}
                      className={`text-2xl px-2 ${
                        historicoIndex === 0
                          ? "text-gray-300"
                          : "text-sky-700 hover:text-sky-900"
                      }`}
                      aria-label="Anterior"
                    >
                      &#8592;
                    </button>
                    <span className="text-base text-gray-700">
                      {historicoIndex + 1} de{" "}
                      {Array.isArray(candidatoSelecionado.cidade)
                        ? candidatoSelecionado.cidade.length
                        : 0}
                    </span>
                    <button
                      onClick={() =>
                        setHistoricoIndex((prev) =>
                          Math.min(
                            prev + 1,
                            (Array.isArray(candidatoSelecionado.cidade)
                              ? candidatoSelecionado.cidade.length
                              : 1) - 1
                          )
                        )
                      }
                      disabled={
                        historicoIndex ===
                        (Array.isArray(candidatoSelecionado.cidade)
                          ? candidatoSelecionado.cidade.length
                          : 1) -
                          1
                      }
                      className={`text-2xl px-2 ${
                        historicoIndex ===
                        (Array.isArray(candidatoSelecionado.cidade)
                          ? candidatoSelecionado.cidade.length
                          : 1) -
                          1
                          ? "text-gray-300"
                          : "text-sky-700 hover:text-sky-900"
                      }`}
                      aria-label="Próximo"
                    >
                      &#8594;
                    </button>
                  </div>
                  {Array.isArray(candidatoSelecionado.cidade) &&
                    candidatoSelecionado.cidade.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded border border-sky-100">
                        {(() => {
                          const interesse =
                            candidatoSelecionado.cidade[historicoIndex];
                          return (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    interesse.status
                                  )}`}
                                >
                                  {getStatusText(interesse.status)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {interesse.data_interesse
                                    ? new Date(
                                        interesse.data_interesse
                                      ).toLocaleDateString("pt-BR")
                                    : "-"}
                                </span>
                              </div>
                              <p>
                                <strong>Pet:</strong>{" "}
                                {interesse.pet?.nome || "-"}
                              </p>
                              <p>
                                <strong>Tipo de Moradia:</strong>{" "}
                                {candidatoSelecionado.tipo_moradia ||
                                  candidatoSelecionado.mora_em ||
                                  "-"}
                              </p>
                              <p>
                                <strong>Experiência:</strong>{" "}
                                {candidatoSelecionado.experiencia_pets ||
                                  candidatoSelecionado.ja_teve_tem_animais ||
                                  "-"}
                              </p>
                              <p>
                                <strong>Motivação:</strong>{" "}
                                {candidatoSelecionado.motivacao ||
                                  candidatoSelecionado.finalidade_animal ||
                                  "-"}
                              </p>
                              {interesse.status === "rejeitado" &&
                                interesse.observacoes_admin && (
                                  <p className="text-red-700 mt-1">
                                    <strong>Motivo da Rejeição:</strong>{" "}
                                    {interesse.observacoes_admin}
                                  </p>
                                )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {/* Fim do main */}
    </div>
  );
};

export default AdminAdoptants;
