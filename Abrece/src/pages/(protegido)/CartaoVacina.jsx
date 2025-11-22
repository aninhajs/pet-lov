import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PetServices } from "../../services/PetServices";
import { VacinaServices } from "../../services/VacinaServices";

const CartaoVacina = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [vacinas, setVacinas] = useState([
    { id: Date.now(), nomeVacina: "", dataVacina: "", dataRevacina: "" },
  ]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filtroNome, setFiltroNome] = useState("");

  // Carregar pets do backend
  useEffect(() => {
    const fetchPets = async () => {
      const result = await PetServices.getAllPets();
      if (result.success) {
        setPets(result.data.data || []);
      } else {
        setMessage({ type: "error", text: "Erro ao carregar pets" });
      }
    };
    fetchPets();
  }, []);

  const handleChange = (index, field, value) => {
    const novasVacinas = [...vacinas];
    if (field === "dataRevacina") {
      const dataVacina = novasVacinas[index].dataVacina;
      if (dataVacina && value) {
        const dataVacinaDate = new Date(dataVacina);
        const dataRevacinaDate = new Date(value);
        if (dataRevacinaDate <= dataVacinaDate) {
          alert("A data de revacinação deve ser posterior à data da vacina.");
          return;
        }
      }
    }
    novasVacinas[index][field] = value;
    setVacinas(novasVacinas);
  };

  const adicionarVacina = () => {
    setVacinas([
      ...vacinas,
      { id: Date.now(), nomeVacina: "", dataVacina: "", dataRevacina: "" },
    ]);
  };

  const removerVacina = (index) => {
    if (vacinas.length > 1) {
      const novasVacinas = vacinas.filter((_, i) => i !== index);
      setVacinas(novasVacinas);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rolar para o topo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!selectedPet) {
      setMessage({ type: "error", text: "Selecione um pet" });
      return;
    }

    // Validar vacinas - só incluir as que têm nome e data
    const vacinasValidas = vacinas.filter(
      (vacina) => vacina.nomeVacina.trim() && vacina.dataVacina
    );

    // Validação extra para datas de revacina
    for (const vacina of vacinasValidas) {
      if (vacina.dataRevacina) {
        const dataVacinaDate = new Date(vacina.dataVacina);
        const dataRevacinaDate = new Date(vacina.dataRevacina);
        if (dataRevacinaDate <= dataVacinaDate) {
          setMessage({
            type: "error",
            text: "A data de revacinação deve ser posterior à data da vacina.",
          });
          return;
        }
      }
    }

    if (vacinasValidas.length === 0) {
      setMessage({ type: "error", text: "Preencha pelo menos uma vacina" });
      return;
    }

    // Preparar dados para enviar ao backend
    const vacinasParaEnviar = vacinasValidas.map((vacina) => ({
      nome_vacina: vacina.nomeVacina,
      data_aplicacao: vacina.dataVacina,
      data_revacina: vacina.dataRevacina || null,
    }));

    // Enviar para o backend (pet_id é string no banco)
    const result = await VacinaServices.createVacinasLote(
      selectedPet,
      vacinasParaEnviar
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: `${vacinasValidas.length} vacina(s) cadastrada(s) com sucesso!`,
      });

      // Resetar formulário
      setVacinas([
        { id: Date.now(), nomeVacina: "", dataVacina: "", dataRevacina: "" },
      ]);
      setSelectedPet("");

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Erro ao cadastrar vacinas",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Toast Flutuante */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl border-2 transform transition-all duration-300 ${
            message.type === "success"
              ? "bg-green-500 text-white border-green-600"
              : "bg-red-500 text-white border-red-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {message.type === "success" ? "✅" : "❌"}
            </span>
            <p className="font-semibold">{message.text}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="shadow-lg border-b-2 border-yellow-300"
        style={{ backgroundColor: "#f4f0e4" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Pet Lov Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Cartão de Vacina
              </h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/admin"
                className="text-sky-700 hover:text-sky-800 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Dashboard
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Gerenciar Cartão de Vacina
          </h1>

          {/* Seleção de Pet */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesquisar Pet pelo nome
            </label>
            <input
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Digite o nome do pet..."
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="off"
            />
            {filtroNome && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {pets
                  .filter((pet) =>
                    pet.nome.toLowerCase().includes(filtroNome.toLowerCase())
                  )
                  .map((pet) => (
                    <li
                      key={pet.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-sky-100 ${
                        selectedPet === pet.id ? "bg-sky-200 font-bold" : ""
                      }`}
                      onClick={() => {
                        setSelectedPet(pet.id);
                        setFiltroNome(pet.nome);
                      }}
                    >
                      {pet.nome} - {pet.tipo}
                    </li>
                  ))}
                {pets.filter((pet) =>
                  pet.nome.toLowerCase().includes(filtroNome.toLowerCase())
                ).length === 0 && (
                  <li className="px-4 py-2 text-gray-400">
                    Nenhum pet encontrado
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Lista de Vacinas */}
            {vacinas.map((vacina, index) => (
              <div
                key={vacina.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Vacina</h3>
                  {vacinas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerVacina(index)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      ✕ Remover
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Vacina
                    </label>
                    <input
                      type="text"
                      value={vacina.nomeVacina}
                      onChange={(e) =>
                        handleChange(index, "nomeVacina", e.target.value)
                      }
                      placeholder="Ex: V10, Antirrábica, Leishmaniose"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data da Vacina
                      </label>
                      <input
                        type="date"
                        value={vacina.dataVacina}
                        onChange={(e) =>
                          handleChange(index, "dataVacina", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Revacinação (Opcional)
                      </label>
                      <input
                        type="date"
                        value={vacina.dataRevacina}
                        onChange={(e) =>
                          handleChange(index, "dataRevacina", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botão Adicionar Vacina */}
            <button
              type="button"
              onClick={adicionarVacina}
              className="w-full border-2 border-dashed border-gray-300 hover:border-sky-500 rounded-lg p-4 text-gray-600 hover:text-sky-600 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">+</span>
              <span>Adicionar outra vacina</span>
            </button>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!selectedPet}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg"
              >
                Cadastrar Vacina(s)
              </button>
              <Link
                to="/admin"
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                ← Voltar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CartaoVacina;
