import React from "react";
import { Link } from "react-router-dom";

const TestePage = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          🧪 Página de Teste
        </h1>
        <p className="text-gray-600 mb-6">
          Esta é uma página de teste para verificar se o roteamento está
          funcionando.
        </p>

        <div className="space-y-3">
          <Link
            to="/admin"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Ir para Dashboard
          </Link>

          <Link
            to="/admin/gerenciar-pets"
            className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Ir para Gerenciar Pets
          </Link>

          <Link
            to="/admin/cadastrar-pet"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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
            className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          >
            Ver Pets no Console
          </button>

          <button
            onClick={() => {
              localStorage.setItem("isAdminLoggedIn", "true");
              alert("Login realizado!");
            }}
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Fazer Login de Teste
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestePage;
