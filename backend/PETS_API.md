# 🐕 API dos Pets - Guia de Uso

## 🚀 Como Começar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Ambiente
```bash
# Copie o arquivo de exemplo
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

## 📋 Endpoints da API

### **🔍 Listar Pets**
```http
GET /api/pets
GET /api/pets?tipo=cao&status=disponivel&porte=medio&page=1&limit=10
```

**Filtros disponíveis:**
- `tipo`: cao, gato, outros
- `status`: disponivel, em_processo, adotado, indisponivel
- `porte`: pequeno, medio, grande
- `sexo`: macho, femea
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10, max: 50)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clpx1...",
      "nome": "Luna",
      "tipo": "gato",
      "idade": "2 anos",
      "porte": "pequeno",
      "sexo": "femea",
      "cor": "Branca e cinza",
      "peso": 3.5,
      "descricao": "Gatinha muito carinhosa...",
      "status": "disponivel",
      "imagens": [
        {
          "id": "img1...",
          "url_imagem": "https://...",
          "principal": true
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### **🐕 Buscar Pet por ID**
```http
GET /api/pets/:id
```

### **➕ Cadastrar Pet** (Admin)
```http
POST /api/pets
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Thor",
  "tipo": "cao",
  "idade": "3 anos",
  "porte": "grande",
  "sexo": "macho",
  "cor": "Dourado",
  "peso": 25.5,
  "descricao": "Cão muito dócil e brincalhão",
  "temperamento": "Calmo, sociável",
  "castrado": true,
  "vacinado": true,
  "vermifugado": true,
  "historia": "Resgatado das ruas...",
  "imagens": [
    {
      "url": "https://storage.supabase.co/...",
      "nome": "thor-principal.jpg"
    }
  ]
}
```

### **✏️ Atualizar Pet** (Admin)
```http
PUT /api/pets/:id
Authorization: Bearer {token}
```

### **🔄 Alterar Status** (Admin)
```http
PATCH /api/pets/:id/status
Authorization: Bearer {token}

{
  "status": "adotado"
}
```

### **🗑️ Deletar Pet** (Admin)
```http
DELETE /api/pets/:id
Authorization: Bearer {token}
```

### **📊 Estatísticas** (Admin)
```http
GET /api/pets/stats
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "disponiveis": 75,
    "em_processo": 15,
    "adotados": 10,
    "caes": 60,
    "gatos": 40
  }
}
```

## 🔐 Autenticação

### **Login**
```http
POST /api/auth/login

{
  "email": "admin@petlov.com",
  "senha": "123456"
}
```

### **Cadastrar Admin** (Desenvolvimento)
```http
POST /api/auth/register

{
  "nome": "Admin Pet Lov",
  "email": "admin@petlov.com",
  "senha": "123456",
  "telefone": "(11) 99999-9999"
}
```

## 🏗️ Estrutura do Projeto

```
backend/src/
├── controllers/
│   └── petsController.js    # Lógica de negócio dos pets
├── middleware/
│   ├── auth.js             # Autenticação JWT
│   └── validation.js       # Validação de dados
├── routes/
│   ├── pets.js            # Rotas dos pets
│   └── auth.js            # Rotas de autenticação
├── lib/
│   └── prisma.js          # Cliente do Prisma
└── server.js              # Servidor principal
```

## ✅ Próximos Passos

1. **Conectar com Supabase**: Configure as variáveis no `.env`
2. **Testar Endpoints**: Use Postman ou Insomnia
3. **Integrar Frontend**: Conecte com seu React
4. **Upload de Imagens**: Implementar com Supabase Storage

A API dos pets está pronta e organizada! 🎉