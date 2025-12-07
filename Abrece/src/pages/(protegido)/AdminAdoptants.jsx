import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { AdoptantServices } from "../../services/AdoptantServices";
import { sections } from "../Questionnaire";

const AdminAdoptants = () => {
  const [selectedStatus, setSelectedStatus] = useState("pendente");
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [detalhesCandidato, setDetalhesCandidato] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [approveContext, setApproveContext] = useState({ id: null, candidatoNome: "", petId: null, petName: "" });
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectContext, setRejectContext] = useState({ id: null, candidatoNome: "", petId: null, petName: "" });
  const [rejectReason, setRejectReason] = useState("");

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

  // Formatação específica para CPF, CEP e telefones
  const formatCPF = (raw) => {
    if (!raw) return "-";
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length !== 11) return raw;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatCEP = (raw) => {
    if (!raw) return "-";
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length !== 8) return raw;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const formatPhone = (raw) => {
    if (!raw) return "-";
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length === 11) {
      // (XX) 9XXXX-XXXX
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      // (XX) XXXX-XXXX
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return raw;
  };

  // Enhance formatDisplayValue to mask cpf/cep/phones when rendering details
  const originalFormatDisplayValue = formatDisplayValue;
  const formatDisplayValueMasked = (field, val) => {
    if (!val && val !== 0) return "-";
    const key = String(field || "").toLowerCase();
    if (key === "cpf") return formatCPF(val);
    if (key === "cep") return formatCEP(val);
    if (key === "celular_01" || key === "celular_02" || key === "telefone" || key === "telefone_01") return formatPhone(val);
    return originalFormatDisplayValue(field, val);
  };

  // replace usages in this component by binding the masked formatter name used below

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

  const normalizarStatusInteresse = (status) => {
    const statusNormalizado = (status || "").toLowerCase();
    if (!statusNormalizado) return "pendente";
    return statusNormalizado === "interessado"
      ? "pendente"
      : statusNormalizado;
  };

  const formatarInteresses = (interessesBrutos = []) =>
    ordenarInteresses(interessesBrutos).map((interesse) => ({
      ...interesse,
      status: normalizarStatusInteresse(interesse.status),
    }));

  const resolverStatusAtual = (candidato, interessesFormatados = []) => {
    const statusDoCandidato = (candidato?.status || "").toLowerCase();
    if (statusDoCandidato === "aprovado" || statusDoCandidato === "rejeitado") {
      return statusDoCandidato;
    }

    const statusDaUltimaTentativa = normalizarStatusInteresse(
      interessesFormatados?.[0]?.status
    );

    if (statusDaUltimaTentativa !== "pendente") {
      return statusDaUltimaTentativa;
    }

    if (statusDoCandidato) {
      return normalizarStatusInteresse(statusDoCandidato);
    }

    return "pendente";
  };

  const candidatosOrdenados = candidatos.map((c) => {
    const interessesOriginais = Array.isArray(c.interesses)
      ? c.interesses
      : Array.isArray(c.cidade)
      ? c.cidade
      : [];
    const interessesFormatados = formatarInteresses(interessesOriginais);

    return {
      ...c,
      interesses: interessesFormatados,
      statusAtual: resolverStatusAtual(c, interessesFormatados),
    };
  });

  const filteredCandidatos = candidatosOrdenados.filter((candidato) => {
    const interesses = candidato.interesses || [];
    const ultimaTentativa = interesses[0];
    const statusAtual =
      candidato.statusAtual ||
      normalizarStatusInteresse(ultimaTentativa?.status);

    if (selectedStatus === "todos") return true; // mostra todos cadastrados
    if (!ultimaTentativa && selectedStatus) return statusAtual === selectedStatus;
    if (selectedStatus === "aprovado") {
      return statusAtual === "aprovado";
    }
    if (selectedStatus === "rejeitado") {
      return statusAtual === "rejeitado";
    }
    if (selectedStatus === "pendente") {
      return statusAtual === "pendente";
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
      case "interessado":
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
      case "interessado":
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
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
              >
              🏠 Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
              >
               🚪 Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-sky-600 to-yellow-500 bg-clip-text text-transparent">
            Gerenciar Candidatos
            </span>
          </h1>
          <p className="text-gray-600 mb-6 text-xl">
            Analise e aprove formulários de adoção
          </p>
          <div className="flex flex-wrap gap-2">
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
                candidatosOrdenados.filter(
                  (c) => c.statusAtual === "pendente"
                ).length
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
                candidatosOrdenados.filter(
                  (c) => c.statusAtual === "aprovado"
                ).length
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
                candidatosOrdenados.filter(
                  (c) => c.statusAtual === "rejeitado"
                ).length
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
                const interesses = candidato.interesses || [];
                const ultimaTentativa = interesses[0];
                const statusAtual = candidato.statusAtual;
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
                          {statusAtual && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                statusAtual
                              )}`}
                            >
                              {getStatusText(statusAtual)}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-base text-gray-700">
                          <p>
                            {candidato.email} • Tel:{" "}
                            {formatDisplayValueMasked('telefone', candidato.telefone || candidato.celular_01)}
                          </p>
                          {ultimaTentativa && (
                            <p>
                              Interesse no pet: {ultimaTentativa.pet?.nome || "-"}
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
                                if (candidato.id) {
                                  const res = await AdoptantServices.getAdoptantById(candidato.id);
                                const candidatoDetalhado = res.data || {};
                                setDetalhesCandidato({
                                  ...candidatoDetalhado,
                                  interesses: formatarInteresses(
                                    Array.isArray(
                                      candidatoDetalhado.interesses
                                    )
                                      ? candidatoDetalhado.interesses
                                      : []
                                  ),
                                });
                                } else {
                                  alert("ID do candidato não encontrado. Não é possível exibir detalhes.");
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

                        {statusAtual === "aprovado" && (
                          <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-700">
                            Ja aprovado - Adocao ativa
                          </div>
                        )}
                        {statusAtual === "rejeitado" && (
                          <div className="bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700">
                            Rejeitado anteriormente
                          </div>
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
                                    <span className="text-base text-gray-900">{formatDisplayValueMasked(item.field, val)}</span>
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
                                        <div className="text-base text-gray-900">{formatDisplayValueMasked(item.field, val)}</div>
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

                      {detalhesCandidato && (
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
                              if (detalhesCandidato?.id) {
                                const interesse = detalhesCandidato?.interesses?.[0];
                                setApproveContext({
                                  id: detalhesCandidato.id,
                                  candidatoNome: detalhesCandidato.nome,
                                  petId: interesse?.pet_id,
                                  petName: interesse?.pet?.nome || "Pet",
                                });
                                setShowApproveConfirm(true);
                              } else {
                                alert("ID do candidato não encontrado. Não é possível aprovar.");
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                          >
                            Aprovar Candidato
                          </button>
                          <button
                            onClick={() => {
                              if (detalhesCandidato?.id) {
                                const interesse = detalhesCandidato?.interesses?.[0];
                                setRejectContext({
                                  id: detalhesCandidato.id,
                                  candidatoNome: detalhesCandidato.nome,
                                  petId: interesse?.pet_id,
                                  petName: interesse?.pet?.nome || "Pet",
                                });
                                setRejectReason("");
                                setShowRejectConfirm(true);
                              } else {
                                alert("ID do candidato não encontrado. Não é possível rejeitar.");
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
            {showHistorico && detalhesCandidato && (
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
                      {historicoIndex + 1} de {" "}
                      {Array.isArray(detalhesCandidato.interesses)
                        ? detalhesCandidato.interesses.length
                        : 0}
                    </span>
                    <button
                      onClick={() =>
                        setHistoricoIndex((prev) =>
                          Math.min(
                            prev + 1,
                            (Array.isArray(detalhesCandidato.interesses)
                              ? detalhesCandidato.interesses.length
                              : 1) - 1
                          )
                        )
                      }
                      disabled={
                        historicoIndex ===
                          (Array.isArray(detalhesCandidato.interesses)
                            ? detalhesCandidato.interesses.length
                            : 1) -
                            1
                      }
                      className={`text-2xl px-2 ${
                        historicoIndex ===
                        (Array.isArray(detalhesCandidato.interesses)
                          ? detalhesCandidato.interesses.length
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
                    {Array.isArray(detalhesCandidato.interesses) &&
                    detalhesCandidato.interesses.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded border border-sky-100">
                      {(() => {
                        const interesse = detalhesCandidato.interesses[historicoIndex];
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(interesse.status)}`}>
                                {getStatusText(interesse.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {interesse.data_interesse ? new Date(interesse.data_interesse).toLocaleDateString("pt-BR") : "-"}
                              </span>
                            </div>
                            <p>
                              <strong>Pet:</strong> {interesse.pet?.nome || "-"}
                            </p>
                            <p>
                              <strong>Tipo de Moradia:</strong> {detalhesCandidato.tipo_moradia || detalhesCandidato.mora_em || "-"}
                            </p>
                            <p>
                              <strong>Experiência:</strong> {detalhesCandidato.experiencia_pets || detalhesCandidato.ja_teve_tem_animais || "-"}
                            </p>
                            <p>
                              <strong>Motivação:</strong> {detalhesCandidato.motivacao || detalhesCandidato.finalidade_animal || "-"}
                            </p>
                            {interesse.status === "rejeitado" && interesse.observacoes_admin && (
                              <p className="text-red-700 mt-1">
                                <strong>Motivo da Rejeição:</strong> {interesse.observacoes_admin}
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
            {/* Modal de confirmação de aprovação */}
            {showApproveConfirm && (
              <div
                style={{ zIndex: 10000 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
                onClick={() => setShowApproveConfirm(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border-2 border-sky-200"
                >
                  <h3 className="text-xl font-bold text-sky-700 mb-3">Confirmar Aprovação</h3>
                  <p className="mb-4 text-gray-800">
                    Tem certeza que deseja <strong>APROVAR</strong> o candidato "{approveContext.candidatoNome}" para o pet "{approveContext.petName}"?
                  </p>
                  <p className="mb-4 text-gray-600">
                    Esta ação criará automaticamente uma adoção ativa e marcará o pet como adotado.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowApproveConfirm(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={async () => {
                        if (!approveContext.petId) {
                          alert('pet_id não encontrado. Não é possível aprovar.');
                          return;
                        }
                        await updateStatus(approveContext.id, 'aprovado', '', approveContext.petId);
                        setShowApproveConfirm(false);
                        setCandidatoSelecionado(null);
                        setDetalhesCandidato(null);
                      }}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Confirmar e Aprovar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Modal de confirmação de rejeição */}
            {showRejectConfirm && (
              <div
                style={{ zIndex: 10000 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
                onClick={() => setShowRejectConfirm(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border-2 border-sky-200"
                >
                  <h3 className="text-xl font-bold text-rose-700 mb-3">Confirmar Rejeição</h3>
                  <p className="mb-3 text-gray-800">
                    Tem certeza que deseja <strong>REJEITAR</strong> o candidato "{rejectContext.candidatoNome}" para o pet "{rejectContext.petName}"?
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da rejeição</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                    rows={4}
                    placeholder="Descreva o motivo da rejeição (opcional)"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowRejectConfirm(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={async () => {
                        if (!rejectContext.petId) {
                          alert('pet_id não encontrado. Não é possível rejeitar.');
                          return;
                        }
                        await updateStatus(rejectContext.id, 'rejeitado', rejectReason || '', rejectContext.petId);
                        setShowRejectConfirm(false);
                        setCandidatoSelecionado(null);
                        setDetalhesCandidato(null);
                      }}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Confirmar e Rejeitar
                    </button>
                  </div>
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
