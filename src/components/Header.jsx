import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/logoPet.jpeg"
              alt="Pet Lov Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-indigo-600">
              Amor Por Animais De Estimação
            </h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/pets"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Ver Pets
            </Link>
            <Link
              to="/questionnaire"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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
