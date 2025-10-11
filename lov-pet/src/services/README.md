# 📁 Services - Documentação

> **Pasta destinada aos serviços de integração do projeto Pet Lov**

## 🎯 **Propósito**

A pasta `services/` é responsável por centralizar toda a lógica de comunicação externa do projeto, incluindo:

- Integrações com APIs REST
- Comunicação com banco de dados
- Serviços de autenticação
- Upload e manipulação de arquivos
- Configurações de bibliotecas externas

---

## 📋 **Status Atual**

**Estado:** Vazia (preparada para expansão futura)  
**Objetivo:** Migração de localStorage para backend completo  
**Prioridade:** Estrutura planejada para crescimento do projeto

---

## 🏗️ **Estrutura Futura Planejada**

```
src/services/
├── api.js              # Configuração base do cliente HTTP (Axios/Fetch)
├── petService.js       # CRUD completo de pets
├── userService.js      # Gerenciamento de usuários e perfis
├── authService.js      # Autenticação e autorização
├── uploadService.js    # Upload de imagens dos pets
├── adoptionService.js  # Processo de adoção
├── database.js         # Configurações de conexão com DB
└── utils.js           # Utilitários para tratamento de dados
```

---

## 🔧 **Serviços Planejados**

### **api.js** - Cliente HTTP Base

```javascript
// Configuração centralizada para todas as requisições
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptadores para token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### **petService.js** - Gerenciamento de Pets

```javascript
// Substituirá as operações com localStorage
import api from "./api";

export const petService = {
  // Buscar todos os pets
  getAllPets: async () => {
    const response = await api.get("/pets");
    return response.data;
  },

  // Buscar pet por ID
  getPetById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  // Criar novo pet
  createPet: async (petData) => {
    const response = await api.post("/pets", petData);
    return response.data;
  },

  // Atualizar pet
  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  // Deletar pet
  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },

  // Filtrar pets por status
  getPetsByStatus: async (status) => {
    const response = await api.get(`/pets?status=${status}`);
    return response.data;
  },
};
```

### **authService.js** - Autenticação

```javascript
// Sistema de login e registro
import api from "./api";

export const authService = {
  // Login de usuário
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  },

  // Registro de usuário
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Verificar se está logado
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
```

### **uploadService.js** - Upload de Arquivos

```javascript
// Upload de imagens dos pets
import api from "./api";

export const uploadService = {
  // Upload de foto do pet
  uploadPetImage: async (file, petId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("petId", petId);

    const response = await api.post("/upload/pet-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  },

  // Upload múltiplas imagens
  uploadMultipleImages: async (files, petId) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("petId", petId);

    const response = await api.post("/upload/pet-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrls;
  },
};
```

---

## 🔄 **Plano de Migração**

### **Fase 1: Preparação**

- [x] Criar estrutura de pastas
- [x] Documentar arquitetura planejada
- [ ] Configurar variáveis de ambiente

### **Fase 2: Backend Integration**

- [ ] Implementar api.js base
- [ ] Migrar petService.js do localStorage
- [ ] Implementar authService.js
- [ ] Configurar uploadService.js

### **Fase 3: Banco de Dados**

- [ ] Configurar conexão com DB
- [ ] Implementar migrations
- [ ] Adicionar validações de dados
- [ ] Implementar cache e otimizações

### **Fase 4: Funcionalidades Avançadas**

- [ ] Sistema de notificações
- [ ] Relatórios e analytics
- [ ] Integração com APIs externas
- [ ] Sistema de backup

---

## 🛠️ **Tecnologias Planejadas**

### **Cliente HTTP**

- **Axios** - Para requisições HTTP robustas
- **SWR** ou **React Query** - Cache e sincronização de dados

### **Autenticação**

- **JWT** - Tokens de acesso
- **bcrypt** - Hash de senhas (backend)
- **Refresh Tokens** - Renovação automática

### **Upload de Arquivos**

- **Multer** - Middleware de upload (backend)
- **Cloudinary** ou **AWS S3** - Armazenamento de imagens
- **Sharp** - Processamento de imagens

### **Banco de Dados**

- **PostgreSQL** ou **MongoDB** - Banco principal
- **Prisma** ou **Mongoose** - ORM/ODM
- **Redis** - Cache de sessões

---

## 📝 **Convenções de Código**

### **Nomenclatura**

- Arquivos: `camelCase.js` (ex: `petService.js`)
- Funções: `camelCase` (ex: `getAllPets`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)

### **Estrutura de Retorno**

```javascript
// Padrão de resposta para todas as funções
{
  success: true,
  data: {...},
  message: "Operação realizada com sucesso",
  error: null
}
```

### **Tratamento de Erros**

```javascript
// Padrão para captura de erros
try {
  const response = await api.get("/pets");
  return {
    success: true,
    data: response.data,
    message: "Pets carregados com sucesso",
  };
} catch (error) {
  return {
    success: false,
    data: null,
    message: "Erro ao carregar pets",
    error: error.message,
  };
}
```

---

## 🚀 **Como Usar (Futuro)**

### **Em Componentes React**

```javascript
import { petService } from "../services/petService";
import { useEffect, useState } from "react";

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      const result = await petService.getAllPets();
      if (result.success) {
        setPets(result.data);
      }
      setLoading(false);
    };

    loadPets();
  }, []);

  // Resto do componente...
};
```

---

## 📋 **Checklist para Implementação**

### **Configuração Inicial**

- [ ] Instalar dependências (axios, etc.)
- [ ] Configurar variáveis de ambiente
- [ ] Criar arquivo de configuração da API

### **Desenvolvimento**

- [ ] Implementar cada service seguindo os padrões
- [ ] Criar testes unitários para cada função
- [ ] Documentar cada função com JSDoc

### **Integração**

- [ ] Substituir localStorage gradualmente
- [ ] Testar todas as funcionalidades
- [ ] Implementar tratamento de erro global

### **Deploy**

- [ ] Configurar variáveis de produção
- [ ] Testar em ambiente de homologação
- [ ] Monitorar performance e logs

---

## 🎯 **Próximos Passos**

1. **Definir stack do backend** (Node.js, Python, etc.)
2. **Escolher banco de dados** (PostgreSQL, MongoDB)
3. **Implementar API REST** no backend
4. **Migrar funcionalidades** uma por vez
5. **Implementar testes** e documentação

---

**Criado em:** 26/09/2025  
**Versão:** 1.0  
**Autor:** Pet Lov Development Team  
**Status:** 📋 Planejamento
