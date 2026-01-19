# 🛠️ Instruções do Copilot para o Código do Pet Lov

Bem-vindo ao código do **Pet Lov**! Este documento fornece diretrizes essenciais para agentes de codificação de IA navegarem e contribuírem efetivamente para este projeto.

---

## 📋 **Visão Geral do Projeto**

Pet Lov é uma aplicação web moderna projetada para facilitar adoções de animais de estimação. Possui um frontend baseado em React e um backend em Node.js, com foco em interfaces amigáveis e ferramentas administrativas robustas.

### **Principais Funcionalidades**

- **Frontend**: React, Vite, Tailwind CSS, React Router DOM.
- **Backend**: Node.js, Express, Prisma ORM.
- **Banco de Dados**: PostgreSQL (via Prisma).
- **Autenticação**: Sistema baseado em JWT.
- **Ferramentas Administrativas**: Operações CRUD para pets, dashboards e gerenciamento de adoções.

---

## 📂 **Estrutura do Código**

### **Frontend (Abrece)**

- **`src/components`**: Componentes de UI reutilizáveis (ex.: `Header.jsx`, `Footer.jsx`).
- **`src/pages`**: Componentes de nível de página (ex.: `Home.jsx`, `Login.jsx`).
- **`src/services`**: Módulos de serviço de API (ex.: `PetServices.js`).
- **`src/utils`**: Funções utilitárias.

### **Backend**

- **`src/controllers`**: Lógica de negócios para rotas.
- **`src/routes`**: Endpoints da API (organizados por funcionalidade).
- **`src/middleware`**: Lógica de autenticação e validação.
- **`prisma/`**: Esquema do banco de dados e migrações.

---

## 🛠️ **Fluxos de Trabalho do Desenvolvedor**

### **Frontend**

1. **Instalar dependências**:
   ```bash
   cd Abrece
   npm install
   ```
2. **Executar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
3. **Gerar build para produção**:
   ```bash
   npm run build
   ```

### **Backend**

1. **Instalar dependências**:
   ```bash
   cd backend
   npm install
   ```
2. **Executar o servidor**:
   ```bash
   node src/server.js
   ```
3. **Aplicar migrações do banco de dados**:
   ```bash
   npx prisma migrate dev
   ```

---

## 📏 **Convenções e Padrões**

### **Frontend**

- **Gerenciamento de Estado**: Use os hooks `useState` e `useContext` do React.
- **Roteamento**: Defina rotas em `src/main.jsx` usando `React Router DOM`.
- **Estilização**: Use classes do Tailwind CSS diretamente no JSX.

### **Backend**

- **Controllers**: Mantenha a lógica das rotas mínima; delegue para os controllers em `src/controllers`.
- **Middleware**: Coloque lógica reutilizável (ex.: autenticação) em `src/middleware`.
- **Banco de Dados**: Use Prisma para todas as interações com o banco de dados.

---

## 🔗 **Pontos de Integração**

- **Frontend ↔ Backend**: Chamadas de API são feitas via `src/services/api.js`.
- **Autenticação**: Tokens JWT são armazenados no `localStorage`.
- **Banco de Dados**: Prisma ORM conecta-se a um banco de dados PostgreSQL.

---

## 🐛 **Dicas de Depuração**

- **Frontend**: Use as ferramentas de desenvolvimento do navegador e o React Developer Tools.
- **Backend**: Use `console.log` e inspecione consultas do Prisma com `DEBUG="prisma:*"`.
- **Banco de Dados**: Use `npx prisma studio` para inspecionar e modificar dados.

---

## 📄 **Arquivos Principais**

- **Frontend**:
  - `src/main.jsx`: Ponto de entrada da aplicação.
  - `src/components/Header.jsx`: Exemplo de componente reutilizável.
  - `src/pages/Home.jsx`: Exemplo de um componente de página.
- **Backend**:
  - `src/server.js`: Ponto de entrada do backend.
  - `prisma/schema.prisma`: Esquema do banco de dados.
  - `src/controllers/petsController.js`: Exemplo de um controller.

---

## 🚀 **Primeiros Passos**

Siga o [README.md](../Abrece/README.md) para instruções detalhadas de configuração.

---

Feliz codificação! 🐾
