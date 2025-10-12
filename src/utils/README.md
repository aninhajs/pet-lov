# 🛠️ Utils - Documentação

> **Pasta destinada às funções utilitárias reutilizáveis do projeto Pet Lov**

## 🎯 **Propósito**

A pasta `utils/` centraliza **funções auxiliares** que podem ser reutilizadas em diferentes partes da aplicação, incluindo:

- Formatação de dados e textos
- Validações de formulários
- Manipulação de arrays e objetos
- Tratamento de arquivos e uploads
- Gerenciamento de cache e storage
- Constantes da aplicação

---

## 📋 **Status Atual**

**Estado:** Vazia (preparada para expansão futura)  
**Objetivo:** Funções utilitárias para integração com backend  
**Prioridade:** Estrutura planejada para crescimento do projeto

---

## 🏗️ **Estrutura Futura Planejada**

```
src/utils/
├── apiHelpers.js      # Tratamento de requisições/respostas da API
├── validators.js      # Validações de formulários e dados
├── formatters.js      # Formatação de dados (data, moeda, texto)
├── fileHelpers.js     # Upload e manipulação de arquivos
├── cache.js           # Sistema de cache local
├── constants.js       # Constantes e configurações da aplicação
├── storage.js         # Helpers para localStorage/sessionStorage
├── auth.js           # Utilitários de autenticação
├── petHelpers.js     # Funções específicas para manipulação de pets
└── index.js          # Exportações centralizadas
```

---

## 🔧 **Utilitários Planejados**

### **apiHelpers.js** - Tratamento de APIs

```javascript
// Padronização de respostas da API
export const formatApiResponse = (response) => {
  return {
    success: response.status >= 200 && response.status < 300,
    data: response.data,
    message: response.message || "Operação realizada com sucesso",
    status: response.status,
  };
};

// Tratamento centralizado de erros da API
export const handleApiError = (error) => {
  const errorMap = {
    401: "Sessão expirada. Faça login novamente.",
    403: "Acesso negado.",
    404: "Recurso não encontrado.",
    422: "Dados inválidos.",
    500: "Erro interno do servidor.",
  };

  const status = error.response?.status;
  const message =
    errorMap[status] || error.response?.data?.message || "Erro desconhecido";

  // Redirect para login se não autorizado
  if (status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }

  return {
    success: false,
    message,
    status,
    error: error.response?.data,
  };
};

// Preparação de dados para envio
export const prepareDataForApi = (data) => {
  // Remove campos vazios e formata dados
  const cleanData = Object.keys(data).reduce((acc, key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return cleanData;
};
```

### **validators.js** - Validações

```javascript
// Validação de email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: regex.test(email),
    message: regex.test(email) ? "" : "Email deve ter um formato válido",
  };
};

// Validação de telefone brasileiro
export const validatePhone = (phone) => {
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return {
    isValid: regex.test(phone),
    message: regex.test(phone)
      ? ""
      : "Telefone deve estar no formato (11) 99999-9999",
  };
};

// Validação completa de dados do pet
export const validatePetData = (pet) => {
  const errors = {};

  // Nome obrigatório
  if (!pet.nome?.trim()) {
    errors.nome = "Nome é obrigatório";
  } else if (pet.nome.trim().length < 2) {
    errors.nome = "Nome deve ter pelo menos 2 caracteres";
  }

  // Idade obrigatória e válida
  if (!pet.idade) {
    errors.idade = "Idade é obrigatória";
  } else if (isNaN(pet.idade) || pet.idade < 0 || pet.idade > 30) {
    errors.idade = "Idade deve ser um número entre 0 e 30";
  }

  // Tipo obrigatório
  if (!pet.tipo) {
    errors.tipo = "Tipo é obrigatório";
  } else if (!["cão", "gato"].includes(pet.tipo.toLowerCase())) {
    errors.tipo = 'Tipo deve ser "cão" ou "gato"';
  }

  // Status válido
  const validStatus = ["disponivel", "em_processo", "adotado"];
  if (pet.status && !validStatus.includes(pet.status)) {
    errors.status = "Status deve ser: disponível, em processo ou adotado";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validação de formulário de adoção
export const validateAdoptionForm = (data) => {
  const errors = {};

  if (!data.nome?.trim()) errors.nome = "Nome é obrigatório";
  if (!data.email?.trim()) errors.email = "Email é obrigatório";
  if (!data.telefone?.trim()) errors.telefone = "Telefone é obrigatório";
  if (!data.endereco?.trim()) errors.endereco = "Endereço é obrigatório";
  if (!data.tipoMoradia) errors.tipoMoradia = "Tipo de moradia é obrigatório";
  if (!data.experiencia)
    errors.experiencia = "Experiência com pets é obrigatória";

  // Validações específicas
  if (data.email && !validateEmail(data.email).isValid) {
    errors.email = "Email deve ter um formato válido";
  }

  if (data.telefone && !validatePhone(data.telefone).isValid) {
    errors.telefone = "Telefone deve estar no formato (11) 99999-9999";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

### **formatters.js** - Formatação de Dados

```javascript
// Formatação de dinheiro para Real brasileiro
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatação de data para padrão brasileiro
export const formatDate = (date, includeTime = false) => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Date(date).toLocaleDateString("pt-BR", options);
};

// Formatação de idade do pet
export const formatPetAge = (age) => {
  if (age === 0) return "Filhote (menos de 1 ano)";
  if (age === 1) return "1 ano";
  return `${age} anos`;
};

// Formatação de telefone
export const formatPhone = (phone) => {
  const numbers = phone.replace(/\D/g, "");

  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  }

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
      6
    )}`;
  }

  return phone;
};

// Formatação de status do pet
export const formatPetStatus = (status) => {
  const statusMap = {
    disponivel: "✅ Disponível",
    em_processo: "⏳ Em processo",
    adotado: "❤️ Adotado",
  };

  return statusMap[status] || status;
};

// Formatação de nome próprio
export const formatName = (name) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
```

### **fileHelpers.js** - Manipulação de Arquivos

```javascript
// Validação de arquivos de imagem
export const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de arquivo não permitido. Use: JPG, PNG ou WebP",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Arquivo muito grande. Tamanho máximo: 5MB",
    };
  }

  return { valid: true };
};

// Conversão de arquivo para Base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Redimensionamento de imagem
export const resizeImage = (
  file,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8
) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar e converter
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Geração de nome único para arquivo
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split(".").pop();

  return `pet_${timestamp}_${random}.${extension}`;
};
```

### **cache.js** - Sistema de Cache

```javascript
// Cache com TTL (Time To Live)
export const cacheData = (key, data, ttl = 3600000) => {
  // 1 hora padrão
  const item = {
    data,
    timestamp: Date.now(),
    ttl,
  };

  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Erro ao salvar no cache:", error);
    return false;
  }
};

// Recuperação de dados do cache
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const item = JSON.parse(cached);

    // Verificar se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error("Erro ao ler do cache:", error);
    return null;
  }
};

// Limpar cache expirado
export const clearExpiredCache = () => {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("cache_")
  );

  keys.forEach((key) => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      // Remove itens corrompidos
      localStorage.removeItem(key);
    }
  });
};

// Cache específico para pets
export const cachePets = (pets) => cacheData("pets", pets, 1800000); // 30 minutos
export const getCachedPets = () => getCachedData("pets");
```

### **constants.js** - Constantes da Aplicação

```javascript
// Status dos pets
export const PET_STATUS = {
  DISPONIVEL: "disponivel",
  EM_PROCESSO: "em_processo",
  ADOTADO: "adotado",
};

// Tipos de pets
export const PET_TYPES = {
  CAO: "cão",
  GATO: "gato",
};

// Portes dos pets
export const PET_SIZES = {
  PEQUENO: "pequeno",
  MEDIO: "médio",
  GRANDE: "grande",
  GIGANTE: "gigante",
};

// Tipos de moradia
export const HOUSING_TYPES = {
  APARTAMENTO: "apartamento",
  CASA: "casa",
  CHACARA: "chácara",
  FAZENDA: "fazenda",
};

// Configurações da aplicação
export const APP_CONFIG = {
  NAME: "Pet Lov",
  VERSION: "1.0.0",
  DEFAULT_PET_IMAGE: "/images/default-pet.jpg",
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  CACHE_TTL: 3600000, // 1 hora
  API_TIMEOUT: 10000, // 10 segundos
};

// Mensagens padrão
export const MESSAGES = {
  SUCCESS: {
    PET_CREATED: "Pet cadastrado com sucesso!",
    PET_UPDATED: "Pet atualizado com sucesso!",
    PET_DELETED: "Pet removido com sucesso!",
    ADOPTION_SUBMITTED: "Solicitação de adoção enviada com sucesso!",
  },
  ERROR: {
    GENERIC: "Ops! Algo deu errado. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Acesso negado. Faça login novamente.",
    NOT_FOUND: "Item não encontrado.",
    VALIDATION: "Por favor, corrija os campos destacados.",
  },
};

// Rotas da aplicação
export const ROUTES = {
  HOME: "/",
  PETS: "/pets",
  QUESTIONNAIRE: "/questionnaire",
  LOGIN: "/login",
  ADMIN: "/admin",
  ADMIN_PETS: "/admin/gerenciar-pets",
  ADMIN_ADOPTIONS: "/admin/adocoes",
  ADMIN_ADD_PET: "/admin/cadastrar-pet",
};
```

### **storage.js** - LocalStorage Helpers

```javascript
// Salvar dados no localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return { success: false, error: error.message };
  }
};

// Carregar dados do localStorage
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Erro ao ler do localStorage:", error);
    return defaultValue;
  }
};

// Remover item do localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
    return { success: false, error: error.message };
  }
};

// Limpar todo o localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return { success: true };
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
    return { success: false, error: error.message };
  }
};

// Verificar se localStorage está disponível
export const isLocalStorageAvailable = () => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Helpers específicos para pets
export const savePets = (pets) => saveToLocalStorage("pets", pets);
export const getPets = () => getFromLocalStorage("pets", []);
export const clearPets = () => removeFromLocalStorage("pets");

// Helpers para dados de usuário
export const saveUser = (user) => saveToLocalStorage("user", user);
export const getUser = () => getFromLocalStorage("user");
export const clearUser = () => removeFromLocalStorage("user");

// Helpers para autenticação
export const saveAuthToken = (token) => saveToLocalStorage("authToken", token);
export const getAuthToken = () => getFromLocalStorage("authToken");
export const clearAuthToken = () => removeFromLocalStorage("authToken");
```

### **petHelpers.js** - Funções Específicas para Pets

```javascript
import { formatPetAge, formatPetStatus } from "./formatters";
import { PET_STATUS, PET_TYPES } from "./constants";

// Filtrar pets por status
export const filterPetsByStatus = (pets, status) => {
  if (status === "todos") return pets;
  return pets.filter((pet) => pet.status === status);
};

// Filtrar pets por tipo
export const filterPetsByType = (pets, type) => {
  if (type === "todos") return pets;
  return pets.filter((pet) => pet.tipo?.toLowerCase() === type.toLowerCase());
};

// Ordenar pets
export const sortPets = (pets, sortBy = "nome") => {
  return [...pets].sort((a, b) => {
    switch (sortBy) {
      case "nome":
        return a.nome.localeCompare(b.nome);
      case "idade":
        return a.idade - b.idade;
      case "tipo":
        return a.tipo.localeCompare(b.tipo);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

// Agrupar pets por tipo
export const groupPetsByType = (pets) => {
  return pets.reduce((groups, pet) => {
    const type = pet.tipo || "outros";
    groups[type] = groups[type] || [];
    groups[type].push(pet);
    return groups;
  }, {});
};

// Calcular estatísticas dos pets
export const calculatePetStats = (pets) => {
  const stats = {
    total: pets.length,
    disponivel: 0,
    em_processo: 0,
    adotado: 0,
    caes: 0,
    gatos: 0,
  };

  pets.forEach((pet) => {
    // Contar por status
    if (pet.status === PET_STATUS.DISPONIVEL) stats.disponivel++;
    if (pet.status === PET_STATUS.EM_PROCESSO) stats.em_processo++;
    if (pet.status === PET_STATUS.ADOTADO) stats.adotado++;

    // Contar por tipo
    if (pet.tipo?.toLowerCase() === PET_TYPES.CAO) stats.caes++;
    if (pet.tipo?.toLowerCase() === PET_TYPES.GATO) stats.gatos++;
  });

  return stats;
};

// Buscar pet por ID
export const findPetById = (pets, id) => {
  return pets.find(
    (pet) => pet.id === id || pet.nome?.toLowerCase() === id?.toLowerCase()
  );
};

// Gerar ID único para pet
export const generatePetId = () => {
  return `pet_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};

// Preparar dados do pet para salvar
export const preparePetData = (petData) => {
  return {
    id: petData.id || generatePetId(),
    nome: petData.nome?.trim(),
    idade: parseInt(petData.idade) || 0,
    tipo: petData.tipo?.toLowerCase(),
    porte: petData.porte?.toLowerCase(),
    sexo: petData.sexo?.toLowerCase(),
    castrado: Boolean(petData.castrado),
    vacinado: Boolean(petData.vacinado),
    status: petData.status || PET_STATUS.DISPONIVEL,
    historia: petData.historia?.trim() || "",
    cuidados: petData.cuidados?.trim() || "",
    foto: petData.foto || "",
    imagem: petData.imagem || "",
    createdAt: petData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Validar se pet pode ser adotado
export const canPetBeAdopted = (pet) => {
  return pet.status === PET_STATUS.DISPONIVEL;
};

// Obter cor do badge baseado no status
export const getStatusBadgeColor = (status) => {
  const colors = {
    [PET_STATUS.DISPONIVEL]: "bg-green-100 text-green-800",
    [PET_STATUS.EM_PROCESSO]: "bg-yellow-100 text-yellow-800",
    [PET_STATUS.ADOTADO]: "bg-gray-100 text-gray-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
};
```

---

## 🔄 **Plano de Implementação**

### **Fase 1: Utilitários Básicos**

- [ ] Implementar `constants.js`
- [ ] Criar `storage.js` helpers
- [ ] Desenvolver `validators.js` básicos
- [ ] Adicionar `formatters.js` essenciais

### **Fase 2: Integração com Backend**

- [ ] Implementar `apiHelpers.js`
- [ ] Expandir validações
- [ ] Adicionar `cache.js`
- [ ] Criar `fileHelpers.js`

### **Fase 3: Funcionalidades Avançadas**

- [ ] Completar `petHelpers.js`
- [ ] Adicionar utilitários de autenticação
- [ ] Implementar compressão de imagens
- [ ] Sistema de logs e analytics

### **Fase 4: Otimizações**

- [ ] Performance e memoização
- [ ] Testes unitários
- [ ] Documentação JSDoc
- [ ] TypeScript (se necessário)

---

## 📝 **Convenções de Código**

### **Nomenclatura**

- Arquivos: `camelCase.js` (ex: `petHelpers.js`)
- Funções: `camelCase` (ex: `validateEmail`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `PET_STATUS`)
- Exports: `export const functionName`

### **Estrutura de Retorno**

```javascript
// Padrão para funções que podem falhar
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}

// Padrão para validações
{
  isValid: boolean,
  errors?: object,
  message?: string
}
```

### **Documentação JSDoc**

```javascript
/**
 * Valida dados de um pet
 * @param {Object} pet - Dados do pet
 * @param {string} pet.nome - Nome do pet
 * @param {number} pet.idade - Idade do pet
 * @returns {Object} Resultado da validação
 */
export const validatePetData = (pet) => {
  // implementação...
};
```

---

## 🚀 **Como Usar (Futuro)**

### **Importação Individual**

```javascript
import { validateEmail, formatCurrency } from "../utils/validators";
import { formatPetAge } from "../utils/formatters";
```

### **Importação Centralizada**

```javascript
import {
  validateEmail,
  formatCurrency,
  formatPetAge,
  savePets,
  PET_STATUS,
} from "../utils";
```

### **Em Componentes React**

```javascript
import { validatePetData, preparePetData } from "../utils/petHelpers";
import { savePets, getPets } from "../utils/storage";

const AddPetForm = () => {
  const handleSubmit = (formData) => {
    // Validar dados
    const validation = validatePetData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Preparar e salvar
    const petData = preparePetData(formData);
    const pets = getPets();
    pets.push(petData);
    savePets(pets);
  };
};
```

---

## 📋 **Checklist para Implementação**

### **Configuração**

- [ ] Criar estrutura de arquivos
- [ ] Configurar exports centralizados
- [ ] Estabelecer padrões de código

### **Desenvolvimento**

- [ ] Implementar cada utilitário seguindo convenções
- [ ] Criar testes unitários
- [ ] Documentar funções com JSDoc

### **Integração**

- [ ] Substituir código duplicado nos componentes
- [ ] Testar todas as funções
- [ ] Otimizar performance

### **Manutenção**

- [ ] Monitorar uso e performance
- [ ] Adicionar novos utilitários conforme necessário
- [ ] Manter documentação atualizada

---

## 🎯 **Benefícios Esperados**

### **🔄 Reutilização**

- Código DRY (Don't Repeat Yourself)
- Funções testadas e confiáveis
- Manutenção centralizada

### **📚 Organização**

- Código mais limpo nos componentes
- Lógica de negócio separada
- Estrutura escalável

### **🚀 Performance**

- Funções otimizadas
- Cache inteligente
- Validações eficientes

### **🛠️ Manutenção**

- Mudanças centralizadas
- Testes unitários
- Documentação clara

---

**Criado em:** 26/09/2025  
**Versão:** 1.0  
**Autor:** Pet Lov Development Team  
**Status:** 📋 Planejamento
