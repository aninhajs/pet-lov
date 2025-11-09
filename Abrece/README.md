# 🐾 Pet Lov - Sistema de Adoção de Animais

> **Plataforma completa para adoção de pets com interface moderna e sistema administrativo**

---

## 📋 **Índice**

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Páginas](#-páginas)
- [Componentes](#-componentes)
- [Arquitetura](#-arquitetura)
- [Desenvolvimento](#-desenvolvimento)
- [Roadmap](#-roadmap)

---

## 🎯 **Sobre o Projeto**

O **Pet Lov** é uma aplicação web moderna desenvolvida em React para facilitar o processo de adoção de animais de estimação. O sistema conecta pessoas interessadas em adotar pets com organizações e pessoas que têm animais disponíveis para adoção.

### **Objetivos**

- 🏠 **Facilitar adoções** - Interface intuitiva para encontrar pets
- 💖 **Conectar famílias** - Unir pets e famílias ideais
- 📊 **Gestão completa** - Sistema administrativo robusto
- 📱 **Experiência moderna** - Design responsivo e acessível

---

## ✨ **Funcionalidades**

### **👥 Para Usuários (Adotantes)**

- 🔍 **Navegação de Pets** - Visualizar todos os pets disponíveis
- 🏷️ **Filtros Inteligentes** - Por tipo (cão/gato) e status (disponível/adotado)
- 🖼️ **Cards Interativos** - Informações básicas com modal expandido
- 📋 **Questionário de Adoção** - Formulário completo para manifestar interesse
- 📱 **Interface Responsiva** - Funciona perfeitamente em todos os dispositivos

### **🔧 Para Administradores**

- 🏛️ **Dashboard Completo** - Visão geral do sistema com estatísticas
- 🐕 **Gerenciar Pets** - CRUD completo (criar, ler, atualizar, deletar)
- ➕ **Cadastrar Novos Pets** - Formulário com upload de imagens
- 📊 **Controle de Adoções** - Acompanhar processo de adoção
- 🔐 **Sistema de Autenticação** - Login protegido para área administrativa

### **💾 Persistência de Dados**

- 🗄️ **LocalStorage** - Armazenamento local dos dados
- 📸 **Upload de Imagens** - Suporte a múltiplos formatos
- 🔄 **Sincronização** - Dados mantidos entre sessões

---

## 🛠️ **Tecnologias**

### **Frontend**

- ⚛️ **React 18** - Biblioteca principal para UI
- 🚀 **Vite** - Build tool moderna e rápida
- 🎨 **Tailwind CSS** - Framework CSS utilitário
- 🧭 **React Router DOM** - Roteamento SPA
- 📱 **Design Responsivo** - Mobile-first approach

### **Ferramentas de Desenvolvimento**

- 📦 **npm** - Gerenciador de pacotes
- 🔍 **ESLint** - Linting de código
- 🎯 **VS Code** - IDE recomendada
- 🌐 **Git** - Controle de versão

### **Futuras Integrações**

- 🔗 **Backend API** - Node.js/Express (planejado)
- 🗃️ **Banco de Dados** - PostgreSQL/MongoDB (planejado)
- ☁️ **Cloud Storage** - AWS S3/Cloudinary (planejado)

---

## 📁 **Estrutura do Projeto**

```
lov-pet/
├── 📄 README.md                    # Documentação principal
├── 📄 package.json                 # Dependências e scripts
├── 📄 vite.config.js              # Configuração do Vite
├── 📄 tailwind.config.js          # Configuração do Tailwind
├── 📄 .gitignore                  # Arquivos ignorados pelo Git
├── 📄 index.html                  # Template HTML principal
│
├── 📁 public/                     # Arquivos estáticos
│   ├── 🖼️ logoPet.jpeg           # Logo da aplicação
│   ├── 🖼️ cachorro.png           # Imagens dos pets
│   ├── 🖼️ gatinho1.webp         # Imagens dos pets
│   └── 📁 imag/                  # Outras imagens
│
└── 📁 src/                       # Código fonte
    ├── 📄 main.jsx               # Ponto de entrada da aplicação
    ├── 📄 App.jsx                # Componente principal
    ├── 📄 index.css              # Estilos globais
    │
    ├── 📁 components/            # Componentes reutilizáveis
    │   ├── 🧩 Header.jsx         # Cabeçalho da aplicação
    │   ├── 🧩 Footer.jsx         # Rodapé da aplicação
    │   └── 🛡️ ProtectedRoute.jsx # Proteção de rotas
    │
    ├── 📁 pages/                 # Páginas da aplicação
    │   ├── 🏠 Home.jsx           # Página inicial
    │   ├── 🐾 Pets.jsx           # Lista de todos os pets
    │   ├── 📋 Questionnaire.jsx  # Formulário de adoção
    │   ├── 🔐 Login.jsx          # Página de login
    │   ├── 🧪 TestePage.jsx      # Página de testes/debug
    │   │
    │   └── 📁 (protegido)/       # Páginas administrativas
    │       ├── 📊 AdminDashboard.jsx    # Dashboard admin
    │       ├── 👥 AdminAdoptants.jsx    # Gerenciar adotantes
    │       ├── ➕ CadastrarPet.jsx      # Cadastrar pets
    │       └── 🔧 GerenciarPets.jsx     # Gerenciar pets
    │
    ├── 📁 services/              # Serviços (futuro backend)
    │   └── 📚 README.md          # Documentação dos serviços
    │
    └── 📁 utils/                 # Funções utilitárias (futuro)
        └── 📚 README.md          # Documentação dos utilitários
```

---

## 🚀 **Instalação**

### **Pré-requisitos**

- 📦 **Node.js** v16+
- 📦 **npm** v8+
- 💻 **Git**

### **Passo a Passo**

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd lov-pet
```

2. **Instale as dependências**

```bash
npm install
```

3. **Execute em modo de desenvolvimento**

```bash
npm run dev
```

4. **Acesse a aplicação**

```
http://localhost:5174
```

### **Scripts Disponíveis**

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa linting do código
```

---

## 📖 **Como Usar**

### **👤 Para Usuários**

1. **Navegar pelos Pets**

   - Acesse a página inicial ou `/pets`
   - Visualize os cards com foto, nome e idade
   - Clique em qualquer card para ver detalhes completos

2. **Filtrar Pets**

   - Use os botões de filtro por tipo (Cão/Gato)
   - Clique nos cards de status (Disponíveis/Em Processo/Adotados)
   - Navegue pelos resultados filtrados

3. **Iniciar Processo de Adoção**
   - Clique em "Adotar Pet" no header
   - Preencha o questionário completo
   - Aguarde contato da organização

### **🔧 Para Administradores**

1. **Fazer Login**

   - Acesse `/login`
   - Use credenciais administrativas
   - Será redirecionado para o dashboard

2. **Gerenciar Pets**
   - Visualize estatísticas no dashboard
   - Cadastre novos pets com fotos
   - Edite informações existentes
   - Acompanhe processo de adoções

---

## 📄 **Páginas**

### **🌐 Páginas Públicas**

#### **🏠 Home (`/`)**

- **Hero Section** com chamada para ação
- **Cards de Pets em Destaque** com modal interativo
- **Footer** com informações de contato
- **Design:** Gradiente azul com cards flutuantes

#### **🐾 Pets (`/pets`)**

- **Lista Completa** de todos os pets cadastrados
- **Filtros Interativos** por tipo e status
- **Contadores Dinâmicos** (Disponíveis: X, Em Processo: Y, Adotados: Z)
- **Cards Clicáveis** com modal de detalhes expandido

#### **📋 Questionário (`/questionnaire`)**

- **Formulário Completo** de manifestação de interesse
- **Validações** em tempo real
- **Campos:** Nome, email, telefone, endereço, tipo de moradia, experiência
- **Página de Sucesso** após envio

#### **🔐 Login (`/login`)**

- **Interface Simples** de autenticação
- **Redirecionamento** automático após login
- **Mensagens de Erro** claras

### **🛡️ Páginas Administrativas**

#### **📊 Dashboard Admin (`/admin`)**

- **Estatísticas Gerais** do sistema
- **Contadores** de pets por status
- **Links Rápidos** para funcionalidades principais
- **Visão Geral** das adoções

#### **➕ Cadastrar Pet (`/admin/cadastrar-pet`)**

- **Formulário Completo** com todos os campos
- **Upload de Imagens** com preview
- **Validações** obrigatórias
- **Feedback** de sucesso/erro

#### **🔧 Gerenciar Pets (`/admin/gerenciar-pets`)**

- **Lista Editável** de todos os pets
- **Ações:** Editar, Excluir, Mudar Status
- **Filtros** e busca
- **Modais** de confirmação

#### **👥 Gerenciar Adotantes (`/admin/adocoes`)**

- **Lista de Solicitações** de adoção
- **Status do Processo** (Pendente/Aprovado/Rejeitado)
- **Detalhes Completos** do adotante
- **Sistema de Aprovação**

---

## 🧩 **Componentes**

### **🎨 Componentes de Layout**

#### **Header.jsx**

```jsx
// Navegação principal da aplicação
- Logo da empresa
- Links de navegação (Ver Pets, Adotar Pet)
- Design responsivo
- Reutilizado em todas as páginas
```

#### **Footer.jsx**

```jsx
// Rodapé com informações da empresa
- Informações de contato
- Links úteis
- Copyright
- Design consistente
```

#### **ProtectedRoute.jsx**

```jsx
// Proteção de rotas administrativas
- Verificação de autenticação
- Redirecionamento automático
- Segurança das páginas admin
```

### **🎯 Componentes Funcionais**

#### **Cards de Pet**

- **Design Moderno** com hover effects
- **Informações Básicas** (foto, nome, idade)
- **Modal Expandido** com detalhes completos
- **Estados Visuais** baseados no status

#### **Modais Interativos**

- **Overlay Escuro** com backdrop blur
- **Animações Suaves** de entrada/saída
- **Botão de Fechar** intuitivo
- **Responsivo** em todos os dispositivos

#### **Formulários**

- **Validação em Tempo Real**
- **Mensagens de Erro** claras
- **Design Consistente** com Tailwind
- **Estados de Loading**

---

## 🏗️ **Arquitetura**

### **🎨 Frontend Architecture**

```
┌─────────────────┐
│   React Router  │  ← Roteamento SPA
├─────────────────┤
│     Pages       │  ← Páginas principais
├─────────────────┤
│   Components    │  ← Componentes reutilizáveis
├─────────────────┤
│   LocalStorage  │  ← Persistência local
└─────────────────┘
```

### **📊 Fluxo de Dados**

```
User Action → Component → LocalStorage → State → UI Update
    ↑                                              ↓
    └──────────── Event Handlers ←──────────────────┘
```

### **🗂️ Organização do Código**

- **Pages/** - Componentes de página completa
- **Components/** - Componentes reutilizáveis
- **Services/** - Integração com APIs (futuro)
- **Utils/** - Funções utilitárias (futuro)

### **🔐 Sistema de Autenticação**

```javascript
// Simulação de autenticação
localStorage.getItem('isAdminLoggedIn') === 'true'

// Proteção de rotas
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

### **💾 Gerenciamento de Estado**

- **React useState** - Estado local dos componentes
- **LocalStorage** - Persistência de dados
- **Props Drilling** - Comunicação entre componentes
- **Event Handlers** - Fluxo de dados ascendente

---

## 🔧 **Desenvolvimento**

### **📝 Padrões de Código**

#### **Nomenclatura**

```javascript
// Componentes: PascalCase
const PetCard = () => {};

// Funções: camelCase
const handlePetClick = () => {};

// Constantes: UPPER_SNAKE_CASE
const PET_STATUS = { DISPONIVEL: "disponivel" };
```

#### **Estrutura de Componentes**

```jsx
// Template padrão
import React, { useState } from "react";

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  const handleAction = () => {
    // lógica
  };

  return <div className="tailwind-classes">{/* JSX */}</div>;
};

export default ComponentName;
```

### **🎨 Estilos com Tailwind**

```jsx
// Classes utilitárias responsivas
<div className="
  w-full h-56           // Dimensões
  bg-white             // Background
  rounded-xl           // Border radius
  shadow-sm            // Sombra
  hover:shadow-md      // Hover state
  transition-all       // Transições
  sm:w-1/2 lg:w-1/3   // Responsividade
">
```

### **📱 Responsividade**

- **Mobile First** - Design priorizando dispositivos móveis
- **Breakpoints** - `sm:` `md:` `lg:` `xl:` `2xl:`
- **Grid System** - Layouts flexíveis com CSS Grid
- **Imagens Adaptáveis** - `object-cover` e dimensões fluidas

### **🔄 Fluxo de Desenvolvimento**

1. **Criar Componente** → Desenvolver isoladamente
2. **Adicionar Estado** → Implementar lógica
3. **Estilizar** → Aplicar classes Tailwind
4. **Integrar** → Conectar com outras partes
5. **Testar** → Verificar funcionamento
6. **Documentar** → Atualizar documentação

---

## 🎯 **Roadmap**

### **📅 Fase 1: Fundação (Concluída ✅)**

- [x] Setup inicial do projeto com Vite + React
- [x] Configuração do Tailwind CSS
- [x] Estrutura básica de pastas
- [x] Roteamento com React Router
- [x] Componentes de layout (Header, Footer)

### **📅 Fase 2: Interface do Usuário (Concluída ✅)**

- [x] Página inicial com hero section
- [x] Cards de pets com modal interativo
- [x] Página de listagem de pets
- [x] Filtros por tipo e status
- [x] Formulário de questionário de adoção
- [x] Design responsivo completo

### **📅 Fase 3: Área Administrativa (Concluída ✅)**

- [x] Sistema de autenticação simples
- [x] Dashboard administrativo
- [x] CRUD completo de pets
- [x] Upload de imagens
- [x] Gerenciamento de adoções
- [x] Proteção de rotas

### **📅 Fase 4: Melhorias e Otimizações (Concluída ✅)**

- [x] Persistência com LocalStorage
- [x] Validações de formulários
- [x] Feedback visual (loading, success, error)
- [x] Otimização de imagens
- [x] Documentação completa
- [x] Configuração do Git

### **📅 Fase 5: Backend Integration (🚧 Planejado)**

- [ ] API REST com Node.js/Express
- [ ] Banco de dados PostgreSQL/MongoDB
- [ ] Autenticação JWT
- [ ] Upload real de imagens (AWS S3/Cloudinary)
- [ ] Sistema de notificações
- [ ] Email automático para adoções

### **📅 Fase 6: Funcionalidades Avançadas (🔮 Futuro)**

- [ ] Chat em tempo real
- [ ] Sistema de avaliações
- [ ] Geolocalização de pets
- [ ] App mobile (React Native)
- [ ] Integração com redes sociais
- [ ] Analytics e relatórios

### **📅 Fase 7: Deploy e Produção (🔮 Futuro)**

- [ ] Deploy na Vercel/Netlify
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento de performance
- [ ] SEO e meta tags
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados

---

## 📊 **Estatísticas do Projeto**

### **📈 Métricas de Desenvolvimento**

- **Páginas:** 8 páginas funcionais
- **Componentes:** 3 componentes reutilizáveis
- **Linhas de Código:** ~2000+ linhas
- **Tempo de Desenvolvimento:** 1 sprint intensivo
- **Tecnologias:** 5+ tecnologias integradas

### **✨ Funcionalidades Implementadas**

- **CRUD Completo** de pets
- **Sistema de Filtros** dinâmicos
- **Upload de Imagens** com preview
- **Modais Interativos** responsivos
- **Formulários Validados** com feedback
- **Área Administrativa** protegida
- **Persistência de Dados** local

### **🎨 Design System**

- **Cores Principais:** Índigo, azul, verde, amarelo
- **Tipografia:** Inter (system fonts)
- **Espaçamento:** Sistema baseado em 4px (Tailwind)
- **Componentes:** Cards, botões, modais, formulários
- **Responsividade:** Mobile-first approach

---

## 🤝 **Contribuição**

### **Como Contribuir**

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Commit**

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona testes
chore: tarefas de manutenção
```

### **Issues e Bugs**

- 🐛 **Bug Reports** - Use o template de issue
- 💡 **Feature Requests** - Descreva a funcionalidade desejada
- 📚 **Documentação** - Melhorias na documentação
- 🎨 **UI/UX** - Sugestões de interface

---

## 📜 **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 **Autor**

**Pet Lov Development Team** 🐾

- 📧 **Email:** contato@petlov.com.br
- 🌐 **Website:** [www.petlov.com.br](https://petlov.com.br)
- 💼 **LinkedIn:** [Pet Lov](https://linkedin.com/company/petlov)

---

## 🙏 **Agradecimentos**

- **React Team** - Pela incrível biblioteca
- **Tailwind CSS** - Pelo framework CSS utilitário
- **Vite** - Pela ferramenta de build rápida
- **Comunidade Open Source** - Por todas as inspirações

---

## 📞 **Suporte**

Precisa de ajuda? Entre em contato:

- 📧 **Email:** suporte@petlov.com.br
- 💬 **Discord:** [Pet Lov Community](https://discord.gg/petlov)
- 📱 **WhatsApp:** (11) 99999-9999
- 📍 **Endereço:** São Paulo, SP - Brasil

---

<div align="center">

### 🐾 **Feito com ❤️ para conectar pets e famílias**

**⭐ Se você gostou do projeto, deixe uma estrela!**

[🏠 Home](/) • [🐾 Ver Pets](/pets) • [📋 Adotar](/questionnaire) • [🔧 Admin](/admin)

---

_Pet Lov © 2025 - Todos os direitos reservados_

</div>
