// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const emailRef = useRef();
  const senhaRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Verifica token ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Se já tem token, vai direto para o admin
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log(" Login - Iniciando processo de login");
    console.log(" Email:", emailRef.current.value);

    try {
      // Fazer requisição para o backend
      console.log(" Enviando requisição para /auth/login");
      const {
        data: {
          data: { token, user },
        },
      } = await api.post("/auth/login", {
        email: emailRef.current.value.trim(),
        senha: senhaRef.current.value,
      });

      console.log(" Resposta recebida - Login bem-sucedido!");
      console.log(" Token recebido:", token.substring(0, 20) + "...");
      console.log(" Dados do usuário:", user);

      // Salva token e dados do usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log(" Dados salvos no localStorage");

      // Força um pequeno delay antes de redirecionar para garantir que o localStorage foi salvo
      setTimeout(() => {
        console.log(" Login - Executando redirecionamento agora");
        navigate("/admin", { replace: true });
      }, 100);
    } catch (err) {
      console.error(" Login - Erro capturado:", err);
      // Tratar erros específicos
      if (err.response) {
        // Erro de resposta do servidor
        const errorMessage =
          err.response.data?.error?.message || "Credenciais inválidas";
        setError(errorMessage);
      } else if (err.request) {
        // Requisição foi feita mas não houve resposta
        setError(
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        );
      } else {
        // Erro ao configurar a requisição
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f4f0e4" }}
    >
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
                ref={emailRef}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Digite seu email"
                autoComplete="username"
                onChange={() => setError("")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  ref={senhaRef}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={() => setError("")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    // Olho fechado (Eye Slash)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.807 6.053 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.02M6.53 6.53A10.45 10.45 0 0 1 12 5.25c3.697 0 7.714 2.943 9.75 6.75a10.49 10.49 0 0 1-2.042 2.773M6.53 6.53l10.94 10.94M6.53 6.53l-2.55 2.55m13.49 13.49l-2.55-2.55"
                      />
                    </svg>
                  ) : (
                    // Olho aberto (Eye)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12C4.286 8.193 8.303 5.25 12 5.25c3.697 0 7.714 2.943 9.75 6.75-2.036 3.807-6.053 6.75-9.75 6.75-3.697 0-7.714-2.943-9.75-6.75z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  )}
                </button>
              </div>
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
            {/* <Link
              to="/"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              ← Voltar ao site principal
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
