import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200 ">
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
              className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Início
            </Link>
            <Link
              to="/pets"
              className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Ver Pets
            </Link>
            <Link
              to="/questionnaire"
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all"
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
