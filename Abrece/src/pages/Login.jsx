// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// 🔐 DADOS MOCKADOS PARA LOGIN
const MOCK_USERS = [
  {
    email: "admin@abrace.com",
    password: "admin123",
    nome: "Administrador",
    tipo: "admin",
  },
  {
    email: "teste@teste.com",
    password: "teste123",
    nome: "Usuário Teste",
    tipo: "admin",
  },
];

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica token ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Se já tem token, vai direto para o admin
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const emailTrimmed = credentials.email.trim();
      const user = MOCK_USERS.find(
        (u) => u.email === emailTrimmed && u.password === credentials.password
      );

      if (user) {
        // Gera um token mockado (não é JWT real, apenas para simular)
        const mockToken = btoa(
          JSON.stringify({
            email: user.email,
            nome: user.nome,
            tipo: user.tipo,
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
          })
        );

        // Salva token e dados do usuário
        localStorage.setItem("token", mockToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            nome: user.nome,
            tipo: user.tipo,
          })
        );

        navigate("/admin", { replace: true });
      } else {
        setError("Email ou senha incorretos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-sky-200">
          <div className="text-center mb-8">
            <img
              src="/logoabrace.jpg"
              alt="Abrace Uma Causa Animal"
              className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-yellow-200 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
              Admin Abrace Uma Causa
            </h1>
            <p className="text-gray-600 mt-2">
              Faça login para acessar o painel administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="admin@abrace.org"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              ← Voltar ao site principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
