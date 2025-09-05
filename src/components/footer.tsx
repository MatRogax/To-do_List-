import { Github, Linkedin, Mail } from "lucide-react";
import TaskMasterLogo from "./logo";

function Footer() {
  return (
    <footer className="bg-[#1F2937] border-t border-gray-700 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <TaskMasterLogo width={40} height={40} />
              <span className="ml-3 text-xl font-bold text-white">
                TaskMaster
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Organize suas tarefas de forma inteligente e eficiente.
              Simplifique sua vida com nossa plataforma de gerenciamento de
              tarefas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/MatRogax"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/matheus-rogato/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:matheusrogato@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Status do Sistema
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/MatRogax/To-do_List-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Documentação
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-400 mb-4 md:mb-0">
              <span>© 2025 TaskMaster. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Termos de Uso
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Política de Privacidade
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            <span className="flex items-center justify-center flex-wrap">
              Feito por @Matheus Rogato Lopes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
