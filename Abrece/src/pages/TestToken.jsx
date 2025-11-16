import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TestToken = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("🔍 Verificando localStorage:");
    console.log("Token:", token);
    console.log("User:", user);

    if (token) {
      try {
        // Decodificar o JWT
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userObj = user ? JSON.parse(user) : null;

        setTokenInfo({
          token: token,
          tokenPreview: token.substring(0, 50) + "...",
          payload: payload,
          user: userObj,
          expiresAt: new Date(payload.exp * 1000).toLocaleString("pt-BR"),
          isExpired: payload.exp * 1000 < Date.now(),
        });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setTokenInfo({ error: "Token inválido" });
      }
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    console.log("✅ localStorage limpo!");
    setTokenInfo(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-sky-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔐 Teste de Token de Autenticação
          </h1>

          {!tokenInfo ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold text-lg mb-2">
                ❌ Nenhum token encontrado!
              </p>
              <p className="text-red-500">Você precisa fazer login primeiro.</p>
              <Link
                to="/login"
                className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Ir para Login
              </Link>
            </div>
          ) : tokenInfo.error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold text-lg">
                ❌ {tokenInfo.error}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div
                className={`${
                  tokenInfo.isExpired
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                } border-2 rounded-lg p-6`}
              >
                <p
                  className={`text-lg font-bold ${
                    tokenInfo.isExpired ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {tokenInfo.isExpired
                    ? "⏰ Token EXPIRADO"
                    : "✅ Token VÁLIDO"}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    tokenInfo.isExpired ? "text-red-500" : "text-green-600"
                  }`}
                >
                  Expira em: {tokenInfo.expiresAt}
                </p>
              </div>

              {/* Token Preview */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h2 className="font-bold text-gray-900 mb-3">🔑 Token JWT:</h2>
                <p className="text-xs font-mono bg-gray-100 p-3 rounded break-all">
                  {tokenInfo.tokenPreview}
                </p>
              </div>

              {/* Payload */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h2 className="font-bold text-gray-900 mb-3">
                  📋 Payload do Token:
                </h2>
                <pre className="text-xs bg-blue-100 p-3 rounded overflow-auto">
                  {JSON.stringify(tokenInfo.payload, null, 2)}
                </pre>
              </div>

              {/* User Info */}
              {tokenInfo.user && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                  <h2 className="font-bold text-gray-900 mb-3">
                    👤 Dados do Usuário:
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">ID:</span>{" "}
                      {tokenInfo.user.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Nome:</span>{" "}
                      {tokenInfo.user.nome}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Email:</span>{" "}
                      {tokenInfo.user.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Tipo:</span>{" "}
                      {tokenInfo.user.tipo}
                    </p>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-4">
                <Link
                  to="/admin"
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
                >
                  🏠 Ir para Dashboard
                </Link>
                <button
                  onClick={clearStorage}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  🗑️ Limpar localStorage
                </button>
              </div>

              <Link
                to="/"
                className="block text-center text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                ← Voltar ao site principal
              </Link>
            </div>
          )}
        </div>

        {/* Console Log Info */}
        <div className="mt-6 bg-gray-800 text-white rounded-lg p-6">
          <h3 className="font-bold mb-3">💡 Dica: Verifique o Console (F12)</h3>
          <p className="text-sm text-gray-300">
            Abra o console do navegador para ver os logs detalhados do token.
          </p>
          <div className="mt-3 bg-gray-900 p-3 rounded text-xs font-mono">
            <p className="text-green-400">// No console, digite:</p>
            <p className="text-yellow-300">
              console.log(localStorage.getItem("token"))
            </p>
            <p className="text-yellow-300">
              console.log(localStorage.getItem("user"))
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestToken;
