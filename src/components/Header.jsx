import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logoabrace.jpg"
              alt="Pet Lov Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border-3 border-yellow-200 hover:border-yellow-300 transition-all duration-300"
            />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
              Abrece uma causa animal
            </h1>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/"
              className="text-sky-700 hover:text-sky-800 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border border-transparent hover:border-yellow-300"
            >
              Página Inicial
            </Link>
            <Link
              to="https://forms.gle/Vs2Arsu5bwi5h3wA9"
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg border-2 border-yellow-300 hover:border-yellow-400"
            >
              Adotar Pet
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
