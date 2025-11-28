# Documentação da pasta Abrece

Esta documentação descreve a estrutura e a função de cada arquivo e pasta dentro do diretório `Abrece` do seu projeto.

## Estrutura Geral

- **eslint.config.js**: Configuração do ESLint para padronização e análise de código.
- **index.html**: Arquivo HTML principal da aplicação.
- **package.json / package-lock.json**: Gerenciamento de dependências e scripts do projeto.
- **postcss.config.js**: Configuração do PostCSS, geralmente usado com Tailwind CSS.
- **tailwind.config.js**: Configuração do Tailwind CSS.
- **vite.config.js**: Configuração do Vite, bundler utilizado no projeto.
- **teste.js**: Arquivo de teste ou exemplo.
- **.env**: Variáveis de ambiente (não versionado).
- **.gitignore**: Arquivos e pastas ignorados pelo Git.
- **node_modules/**: Dependências instaladas (não versionado).

## public/

- **imag/**: Pasta para imagens públicas e assets estáticos.

## src/

Código-fonte principal da aplicação React.

### src/App.jsx

Componente principal da aplicação.

### src/index.css

Estilos globais da aplicação.

### src/main.jsx

Ponto de entrada da aplicação React.

### src/components/

Componentes reutilizáveis:

- **Footer.jsx**: Rodapé do site.
- **Header.jsx**: Cabeçalho do site.
- **ModalEditarPet.jsx**: Modal para edição de pets.
- **ProtectedRoute.jsx**: Rota protegida para autenticação.
- **TesteService.jsx**: Componente de teste de serviços.

### src/lib/

- **api.js**: Configuração e funções auxiliares para requisições à API.

### src/pages/

Páginas principais da aplicação:

- **Home.jsx**: Página inicial.
- **Login.jsx**: Página de login.
- **Pets.jsx**: Página de listagem de pets.
- **TestePage.jsx**: Página de teste.
- **TestToken.jsx**: Página para teste de token.

#### src/pages/(protegido)/

Páginas acessíveis apenas por usuários autenticados:

- **AdminAdoptants.jsx**: Administração de adotantes.
- **AdminDashboard.jsx**: Dashboard administrativo.
- **CadastrarPet.jsx**: Cadastro de novos pets.
- **CartaoVacina.jsx**: Cartão de vacinas dos pets.
- **GerenciarPets.jsx**: Gerenciamento de pets cadastrados.

### src/services/

Serviços para comunicação com a API:

- **AdoptantServices.js**: Serviços relacionados a adotantes.
- **api.js**: Configuração base da API.
- **PetServices.js**: Serviços relacionados a pets.
- **VacinaServices.js**: Serviços relacionados a vacinas.
- **README.md**: Documentação dos serviços.

### src/utils/

Funções utilitárias e helpers.

- **README.md**: Documentação dos utilitários.

---
