# 🚀 Pet Lov Backend - API Completa

Sistema backend para gerenciamento de adoção de pets com APIs REST completas.

## 🛠️ Tecnologias

- **Node.js** + Express.js
- **Prisma** ORM
- **PostgreSQL** (Supabase)
- **JWT** Authentication
- **Express Validator**
- **Helmet** + **CORS** (Segurança)

## 📊 Banco de Dados

### 6 Tabelas Principais:

- **users** - Usuários administradores
- **pets** - Animais para adoção
- **pet_images** - Imagens dos pets
- **adoption_candidates** - Candidatos
- **pet_interests** - Interesses em pets
- **adoptions** - Adoções finalizadas

## 🎯 APIs Implementadas

### 🐕 **Pets API** (`/api/pets`)

- `GET /api/pets` - Listar pets (filtros: tipo, status, porte)
- `GET /api/pets/:id` - Pet específico
- `POST /api/pets` - Cadastrar pet (Admin)
- `PUT /api/pets/:id` - Atualizar pet (Admin)
- `PATCH /api/pets/:id/status` - Alterar status (Admin)
- `DELETE /api/pets/:id` - Remover pet (Admin)
- `GET /api/pets/stats` - Estatísticas (Admin)

### 👥 **Candidatos API** (`/api/candidatos`)

- `GET /api/candidatos` - Listar candidatos (Admin)
- `POST /api/candidatos` - Formulário de adoção (Público)
- `PATCH /api/candidatos/:id/status` - Aprovar/Rejeitar (Admin)
- `GET /api/candidatos/stats` - Estatísticas (Admin)

### ❤️ **Adoções API** (`/api/adocoes`)

- `GET /api/adocoes` - Listar adoções (Admin)
- `POST /api/adocoes` - Finalizar adoção (Admin)
- `PATCH /api/adocoes/:id/status` - Alterar status (Admin)
- `GET /api/adocoes/stats` - Estatísticas (Admin)

### 🔐 **Auth API** (`/api/auth`)

- `POST /api/auth/login` - Login admin
- `POST /api/auth/register` - Cadastrar admin

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Ambiente

```bash
# Copie e configure o .env
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

### 3. Configurar Banco

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar schema ao banco
npm run db:push
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📋 Scripts Disponíveis

```bash
npm run dev          # Servidor desenvolvimento
npm start            # Servidor produção
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Aplicar schema
npm run db:migrate   # Criar migration
npm run db:studio    # Abrir Prisma Studio
```

## ⚙️ Configuração (.env)

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="sua-chave-secreta"

# Supabase
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_KEY="..."

# Server
PORT=3001
NODE_ENV=development
```

## 🔒 Autenticação

- **JWT** para autenticação de admins
- **Middleware** de proteção de rotas
- **Validações** robustas em todos endpoints
- **Rate limiting** e segurança com Helmet

## 🌟 Funcionalidades

### ✅ Implementado:

- ✅ CRUD completo de pets
- ✅ Sistema de candidaturas
- ✅ Fluxo de adoção completo
- ✅ Múltiplas adoções por candidato
- ✅ Upload de imagens (preparado)
- ✅ Paginação em listagens
- ✅ Filtros avançados
- ✅ Estatísticas para dashboard
- ✅ Validações em tempo real
- ✅ Transações para consistência

### 🔄 Próximas funcionalidades:

- 📧 Sistema de email
- 📱 Notificações push
- 📊 Relatórios avançados
- 🧪 Testes automatizados

## 🏗️ Arquitetura

```
src/
├── controllers/     # Lógica de negócio
├── middleware/      # Autenticação e validações
├── routes/          # Definição das rotas
├── lib/            # Configurações (Prisma)
└── server.js       # Servidor principal
```

## 📚 Documentação

- [API_COMPLETA.md](./API_COMPLETA.md) - Documentação completa das APIs
- [PETS_API.md](./PETS_API.md) - Guia específico da API de pets
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup do Supabase

## 🎯 Endpoints de Teste

```bash
# Health check
GET http://localhost:3001/api/health

# Listar pets
GET http://localhost:3001/api/pets

# Formulário de adoção
POST http://localhost:3001/api/candidatos
```

---

**Desenvolvido com ❤️ por Ana (@aninhajs)**

Pet Lov Backend - Conectando corações e patinhas! 🐕❤️🐱
