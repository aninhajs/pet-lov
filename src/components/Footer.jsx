import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-sky-800 to-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Logo"
                className="w-16 h-16 rounded-full object-cover shadow-lg border-3 border-yellow-200 hover:border-yellow-300 transition-all duration-300"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent ml-6">
                Abrace
              </h3>
            </div>
            <p className="text-black mb-6 max-w-md font-medium">
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
            <h4 className="text-lg font-bold mb-4 text-yellow-300">Contato</h4>
            <div className="space-y-3 text-black font-medium">
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-yellow-300" />
                <div>
                  <p>Rua 1016, 138</p>
                  <p>Conjunto Ceará</p>
                  <p>CEP: 01234-567</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2 text-yellow-300" />
                <p>(11) 9999-8888</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2 text-yellow-300" />
                <p>contato@petlov.org</p>
              </div>
            </div>
          </div>

          {/* Links Úteis e Redes Sociais */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-300">Siga-nos</h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/ong.abrace?igsh=ZHY0YjMzaGIyZjJj "
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-black font-medium hover:text-pink-400 transition-colors group"
              >
                <Instagram
                  size={20}
                  className="mr-3 text-yellow-300 group-hover:text-pink-400 transition-colors"
                />
                Instagram
              </a>
              <a
                href="https://facebook.com/petlov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-black font-medium hover:text-blue-400 transition-colors group"
              >
                <Facebook
                  size={20}
                  className="mr-3 text-yellow-300 group-hover:text-blue-400 transition-colors"
                />
                Facebook
              </a>
              <a
                href="https://wa.me/5511999998888"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-black font-medium hover:text-green-400 transition-colors group"
              >
                <MessageCircle
                  size={20}
                  className="mr-3 text-yellow-300 group-hover:text-green-400 transition-colors"
                />
                WhatsApp
              </a>
              {/* <a
                href="mailto:contato@petlov.org"
                className="flex items-center text-black font-medium hover:text-yellow-400 transition-colors group"
              >
                <Mail
                  size={20}
                  className="mr-3 text-yellow-300 group-hover:text-yellow-400 transition-colors"
                />
                Email
              </a> */}
            </div>
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
