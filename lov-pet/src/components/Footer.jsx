import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-sky-800 to-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2 text-yellow-300">🐾</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Pet Lov
              </h3>
            </div>
            <p className="text-sky-100 mb-6 max-w-md">
              ONG dedicada ao resgate, cuidado e adoção responsável de animais
              abandonados. Trabalhamos para dar uma segunda chance a pets que
              precisam de amor e um lar.
            </p>
            <a
              href="https://wa.me/5585989167022?text=Olá! Gostaria de fazer uma doação para a ONG Pet Lov 💖"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sky-900 px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl border-2 border-yellow-300"
            >
              ❤️ Quero Doar
            </a>
          </div>

          {/* Informações de Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <div>
                  <p>Rua 1016, 138</p>
                  <p>Conjunto Ceará</p>
                  <p>CEP: 01234-567</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <p>(11) 9999-8888</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <p>contato@petlov.org</p>
              </div>
            </div>
          </div>

          {/* Links Úteis e Redes Sociais */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/petlov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-3 text-xl">📷</span>
                Instagram
              </a>
              <a
                href="https://facebook.com/petlov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-3 text-xl">📘</span>
                Facebook
              </a>
              <a
                href="https://wa.me/5511999998888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-3 text-xl">💬</span>
                WhatsApp
              </a>
              <a
                href="mailto:contato@petlov.org"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-3 text-xl">✉️</span>
                Email
              </a>
            </div>

            {/* <div className="mt-6">
              <h5 className="font-medium mb-2">Links Rápidos</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <Link
                  to="/pets"
                  className="block hover:text-white transition-colors"
                >
                  Ver Pets
                </Link>
                <Link
                  to="/questionnaire"
                  className="block hover:text-white transition-colors"
                >
                  Formulário de Adoção
                </Link>
                <a
                  href="#sobre"
                  className="block hover:text-white transition-colors"
                >
                  Sobre Nós
                </a>
                <a
                  href="#voluntarios"
                  className="block hover:text-white transition-colors"
                >
                  Seja Voluntário
                </a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Linha de Separação e Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Pet Lov ONG. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
              <a
                href="#privacidade"
                className="hover:text-white transition-colors"
              >
                Política de Privacidade
              </a>
              <a href="#termos" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
