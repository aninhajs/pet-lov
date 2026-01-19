import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  const isDashboardRoute = location.pathname === "/admin";

  const handleLogout = () => {
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const AdminLinks = () => (
    <>
      {!isDashboardRoute && (
        <Link
          to="/admin"
          className="hidden md:block bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
        >
          Dashboard
        </Link>
      )}
      <Link
        to="/admin/cadastrar-pet"
        className="hidden md:block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
      >
        Novo Pet
      </Link>
      <button
        onClick={handleLogout}
        className="hidden md:block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
      >
        Sair
      </button>
    </>
  );

  const AdminHamburgerMenu = () => (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
      >
        ☰
      </button>
      {menuOpen && (
        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-4 flex flex-col gap-2">
          {!isDashboardRoute && (
            <Link
              to="/admin"
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/admin/cadastrar-pet"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
          >
            Novo Pet
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent md:text-2xl sm:text-lg">
              Abrace Uma Causa Animal
            </h1>
          </div>
          <div className="flex space-x-4 items-center">
            {!isAdminRoute && (
              <Link
                to={isHomePage ? "/pets" : "/"}
                className="hidden md:block bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md text-center"
              >
                {isHomePage ? "Ver Pets" : "Home"}
              </Link>
            )}

            {!isAdminRoute && (
              <div className="relative ml-2 block md:hidden">
                <button
                  className="flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-sky-100 focus:outline-none"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Abrir menu"
                >
                  <span className="block w-7 h-1 bg-sky-700 mb-1 rounded"></span>
                  <span className="block w-7 h-1 bg-sky-700 mb-1 rounded"></span>
                  <span className="block w-7 h-1 bg-sky-700 rounded"></span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-sky-200 rounded-lg shadow-lg z-50 animate-fade-in">
                    <Link
                      to={isHomePage ? "/pets" : "/"}
                      className="block px-4 py-2 text-sky-700 hover:bg-sky-100 rounded-t-lg"
                      onClick={closeMenu}
                    >
                      {isHomePage ? "Ver Pets" : "Início"}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isAdminRoute && <AdminLinks />}
            {isAdminRoute && <AdminHamburgerMenu />}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
