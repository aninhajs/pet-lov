import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Heart } from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-sky-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-yellow-400 mr-3"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-yellow-400 bg-clip-text text-transparent">
                Abrace Uma Causa Animal
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              ONG dedicada ao resgate, cuidado e adoção responsável de animais
              abandonados. Trabalhamos para dar uma segunda chance a pets que
              precisam de amor e um lar.
            </p>
            <a
              href=" https://www.vakinha.com.br/vaquinha/campanha-nosso-lar?utm_source=instagram.com
"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center shadow-lg gap-2"
            >
              <Heart className="w-5 h-5" />
              Quero Doar
            </a>
          </div>

          {/* Informações de Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-sky-400" />
                <div>
                  <p>Fortaleza - CE</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-yellow-400" />
                <p>(85) 98812-8654</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-sky-400" />
                <p>contato@ongabrace.com.br</p>
              </div>
            </div>
          </div>

          {/* Links Úteis e Redes Sociais */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/ong.abrace?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <Instagram className="w-5 h-5 mr-3 text-yellow-400 group-hover:text-yellow-300" />
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@abraceumacausaanimal?_r=1&_t=ZS-91P5sAichfe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <FaTiktok className="w-5 h-5 mr-3 text-sky-400 group-hover:text-sky-300" />
                TikTok
              </a>
              <a
                href="https://wa.me/+558588128654"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <FaWhatsapp className="w-5 h-5 mr-3 text-yellow-400 group-hover:text-yellow-300" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@petlov.org"
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 mr-3 text-sky-400 group-hover:text-sky-300" />
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
        <div className="border-t border-sky-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Abrace Uma Causa Animal. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
              <a
                href="#privacidade"
                className="hover:text-sky-400 transition-colors"
              >
                Política de Privacidade
              </a>
              <a
                href="#termos"
                className="hover:text-sky-400 transition-colors"
              >
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
