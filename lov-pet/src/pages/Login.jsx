import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário já está logado ao carregar a página
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/admin");
    }
  }, [navigate]);

  // Credenciais de exemplo (em um app real, isso seria validado no backend)
  const adminCredentials = {
    email: "admin@petlov.com",
    password: "admin123",
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpa erro ao digitar
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula validação
    setTimeout(() => {
      if (
        credentials.email === adminCredentials.email &&
        credentials.password === adminCredentials.password
      ) {
        // Login bem-sucedido
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate("/admin");
      } else {
        setError("Email ou senha incorretos");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🐾</div>
            <h1 className="text-2xl font-bold text-gray-900">Pet Lov Admin</h1>
            <p className="text-gray-600 mt-2">
              Faça login para acessar o painel administrativo
            </p>
          </div>
          {/* Formulário */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="admin@petlov.com"
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
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
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

          {/* Link para voltar */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
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
