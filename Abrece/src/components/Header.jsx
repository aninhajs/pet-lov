import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      className="shadow-lg border-b-2 border-sky-200"
      style={{ backgroundColor: "#f4f0e4" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/logoabrace.jpg"
              alt="Abrace Uma Causa Animal"
              className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
              Abrace Uma Causa Animal
            </h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
            >
              Início
            </Link>
            <Link
              to="/pets"
              class="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
            >
              Ver Pets
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
