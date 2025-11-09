import React from "react";
import { Link } from "react-router-dom";

const TestePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-yellow-300 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-4">
          🧪 Página de Teste
        </h1>
        <p className="text-gray-600 mb-6">
          Esta é uma página de teste para verificar se o roteamento está
          funcionando.
        </p>

        <div className="space-y-3">
          <Link
            to="/admin"
            className="block w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md font-semibold shadow-lg transition-all hover:scale-105"
          >
            Ir para Dashboard
          </Link>

          <Link
            to="/admin/gerenciar-pets"
            className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md font-semibold shadow-lg transition-all hover:scale-105"
          >
            Ir para Gerenciar Pets
          </Link>

          <Link
            to="/admin/cadastrar-pet"
            className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-md font-semibold shadow-lg transition-all hover:scale-105"
          >
            Ir para Cadastrar Pet
          </Link>

          <button
            onClick={() =>
              console.log(
                "localStorage pets:",
                JSON.parse(localStorage.getItem("pets") || "[]")
              )
            }
            className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-4 py-2 rounded-md font-semibold shadow-lg transition-all hover:scale-105"
          >
            Ver Pets no Console
          </button>

          <button
            onClick={() => {
              localStorage.setItem("isAdminLoggedIn", "true");
              alert("Login realizado!");
            }}
            className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-md font-semibold shadow-lg transition-all hover:scale-105"
          >
            Fazer Login de Teste
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestePage;
