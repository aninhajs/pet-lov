# Sistema de Gerenciamento de Vacinas - Pet Lov

## 📋 Visão Geral

Sistema completo de gerenciamento de cartões de vacina para pets, integrado ao backend com PostgreSQL através do Prisma ORM. Permite o cadastro em lote de vacinas, visualização do histórico e exibição em tempo real no dashboard administrativo.

---

## 🎯 Funcionalidades Implementadas

### 1. **Backend - API REST**

#### **Modelo de Dados (Prisma Schema)**

```prisma
model Vaccine {
  id                String   @id @default(cuid())
  pet_id            String
  nome_vacina       String
  data_aplicacao    DateTime
  data_revacina     DateTime?
  lote              String?
  fabricante        String?
  veterinario       String?
  observacoes       String?
  data_cadastro     DateTime @default(now())
  data_atualizacao  DateTime @updatedAt

  pet               Pet      @relation(fields: [pet_id], references: [id], onDelete: Cascade)

  @@map("vaccines")
}
```

#### **Controller - vacinasController.js**

Localização: `backend/src/controllers/vacinasController.js`

**Funções Implementadas:**

1. **`listarVacinas`** - GET `/api/admin/cartao-vacina`

   - Lista todas as vacinas ou filtra por pet_id
   - Paginação (page, limit)
   - Inclui dados do pet relacionado
   - Ordenação por data de aplicação (desc)

2. **`buscarVacinasPorPet`** - GET `/api/admin/cartao-vacina/pet/:pet_id`

   - Busca histórico completo de vacinas de um pet específico
   - Valida existência do pet
   - Retorna dados do pet junto com as vacinas

3. **`cadastrarVacina`** - POST `/api/admin/cartao-vacina`

   - Cadastra uma única vacina
   - Validações: pet_id, nome_vacina, data_aplicacao
   - Converte datas para formato DateTime

4. **`cadastrarVacinasEmLote`** - POST `/api/admin/cartao-vacina/lote`

   - Cadastra múltiplas vacinas de uma vez
   - Validações em batch
   - Transação atômica com Promise.all
   - Retorna todas as vacinas criadas

5. **`atualizarVacina`** - PUT `/api/admin/cartao-vacina/:id`

   - Atualiza dados de uma vacina existente
   - Validação de existência
   - Campos opcionais

6. **`deletarVacina`** - DELETE `/api/admin/cartao-vacina/:id`
   - Remove uma vacina do histórico
   - Validação de existência

#### **Rotas Protegidas**

Localização: `backend/src/routes/private/cartaoVacina.js`

```javascript
router.get("/", listarVacinas);
router.get("/pet/:pet_id", buscarVacinasPorPet);
router.post("/", cadastrarVacina);
router.post("/lote", cadastrarVacinasEmLote);
router.put("/:id", atualizarVacina);
router.delete("/:id", deletarVacina);
```

**Middlewares Aplicados:**

- `authenticateToken` - Validação de JWT
- `requireAdmin` - Permissão de administrador

---

### 2. **Frontend - React**

#### **Service Layer - VacinaServices.js**

Localização: `Abrece/src/services/VacinaServices.js`

**Métodos Disponíveis:**

```javascript
VacinaServices.getAllVacinas(params); // Lista todas
VacinaServices.getVacinasPorPet(petId); // Busca por pet
VacinaServices.createVacina(vacinaData); // Cria uma
VacinaServices.createVacinasLote(petId, vacinas); // Cria múltiplas
VacinaServices.updateVacina(id, vacinaData); // Atualiza
VacinaServices.deleteVacina(id); // Deleta
```

**Estrutura de Resposta:**

```javascript
{
  success: true/false,
  data: {...},
  message: "..."
}
```

#### **Componente - CartaoVacina.jsx**

Localização: `Abrece/src/pages/(protegido)/CartaoVacina.jsx`

**Características:**

- **Seleção de Pet**: Dropdown com pets do banco de dados
- **Formulário Dinâmico**: Adicionar/remover múltiplas vacinas
- **Campos por Vacina**:
  - Nome da Vacina (obrigatório)
  - Data de Aplicação (obrigatório)
  - Data de Revacinação (opcional)
- **Validações**:
  - Pet deve ser selecionado
  - Pelo menos uma vacina válida
  - Nome e data obrigatórios
- **Feedback Visual**: Toast de sucesso/erro
- **Integração Backend**: Envia dados via API em lote

**Fluxo de Cadastro:**

```
1. Usuário seleciona o pet
2. Preenche dados das vacinas
3. Click em "Cadastrar Vacina(s)"
4. Dados validados no frontend
5. Enviados para /api/admin/cartao-vacina/lote
6. Backend valida e salva no PostgreSQL
7. Feedback visual exibido
8. Formulário resetado
```

#### **Dashboard - AdminDashboard.jsx**

Localização: `Abrece/src/pages/(protegido)/AdminDashboard.jsx`

**Seção "Vacinas Recentes":**

- **Busca em Tempo Real**: Filtra vacinas por nome do pet
- **Exibição**:
  - Nome do pet
  - Nome da vacina
  - Data de aplicação
  - Data de revacinação (se houver)
- **Limite**: Mostra as 2 vacinas mais recentes
- **Integração**: Busca do banco de dados via API
- **Link Direto**: Acesso rápido ao cadastro de vacinas

---

## 🔄 Fluxo de Dados Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    CADASTRO DE VACINAS                       │
└─────────────────────────────────────────────────────────────┘

1. CartaoVacina.jsx (Frontend)
   ↓
   ├─ Busca pets: PetServices.getAllPets()
   ├─ Usuário preenche formulário
   └─ Submit: VacinaServices.createVacinasLote(petId, vacinas)
      ↓
2. VacinaServices.js
   ↓
   └─ POST /api/admin/cartao-vacina/lote
      ↓
3. cartaoVacina.js (Routes)
   ↓
   ├─ authenticateToken (middleware)
   ├─ requireAdmin (middleware)
   └─ cadastrarVacinasEmLote (controller)
      ↓
4. vacinasController.js
   ↓
   ├─ Valida pet_id
   ├─ Valida array de vacinas
   ├─ Verifica se pet existe
   ├─ Valida cada vacina
   └─ prisma.vaccine.create() em batch
      ↓
5. PostgreSQL Database
   ↓
   └─ Vacinas salvas na tabela "vaccines"

┌─────────────────────────────────────────────────────────────┐
│                  EXIBIÇÃO NO DASHBOARD                       │
└─────────────────────────────────────────────────────────────┘

1. AdminDashboard.jsx
   ↓
   └─ useEffect: VacinaServices.getAllVacinas({ limit: 10 })
      ↓
2. VacinaServices.js
   ↓
   └─ GET /api/admin/cartao-vacina?limit=10
      ↓
3. cartaoVacina.js (Routes)
   ↓
   └─ listarVacinas (controller)
      ↓
4. vacinasController.js
   ↓
   └─ prisma.vaccine.findMany({
        include: { pet: true },
        orderBy: { data_aplicacao: "desc" }
      })
      ↓
5. PostgreSQL Database
   ↓
6. Resposta JSON
   ↓
7. AdminDashboard.jsx
   ↓
   └─ Formata e exibe na seção "Vacinas Recentes"
```

---

## 🛠️ Tecnologias Utilizadas

### **Backend**

- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT (autenticação)
- bcryptjs (hash de senhas)

### **Frontend**

- React 18+
- React Router v6
- Axios (HTTP client)
- Tailwind CSS
- Vite (build tool)

---

## 📁 Estrutura de Arquivos

```
pet-lov/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma (modelo Vaccine)
│   └── src/
│       ├── controllers/
│       │   └── vacinasController.js (✨ NOVO)
│       ├── routes/
│       │   └── private/
│       │       └── cartaoVacina.js (🔄 ATUALIZADO)
│       └── middleware/
│           └── auth.js (authenticateToken, requireAdmin)
│
└── Abrece/ (Frontend)
    └── src/
        ├── services/
        │   └── VacinaServices.js (✨ NOVO)
        └── pages/
            └── (protegido)/
                ├── CartaoVacina.jsx (🔄 ATUALIZADO)
                └── AdminDashboard.jsx (🔄 ATUALIZADO)
```

---

## 🔐 Autenticação e Segurança

### **Middleware de Autenticação**

```javascript
authenticateToken; // Valida JWT token
requireAdmin; // Verifica tipo de usuário = "admin"
```

### **Proteção de Rotas**

Todas as rotas de vacinas estão protegidas:

- Requer token JWT válido no header
- Requer permissão de administrador
- Validações de dados no backend
- Sanitização de inputs

### **Token JWT**

- Armazenado em localStorage no frontend
- Enviado no header `Authorization: Bearer <token>`
- Validado em cada requisição

---

## 🎨 Interface do Usuário

### **Cartão de Vacina (CartaoVacina.jsx)**

**Design:**

- Background: `#f4f0e4`
- Bordas: `#4a4a4a` com shadow
- Gradientes em botões
- Toast flutuante para feedback
- Layout responsivo

**Recursos UX:**

- Adicionar múltiplas vacinas dinamicamente
- Remover vacinas antes de enviar
- Validação em tempo real
- Scroll automático para topo após submit
- Desabilita botão se pet não selecionado

### **Dashboard (AdminDashboard.jsx)**

**Seção de Vacinas:**

- Cards com borda verde (`border-green-600`)
- Ícones: 🐾 (pet), 💉 (vacina), 📅 (data), 🔔 (revacinação)
- Busca em tempo real por nome do pet
- Link direto para cadastro de novas vacinas
- Mensagem quando não há vacinas

---

## 📊 Formato de Dados

### **Envio para API (Frontend → Backend)**

```json
{
  "pet_id": "clx1abc123...",
  "vacinas": [
    {
      "nome_vacina": "V10",
      "data_aplicacao": "2025-11-16",
      "data_revacina": "2026-11-16"
    },
    {
      "nome_vacina": "Antirrábica",
      "data_aplicacao": "2025-11-16",
      "data_revacina": null
    }
  ]
}
```

### **Resposta da API (Backend → Frontend)**

```json
{
  "success": true,
  "data": {
    "vacinasCriadas": [
      {
        "id": "clx2xyz789...",
        "pet_id": "clx1abc123...",
        "nome_vacina": "V10",
        "data_aplicacao": "2025-11-16T00:00:00.000Z",
        "data_revacina": "2026-11-16T00:00:00.000Z",
        "lote": null,
        "fabricante": null,
        "veterinario": null,
        "observacoes": null,
        "data_cadastro": "2025-11-16T14:30:00.000Z",
        "data_atualizacao": "2025-11-16T14:30:00.000Z"
      }
    ],
    "total": 2
  },
  "message": "2 vacina(s) cadastrada(s) com sucesso"
}
```

---

## 🚀 Como Usar

### **1. Acessar o Cartão de Vacina**

```
/admin/cartao-vacina
```

### **2. Cadastrar Vacinas**

1. Selecionar o pet no dropdown
2. Preencher nome da vacina
3. Selecionar data de aplicação
4. (Opcional) Selecionar data de revacinação
5. Click em "+ Adicionar outra vacina" se necessário
6. Click em "Cadastrar Vacina(s)"

### **3. Visualizar no Dashboard**

```
/admin
```

- Seção "Vacinas Recentes" exibe as 2 últimas
- Use o campo de busca para filtrar por nome do pet

---

## 📝 Validações Implementadas

### **Frontend**

- ✅ Pet deve ser selecionado
- ✅ Pelo menos uma vacina com nome e data
- ✅ Nome da vacina não pode estar vazio
- ✅ Data de aplicação obrigatória
- ✅ Data de revacinação opcional

### **Backend**

- ✅ pet_id obrigatório
- ✅ vacinas deve ser array não vazio
- ✅ Pet deve existir no banco de dados
- ✅ Cada vacina deve ter nome_vacina e data_aplicacao
- ✅ Conversão de datas para DateTime
- ✅ Tratamento de erros com mensagens claras

---

## 🐛 Tratamento de Erros

### **Erros Comuns e Respostas**

| Erro                 | Status | Mensagem                                            |
| -------------------- | ------ | --------------------------------------------------- |
| Pet não selecionado  | 400    | "Campos obrigatórios: pet_id e array de vacinas"    |
| Array vazio          | 400    | "Campos obrigatórios: pet_id e array de vacinas"    |
| Pet não existe       | 404    | "Pet não encontrado"                                |
| Vacina sem nome/data | 400    | "Cada vacina deve ter nome_vacina e data_aplicacao" |
| Erro no banco        | 500    | "Erro ao cadastrar vacinas em lote"                 |
| Token inválido       | 401    | "Token inválido ou expirado"                        |
| Sem permissão        | 403    | "Acesso negado. Apenas administradores"             |

---

## 🔍 Logs e Debug

### **Backend - Console Logs**

```javascript
console.log(
  `✅ ${vacinas.length} vacina(s) cadastrada(s) para pet ${pet.nome}`
);
console.error("❌ Erro ao cadastrar vacinas em lote:", error);
```

### **Frontend - Console Logs**

```javascript
console.log("✅ Vacinas carregadas:", vacinasFormatadas.length);
console.error("❌ Erro ao cadastrar vacinas em lote:", error);
```

---

## 📈 Melhorias Futuras

### **Backend**

- [ ] Adicionar campo de busca por nome de vacina
- [ ] Filtro por data de revacinação próxima
- [ ] Notificações automáticas de revacinação
- [ ] Upload de comprovante de vacinação (PDF/imagem)
- [ ] Histórico de edições

### **Frontend**

- [ ] Modo de edição de vacinas existentes
- [ ] Visualização completa do histórico por pet
- [ ] Exportar cartão de vacina em PDF
- [ ] Alertas visuais para vacinas próximas do vencimento
- [ ] Calendário de vacinação
- [ ] Gráficos e estatísticas

---

## 👥 Responsável

Sistema desenvolvido para o projeto **Abrace Uma Causa Animal** - Pet Lov

---

## 📅 Data de Implementação

16 de Novembro de 2025

---

## ✨ Status do Projeto

**Status:** ✅ **COMPLETO E FUNCIONAL**

- ✅ Backend implementado e testado
- ✅ Frontend integrado com backend
- ✅ Banco de dados configurado
- ✅ Autenticação e autorização funcionando
- ✅ CRUD completo de vacinas
- ✅ Dashboard exibindo dados em tempo real
- ✅ Validações e tratamento de erros
- ✅ Interface responsiva e amigável

---

## 🎉 Funcionalidades em Destaque

1. **Cadastro em Lote**: Registre múltiplas vacinas de uma vez
2. **Busca Inteligente**: Filtre vacinas por nome do pet
3. **Histórico Completo**: Veja todo o histórico de vacinação
4. **Dashboard em Tempo Real**: Vacinas aparecem instantaneamente
5. **Validação Robusta**: Garante integridade dos dados
6. **UX Amigável**: Interface intuitiva e responsiva
7. **Segurança**: Rotas protegidas com JWT e permissões

---

**Documentação gerada em:** 16 de Novembro de 2025
