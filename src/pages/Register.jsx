import React from "react";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Cadastro</h1>
        <p className="text-gray-600 mb-6">
          Página de cadastro de usuário/admin.
        </p>
        {/* Adicione o formulário de cadastro aqui */}
        <form>
          <input
            type="text"
            placeholder="Nome"
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-6 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-2 rounded font-semibold"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
