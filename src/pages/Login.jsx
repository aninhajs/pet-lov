import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpa erro ao digitar
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Credenciais de administrador (hardcoded para desenvolvimento)
    const adminCredentials = {
      email: "admin@petlov.com",
      senha: "admin123",
    };

    if (
      credentials.email === adminCredentials.email &&
      credentials.senha === adminCredentials.senha
    ) {
      // Salva um token simples no localStorage
      localStorage.setItem("adminToken", "admin-authenticated");
      navigate("/admin");
    } else {
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🐾</div>
            <h1 className="text-2xl font-bold text-gray-900">Pet Lov Admin</h1>
            <p className="text-gray-600 mt-2 font-medium">
              Faça login para acessar o painel administrativo
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-senha"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="login-senha"
                name="senha"
                value={credentials.senha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Entrar
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium block"
            >
              Não tem conta? Criar conta de administrador
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-700 text-sm font-medium block"
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
