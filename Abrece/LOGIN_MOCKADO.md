# 🔐 Sistema de Login Mockado - Pet Lov

## Visão Geral

O sistema de autenticação foi alterado para usar **dados mockados localmente**, sem necessidade de banco de dados ou backend.

## 👤 Credenciais de Acesso

### Admin Principal

- **Email:** `admin@abrace.com`
- **Senha:** `admin123`
- **Nome:** Administrador

### Usuário Teste

- **Email:** `teste@teste.com`
- **Senha:** `teste123`
- **Nome:** Usuário Teste

## 🛠️ Como Funciona

### 1. Login (`Login.jsx`)

- Valida credenciais contra array `MOCK_USERS`
- Gera token mockado (base64) com dados do usuário
- Armazena token e dados do usuário no `localStorage`
- Token válido por 24 horas

### 2. Proteção de Rotas (`ProtectedRoute.jsx`)

- Verifica presença do token no `localStorage`
- Decodifica token e valida expiração
- Redireciona para login se inválido ou expirado
- Exibe loading durante verificação

### 3. Dashboard Admin

- Exibe nome do usuário logado
- Botão de logout limpa `localStorage`
- Funciona normalmente sem dependências de API

## 📦 Estrutura do Token

```javascript
{
  email: "admin@abrace.com",
  nome: "Administrador",
  tipo: "admin",
  exp: 1730937600000 // timestamp de expiração
}
```

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /login
2. Digita credenciais
3. Sistema valida contra MOCK_USERS
4. Se válido: gera token mockado
5. Salva no localStorage
6. Redireciona para /admin
7. ProtectedRoute valida token
8. Permite acesso ao Dashboard
```

## 🎯 Vantagens

✅ **Sem dependência de backend** - Desenvolvimento frontend independente  
✅ **Rápido para testar** - Sem latência de rede  
✅ **Fácil adicionar usuários** - Apenas editar array `MOCK_USERS`  
✅ **Simula autenticação real** - Mesmo fluxo de token e validação

## 📝 Como Adicionar Novos Usuários

Edite o arquivo `src/pages/Login.jsx` e adicione no array `MOCK_USERS`:

```javascript
const MOCK_USERS = [
  {
    email: "novo@email.com",
    password: "senha123",
    nome: "Nome do Usuário",
    tipo: "admin",
  },
  // ... outros usuários
];
```

## 🚀 Próximos Passos (Integração com Backend)

Quando quiser migrar para autenticação real:

1. Restaurar chamadas à API no `Login.jsx`
2. Usar JWT real do backend
3. Implementar refresh token
4. Adicionar validação de sessão no servidor
5. Atualizar `ProtectedRoute.jsx` para validar com backend

## ⚠️ Limitações Atuais

- Token não é JWT criptografado (apenas base64)
- Sem refresh token
- Sem validação server-side
- Credenciais no código-fonte (inseguro para produção)
- Token expira mas não é renovado automaticamente

---

**Status:** ✅ Ativo  
**Última Atualização:** 6 de novembro de 2025  
**Próxima Fase:** Integração com backend real
