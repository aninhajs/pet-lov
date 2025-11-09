import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CartaoVacina = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [formData, setFormData] = useState({
    nomeVacina1: "",
    dataVacina1: "",
    dataRevacina1: "",
    nomeVacina2: "",
    dataVacina2: "",
    dataRevacina2: "",
    nomeVacina3: "",
    dataVacina3: "",
    dataRevacina3: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Carregar pets do localStorage
  useEffect(() => {
    const petsStorage = JSON.parse(localStorage.getItem("pets") || "[]");
    setPets(petsStorage);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Rolar para o topo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!selectedPet) {
      setMessage({ type: "error", text: "Selecione um pet" });
      return;
    }

    const pet = pets.find((p) => p.id.toString() === selectedPet.toString());

    if (!pet) {
      setMessage({ type: "error", text: "Pet não encontrado" });
      console.log(
        "Pet não encontrado. selectedPet:",
        selectedPet,
        "pets:",
        pets
      );
      return;
    }

    const vacinasStorage = JSON.parse(localStorage.getItem("vacinas") || "[]");
    const atividades = JSON.parse(localStorage.getItem("atividades") || "[]");
    const novasVacinas = [];

    // Processar cada vacina (1, 2 e 3)
    for (let i = 1; i <= 3; i++) {
      const nomeVacina = formData[`nomeVacina${i}`];
      const dataVacina = formData[`dataVacina${i}`];
      const dataRevacina = formData[`dataRevacina${i}`];

      // Só adiciona se tiver nome e data
      if (nomeVacina && dataVacina) {
        const novaVacina = {
          id: Date.now().toString() + `_${i}`,
          petId: selectedPet,
          petNome: pet.nome,
          nomeVacina: nomeVacina,
          dataVacina: dataVacina,
          dataRevacina: dataRevacina,
          dataCadastro: new Date().toISOString(),
        };

        vacinasStorage.push(novaVacina);
        novasVacinas.push(novaVacina);

        // Adicionar à atividade
        const novaAtividade = {
          id: Date.now().toString() + `_vacina_${i}`,
          tipo: "vacina",
          petNome: pet.nome,
          nomeVacina: nomeVacina,
          dataVacina: dataVacina,
          dataRevacina: dataRevacina || "Não informada",
          data: new Date().toLocaleString("pt-BR"),
        };
        atividades.unshift(novaAtividade);
      }
    }

    if (novasVacinas.length === 0) {
      setMessage({ type: "error", text: "Preencha pelo menos uma vacina" });
      return;
    }

    // Salvar no localStorage
    localStorage.setItem("vacinas", JSON.stringify(vacinasStorage));
    localStorage.setItem("atividades", JSON.stringify(atividades.slice(0, 20)));

    console.log("Vacinas cadastradas:", novasVacinas);
    console.log(
      "Atividades adicionadas:",
      atividades.slice(0, novasVacinas.length)
    );

    setMessage({
      type: "success",
      text: `${novasVacinas.length} vacina(s) cadastrada(s) com sucesso!`,
    });
    setFormData({
      nomeVacina1: "",
      dataVacina1: "",
      dataRevacina1: "",
      nomeVacina2: "",
      dataVacina2: "",
      dataRevacina2: "",
      nomeVacina3: "",
      dataVacina3: "",
      dataRevacina3: "",
    });
    setSelectedPet("");

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
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
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
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
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Gerenciar Cartão de Vacina
          </h1>

          {/* Seleção de Pet */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Pet *
            </label>
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Escolha um pet...</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome} - {pet.tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Vacina 1 */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Vacina 1</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Vacina
                  </label>
                  <input
                    type="text"
                    name="nomeVacina1"
                    value={formData.nomeVacina1}
                    onChange={handleChange}
                    placeholder="Ex: V10, Antirrábica"
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
                      name="dataVacina1"
                      value={formData.dataVacina1}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Revacinação
                    </label>
                    <input
                      type="date"
                      name="dataRevacina1"
                      value={formData.dataRevacina1}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vacina 2 */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                Vacina 2 (Opcional)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Vacina
                  </label>
                  <input
                    type="text"
                    name="nomeVacina2"
                    value={formData.nomeVacina2}
                    onChange={handleChange}
                    placeholder="Ex: Leishmaniose"
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
                      name="dataVacina2"
                      value={formData.dataVacina2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Revacinação
                    </label>
                    <input
                      type="date"
                      name="dataRevacina2"
                      value={formData.dataRevacina2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vacina 3 */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                Vacina 3 (Opcional)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Vacina
                  </label>
                  <input
                    type="text"
                    name="nomeVacina3"
                    value={formData.nomeVacina3}
                    onChange={handleChange}
                    placeholder="Ex: Gripe Canina"
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
                      name="dataVacina3"
                      value={formData.dataVacina3}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Revacinação
                    </label>
                    <input
                      type="date"
                      name="dataRevacina3"
                      value={formData.dataRevacina3}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

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
