import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    endereco: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setError("");
    setSuccess("");

    // Console log para ver os dados sendo digitados
    console.log("📝 Dados do formulário atualizados:", newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    console.log("🚀 Iniciando cadastro com os dados:", {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      endereco: formData.endereco,
      senha: "***oculta***",
    });

    // Validações básicas
    if (formData.senha.length < 6) {
      console.log("❌ Erro: Senha muito curta");
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      console.log("❌ Erro: Senhas não conferem");
      setError("As senhas não conferem");
      setIsLoading(false);
      return;
    }

    try {
      const dadosEnvio = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        telefone: formData.telefone.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
      };

      console.log("📤 Enviando dados para o backend:", {
        ...dadosEnvio,
        senha: "***oculta***",
      });

      // Fazer requisição para o backend
      const response = await api.post("/auth/register", dadosEnvio);

      console.log("✅ Resposta do backend:", response.data);

      if (response.data.success) {
        console.log("🎉 Cadastro realizado com sucesso!");
        setSuccess(
          "Cadastro realizado com sucesso! Redirecionando para login..."
        );

        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          telefone: "",
          endereco: "",
        });

        console.log("⏱️ Redirecionando para login em 2 segundos...");
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Erro ao cadastrar:", err);

      // Tratar erros específicos
      if (err.response) {
        console.error("❌ Erro da resposta:", err.response.data);
        const errorMessage =
          err.response.data?.error?.message || "Erro ao cadastrar";

        // Verificar se é erro de validação
        if (err.response.data?.error?.details) {
          const details = err.response.data.error.details;
          console.error("❌ Detalhes do erro:", details);
          setError(details.map((d) => d.msg).join(", "));
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        console.error("❌ Erro na requisição:", err.request);
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
        );
      } else {
        console.error("❌ Erro desconhecido:", err.message);
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
      console.log("🏁 Processo de cadastro finalizado");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-sky-200">
        <div className="text-center mb-6">
          <img
            src="/logoabrace.jpg"
            alt="Abrace Uma Causa Animal"
            className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-yellow-200 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
            Cadastro de Administrador
          </h1>
          <p className="text-gray-600 mt-2">
            Crie sua conta para gerenciar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="João Silva"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha * (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha *
            </label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(85) 98888-7777"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço (opcional)
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Fortaleza - CE"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/login"
            className="block text-sky-600 hover:text-sky-700 text-sm font-medium"
          >
            Já tem uma conta? Faça login
          </Link>
          <Link
            to="/"
            className="block text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            ← Voltar ao site principal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
