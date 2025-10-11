# 🚀 Backend Pet Lov - Documentação Completa

## 📋 Índice

- [1. Introdução](#1-introdução)
- [2. Estrutura do Projeto](#2-estrutura-do-projeto)
- [3. Dependências](#3-dependências)
- [4. Configuração](#4-configuração)
- [5. Banco de Dados](#5-banco-de-dados)
- [6. API Endpoints](#6-api-endpoints)
- [7. Próximos Passos](#7-próximos-passos)

---

## 1. Introdução

### 🎯 Objetivo

Backend para o sistema de adoção de pets Pet Lov, fornecendo APIs REST para:

- Cadastro e gestão de pets
- Sistema de questionários para adotantes
- Autenticação e autorização
- Upload e gerenciamento de imagens

### 🏗️ Arquitetura

```
Frontend (React) ←→ Backend (Node.js + Express) ←→ Banco de Dados (PostgreSQL)
     ↓                        ↓                          ↓
  Interface do usuário    APIs REST + ORM           Persistência de dados
```

---

## 2. Estrutura do Projeto

### 📁 Organização de Pastas

```
backend/
├── 📄 package.json           # Configurações do projeto Node.js
├── 📄 package-lock.json      # Lock das versões das dependências
├── 📄 .env                   # Variáveis de ambiente (não commitado)
├── 📄 .gitignore             # Arquivos a serem ignorados pelo Git
├── 📁 node_modules/          # Dependências instaladas
├── 📁 prisma/                # Configurações do ORM
│   ├── schema.prisma         # Schema do banco de dados
│   └── migrations/           # Histórico de alterações no DB
├── 📁 src/                   # Código fonte
│   ├── 📄 server.js          # Arquivo principal do servidor
│   ├── 📁 routes/            # Definição das rotas da API
│   │   ├── pets.js           # Rotas dos pets
│   │   ├── adoptants.js      # Rotas dos adotantes
│   │   ├── auth.js           # Rotas de autenticação
│   │   └── upload.js         # Rotas de upload de imagens
│   ├── 📁 controllers/       # Lógica de negócio
│   │   ├── petController.js
│   │   ├── adoptantController.js
│   │   └── authController.js
│   ├── 📁 middleware/        # Middlewares personalizados
│   │   ├── auth.js           # Verificação de autenticação
│   │   └── validation.js     # Validação de dados
│   ├── 📁 lib/               # Utilitários e configurações
│   │   └── prisma.js         # Cliente do Prisma
│   └── 📁 utils/             # Funções auxiliares
└── 📁 uploads/               # Pasta para imagens (temporária)
```

---

## 3. Dependências

### 🔧 Dependências Principais

#### **Express** `^5.1.0`

- **Função:** Framework web para Node.js
- **Por que usar:** Criar rotas HTTP (GET, POST, PUT, DELETE)
- **Exemplo de uso:**
  ```javascript
  app.get("/api/pets", (req, res) => {
    // Listar todos os pets
  });
  ```

#### **Prisma** `^5.x.x` (a instalar)

- **Função:** ORM (Object-Relational Mapping)
- **Por que usar:** Facilitar interação com banco de dados
- **Vantagens:**
  - Type-safe (tipagem automática)
  - Migrations automáticas
  - Query builder intuitivo
- **Exemplo de uso:**
  ```javascript
  const pets = await prisma.pet.findMany({
    where: { status: "disponivel" },
  });
  ```

#### **CORS** `^2.x.x` (a instalar)

- **Função:** Cross-Origin Resource Sharing
- **Por que usar:** Permitir que frontend acesse o backend
- **Problema sem CORS:** Browser bloqueia requisições entre domínios diferentes
- **Exemplo de uso:**
  ```javascript
  app.use(
    cors({
      origin: "http://localhost:3000", // Frontend React
    })
  );
  ```

#### **Dotenv** `^16.x.x` (a instalar)

- **Função:** Carregamento de variáveis de ambiente
- **Por que usar:** Segurança (senhas, URLs, chaves secretas)
- **Exemplo de uso:**

  ```javascript
  // .env
  DATABASE_URL = "postgresql://usuario:senha@localhost:5432/petlov";
  JWT_SECRET = "minha_chave_secreta";

  // código
  process.env.DATABASE_URL;
  ```

### 🛠️ Dependências de Desenvolvimento (DevDependencies)

#### **Nodemon** (alternativa: --watch nativo do Node)

- **Função:** Reiniciar servidor automaticamente quando código muda
- **Uso:** `npm run dev`

---

## 4. Configuração

### 📄 Package.json Explicado

```json
{
  "name": "pet-lov-backend", // Nome do projeto
  "version": "1.0.0", // Versão atual
  "type": "module", // Usar ES6 imports (import/export)
  "main": "src/server.js", // Arquivo principal
  "scripts": {
    "dev": "node --watch src/server.js", // Desenvolvimento com auto-reload
    "start": "node src/server.js" // Produção
  },
  "dependencies": {
    // Bibliotecas necessárias
    "express": "^5.1.0"
  }
}
```

### 🔒 Variáveis de Ambiente (.env)

```bash
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/petlov"

# Servidor
PORT=5000
NODE_ENV=development

# Autenticação
JWT_SECRET="sua_chave_secreta_super_segura"
JWT_EXPIRES_IN="7d"

# Upload de Imagens
CLOUDINARY_CLOUD_NAME="seu_cloudinary"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

---

## 5. Banco de Dados

### 🗄️ Schema do Banco (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Pet {
  id                    String   @id @default(cuid())
  nome                  String
  tipo                  String   // "cão", "gato"
  idade                 String
  sexo                  String   // "macho", "fêmea"
  porte                 String   // "pequeno", "médio", "grande"
  cor                   String?
  peso                  String?
  imagem                String?
  descricao             String?
  temperamento          String?
  historia              String?
  necessidadesEspeciais String?
  castrado              Boolean  @default(false)
  vacinado              Boolean  @default(false)
  vermifugado           Boolean  @default(false)
  status                String   @default("disponivel") // "disponivel", "em_processo", "adotado"
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // Relacionamentos
  adoptant              Adoptant? @relation(fields: [adoptantId], references: [id])
  adoptantId            String?

  @@map("pets")
}

model Adoptant {
  id                   String   @id @default(cuid())
  nome                 String
  email                String   @unique
  telefone             String
  endereco             String
  tipoMoradia          String   // "casa", "apartamento"
  experienciaPets      String
  motivacao            String
  disponibilidadeTempo String
  status               String   @default("pendente") // "pendente", "aprovado", "rejeitado"
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  // Relacionamentos
  pets                 Pet[]
  user                 User?    @relation(fields: [userId], references: [id])
  userId               String?

  @@map("adoptants")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String     // Hash bcrypt
  role      String     @default("user") // "admin", "user"
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Relacionamentos
  adoptant  Adoptant?

  @@map("users")
}
```

### 🔄 Comandos Prisma Importantes

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar e aplicar migration
npx prisma migrate dev --name init

# Visualizar banco de dados
npx prisma studio

# Reset do banco (desenvolvimento)
npx prisma migrate reset
```

---

## 6. API Endpoints

### 🐾 Pets

```
GET    /api/pets              # Listar todos os pets
GET    /api/pets/:id          # Buscar pet específico
POST   /api/pets              # Cadastrar novo pet
PUT    /api/pets/:id          # Atualizar pet
DELETE /api/pets/:id          # Deletar pet
PATCH  /api/pets/:id/status   # Atualizar status do pet
```

### 👥 Adotantes

```
GET    /api/adoptants         # Listar adotantes (admin)
POST   /api/adoptants         # Cadastrar questionário
PUT    /api/adoptants/:id     # Atualizar dados
PATCH  /api/adoptants/:id/status # Aprovar/rejeitar
```

### 🔐 Autenticação

```
POST   /api/auth/register     # Cadastrar usuário
POST   /api/auth/login        # Fazer login
GET    /api/auth/me           # Dados do usuário logado
POST   /api/auth/logout       # Logout
```

### 📤 Upload

```
POST   /api/upload/image      # Upload de imagem
DELETE /api/upload/image/:id  # Deletar imagem
```

### 📊 Exemplo de Resposta da API

```json
{
  "success": true,
  "data": {
    "id": "clq1234567890",
    "nome": "Luna",
    "tipo": "cão",
    "idade": "2 anos",
    "status": "disponivel",
    "imagem": "https://cloudinary.com/image/upload/v1234/pets/luna.jpg"
  },
  "message": "Pet cadastrado com sucesso"
}
```

---

## 7. Próximos Passos

### ✅ Já Feito

- [x] Inicialização do projeto Node.js
- [x] Instalação do Express
- [x] Estrutura básica de pastas

### 🔄 Em Andamento

- [ ] Instalar dependências restantes (CORS, Dotenv, Prisma)
- [ ] Criar servidor Express básico
- [ ] Configurar Prisma
- [ ] Criar primeiro endpoint de teste

### 📋 Próximas Etapas

1. **Configuração Inicial**

   - Instalar CORS e Dotenv
   - Criar servidor Express básico
   - Testar se servidor está rodando

2. **Setup do Prisma**

   - Instalar Prisma CLI
   - Configurar schema do banco
   - Conectar com PostgreSQL

3. **Primeiros Endpoints**

   - GET /api/pets (listar pets)
   - POST /api/pets (cadastrar pet)
   - Testar com dados mock

4. **Integração Frontend**

   - Substituir localStorage por API calls
   - Implementar loading states
   - Error handling

5. **Funcionalidades Avançadas**
   - Sistema de autenticação
   - Upload de imagens
   - Validações de dados
   - Deploy em produção

---

## 🎯 Objetivo Final

Transformar o atual sistema que usa `localStorage` em uma aplicação real com:

- **Backend robusto** com Node.js + Express
- **Banco de dados** PostgreSQL com Prisma
- **APIs REST** completas e documentadas
- **Autenticação** segura
- **Upload de imagens** para cloud
- **Deploy** em produção

---

_📝 Esta documentação será atualizada conforme o desenvolvimento progride._
