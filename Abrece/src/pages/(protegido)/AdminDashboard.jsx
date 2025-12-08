import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetServices } from "../../services/PetServices";
import { VacinaServices } from "../../services/VacinaServices";
import { AdoptantServices } from "../../services/AdoptantServices";

const AdminDashboard = () => {
  const [excluindo, setExcluindo] = useState(false); // status de exclusão
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPets: 0,
    petsAdotados: 0,
    candidatos: 0,
    petsFortaleza: 0,
    petsAquiraz: 0,
  });

  const [vacinas, setVacinas] = useState([]);
  const [todasVacinas, setTodasVacinas] = useState([]);
  const [buscaPet, setBuscaPet] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [petSelecionado, setPetSelecionado] = useState(null); // nome do pet selecionado

  // Carregar estatísticas reais do backend
  useEffect(() => {
    const loadStats = async () => {
      console.time("loadStats");
      try {
        setIsLoading(true);

        console.time("fetchAllMain");

        // Medir latência individual de cada request envolvida no Promise.all
        const petsPromise = (async () => {
          console.time("AdminDashboard:petsFetch");
          try {
            // Usar endpoint de estatísticas para evitar trazer todos os registros
            return await PetServices.getStats();
          } finally {
            console.timeEnd("AdminDashboard:petsFetch");
          }
        })();

        const pendentesPromise = (async () => {
          console.time("AdminDashboard:pendentesFetch");
          try {
            return await AdoptantServices.getAllAdoptants({
              status: "pendente",
              page: 1,
              limit: 1,
            });
          } finally {
            console.timeEnd("AdminDashboard:pendentesFetch");
          }
        })();

        const vacinasPromise = (async () => {
          console.time("AdminDashboard:vacinasFetch");
          try {
            return await VacinaServices.getAllVacinas({ limit: 10 });
          } finally {
            console.timeEnd("AdminDashboard:vacinasFetch");
          }
        })();

        const candidatosStatsPromise = (async () => {
          console.time("AdminDashboard:candidatosStatsFetch");
          try {
            return await AdoptantServices.getStats();
          } finally {
            console.timeEnd("AdminDashboard:candidatosStatsFetch");
          }
        })();

        const [petsResp, pendentesResp, vacinasResp, candidatosStatsResp] =
          await Promise.all([
            petsPromise,
            pendentesPromise,
            vacinasPromise,
            candidatosStatsPromise,
          ]);

        console.timeEnd("fetchAllMain");

        // PETS — usamos stats leves do backend (counts) para reduzir payload
        if (petsResp?.success && petsResp.data) {
          // Esperamos { total, disponiveis, em_processo, adotados, caes, gatos, fortaleza, aquiraz }
          const petStats =
            petsResp.data.data ||
            petsResp.data ||
            petsResp.data?.data ||
            petsResp.data;
          // totalPets no card é definido como disponiveis + em_processo
          const disponiveis = Number(
            petStats.disponiveis ?? petStats.disponiveis ?? 0
          );
          const emProcesso = Number(
            petStats.em_processo ?? petStats.em_processo ?? 0
          );
          const adotados = Number(petStats.adotados ?? petStats.adotados ?? 0);

          const totalPets = disponiveis + emProcesso;
          const petsAdotados = adotados;
          const petsFortaleza = Number(petStats.fortaleza ?? 0) || 0;
          const petsAquiraz = Number(petStats.aquiraz ?? 0) || 0;

          setStats((s) => ({
            ...s,
            totalPets,
            petsAdotados,
            petsFortaleza,
            petsAquiraz,
          }));
        }

        // PENDENTES — já buscado com limit 1, usar pagination.totalCount quando disponível
        if (pendentesResp?.success) {
          const pendentesCount =
            pendentesResp.pagination?.totalCount ??
            (Array.isArray(pendentesResp.data) ? pendentesResp.data.length : 0);
          setStats((s) => ({ ...s, candidatos: pendentesCount }));
        }

        // VACINAS
        if (vacinasResp?.success) {
          const vacinasData = vacinasResp.data.data?.vacinas || [];
          const vacinasFormatadas = vacinasData.map((vacina) => ({
            id: vacina.id,
            petNome: vacina.pet?.nome || "Pet não encontrado",
            nomeVacina: vacina.nome_vacina,
            dataVacina: vacina.data_aplicacao,
            dataRevacina: vacina.data_revacina,
            dataCadastro: vacina.data_cadastro,
          }));
          setTodasVacinas(vacinasFormatadas);
          setVacinas(vacinasFormatadas.slice(0, 2));
        }

        // log opcional de stats de candidatos
        if (candidatosStatsResp?.success) {
          console.log("candidatos stats:", candidatosStatsResp.data);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar estatísticas:", error);
      } finally {
        setIsLoading(false);
        console.timeEnd("loadStats");
      }
    };

    loadStats();
  }, []);

  // Filtrar vacinas por busca
  useEffect(() => {
    if (buscaPet.trim() === "") {
      // Exibir apenas a vacina mais recente de até 2 pets diferentes
      const petsUnicos = [];
      const vacinasPorPet = [];
      for (const vacina of todasVacinas) {
        if (!petsUnicos.includes(vacina.petNome)) {
          petsUnicos.push(vacina.petNome);
          vacinasPorPet.push(vacina);
        }
        if (vacinasPorPet.length === 2) break;
      }
      setVacinas(vacinasPorPet);
    } else {
      // Busca: filtra vacinas pelo nome do pet, mas ainda mostra só 2 pets diferentes
      const vacinasFiltradas = todasVacinas.filter((vacina) =>
        vacina.petNome.toLowerCase().includes(buscaPet.toLowerCase())
      );
      const petsUnicosBusca = [];
      const vacinasPorPetBusca = [];
      for (const vacina of vacinasFiltradas) {
        if (!petsUnicosBusca.includes(vacina.petNome)) {
          petsUnicosBusca.push(vacina.petNome);
          vacinasPorPetBusca.push(vacina);
        }
        if (vacinasPorPetBusca.length === 2) break;
      }
      setVacinas(vacinasPorPetBusca);
    }
    setPetSelecionado(null); // limpa seleção ao buscar
  }, [buscaPet, todasVacinas]);

  const handleLogout = () => {
    // remove só o que quebra a sessão
    localStorage.removeItem("token");
    // opcional: limpe outros dados de sessão se existir (ex.: user)
    // localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header responsivo */}
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
              <h1
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent leading-tight break-words max-w-[120px] sm:max-w-none"
                style={{ wordBreak: "break-word" }}
              >
                Central de Gerenciamento
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/"
                class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
              >
                Site Principal
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
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
            <span className="bg-gradient-to-r from-sky-600 to-yellow-500 bg-clip-text text-transparent">
              Dashboard Administrativo
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-xl">
            Gerencie pets, adoções e candidatos
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3"></div>
              <div>
                <p className="text-sm font-bold text-gray-800">Total de Pets</p>
                <p className="text-4xl font-extrabold text-gray-900">
                  {isLoading ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    stats.totalPets
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3"></div>
              <div>
                <p className="text-sm font-bold text-gray-800">Pets Adotados</p>
                <p className="text-4xl font-extrabold text-green-700">
                  {isLoading ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    stats.petsAdotados
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3"></div>
              <div>
                <p className="text-sm font-bold text-gray-800">Candidatos</p>
                <p className="text-4xl font-extrabold text-blue-700">
                  {isLoading ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    stats.candidatos
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3"></div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Pets em Fortaleza
                </p>
                <p className="text-4xl font-extrabold text-orange-700">
                  {isLoading ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    stats.petsFortaleza
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center">
              <div className="text-3xl mr-3"></div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Pets em Aquiraz
                </p>
                <p className="text-4xl font-extrabold text-sky-700">
                  {isLoading ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    stats.petsAquiraz
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cartão de Vacinas Recentes */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg">
            <div className="p-6 border-b-2 border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                Vacinas Recentes
              </h2>
              {/* Campo de Busca */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome do pet..."
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
                          <p
                            className="text-base font-bold text-gray-900 cursor-pointer hover:underline"
                            onClick={() => setPetSelecionado(vacina.petNome)}
                          >
                            {vacina.petNome}
                          </p>
                          <p className="text-sm text-green-700 font-bold mt-1">
                            {vacina.nomeVacina}
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-700 font-semibold">
                              Aplicada em:{" "}
                              <span className="font-bold text-gray-900">
                                {new Date(vacina.dataVacina).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </p>
                            {vacina.dataRevacina && (
                              <p className="text-xs text-orange-700 font-semibold">
                                Revacinar em:{" "}
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
                  <div className="text-4xl mb-2"></div>
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
              {/* Modal flutuante para vacinas do pet selecionado */}
              {petSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-2xl border border-green-400 max-w-md w-full p-6 relative animate-fade-in">
                    <button
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg"
                      onClick={() => setPetSelecionado(null)}
                      aria-label="Fechar"
                    >
                      ×
                    </button>
                    <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
                      Vacinas de {petSelecionado}
                    </h3>
                    <ul className="space-y-3">
                      {todasVacinas
                        .filter((v) => v.petNome === petSelecionado)
                        .map((vacina) => (
                          <li
                            key={vacina.id}
                            className="border-l-4 border-green-400 pl-3 py-2 bg-gray-50 rounded-r-lg flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-gray-900">
                                {vacina.nomeVacina}
                              </span>
                              <span className="ml-2 text-xs text-gray-700">
                                Aplicada em:{" "}
                                {new Date(vacina.dataVacina).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                              {vacina.dataRevacina && (
                                <span className="ml-2 text-xs text-orange-700">
                                  Revacinar em:{" "}
                                  {new Date(
                                    vacina.dataRevacina
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              )}
                            </div>
                            <button
                              className="ml-4 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-300"
                              disabled={excluindo}
                              onClick={async () => {
                                const confirm = window.confirm(
                                  `Tem certeza que deseja excluir a vacina "${vacina.nomeVacina}" de ${petSelecionado}?`
                                );
                                if (!confirm) return;
                                setExcluindo(true);
                                try {
                                  // Chama o serviço de exclusão
                                  const resp =
                                    await VacinaServices.deleteVacina(
                                      vacina.id
                                    );
                                  if (resp.success) {
                                    // Remove do estado local
                                    setTodasVacinas((prev) =>
                                      prev.filter((v) => v.id !== vacina.id)
                                    );
                                  } else {
                                    alert(
                                      "Erro ao excluir vacina: " +
                                        (resp.message || "Tente novamente.")
                                    );
                                  }
                                } catch {
                                  alert("Erro ao excluir vacina.");
                                }
                                setExcluindo(false);
                              }}
                            >
                              Excluir
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg">
            <div className="p-6 border-b-2 border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300">
              <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/admin/adoptants"
                  className="flex items-center p-4 bg-white hover:bg-green-50 rounded-lg transition-all transform hover:scale-105 shadow-md border-l-4 border-green-600"
                >
                  <div className="text-3xl mr-4"></div>
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
                  <div className="text-3xl mr-4"></div>
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
                  <div className="text-3xl mr-4"></div>
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
