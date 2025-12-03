# Problema: Interesses de Candidatos sem pet_id

## Contexto

Durante a análise do sistema de adoção, foi identificado que apenas alguns candidatos (exemplo: Maria Silva) possuem interesses corretamente vinculados a pets (campo `pet_id` preenchido). Outros candidatos não possuem interesses registrados ou o interesse foi criado sem o campo `pet_id`.

## Sintomas

- No frontend, ao tentar aprovar/rejeitar o interesse de alguns candidatos, aparece a mensagem: `pet_id não encontrado. Não é possível aprovar/rejeitar sem o pet.`
- No backend, ao listar os candidatos, apenas alguns têm interesses exibidos no log, enquanto outros não mostram nenhum interesse ou mostram interesses sem pet vinculado.

## Diagnóstico

- O campo `pet_id` é obrigatório para que o interesse seja corretamente associado a um pet.
- Quando o interesse é criado sem o `pet_id`, não é possível realizar ações administrativas (aprovar/rejeitar) e o frontend não consegue exibir corretamente o nome do pet de interesse.
- O problema ocorre principalmente em candidatos cadastrados via automação (Google Forms) ou por fluxos que não garantem o envio do `pet_id` ao backend.

## Exemplo de Log Backend

```
Candidato: Maria Silva (cmif7i15d0000zj2922x92az6)
  Interesse #1: pet_id=cmi9oz1r30019sp5m3puu3euv, pet_nome=Laninha, status=aprovado
Candidato: ana leticia (620.901.865.22)
Candidato: João da Silva (12345678900)
Candidato: Ana jeize (0909090909)
```

## Causas Identificadas (CONFIRMADO)

### 1. Automação do Google Forms - CAUSA PRINCIPAL

- **Confirmado**: A automação do Google Forms está fazendo `POST /api/candidatos` sem incluir o campo `pet_id`
- **Comportamento atual**: Quando não há `pet_id`, o endpoint cria o candidato mas **não cria nenhum interesse** associado
- **Código problemático**: No `createCandidato`, o `pet_id` é marcado como opcional (linha 169)
- **Resultado**: Candidatos cadastrados via automação ficam sem interesses e não podem ser aprovados/rejeitados

### 2. Endpoint Permite Cadastro Sem pet_id

- **Confirmado**: O endpoint `/api/candidatos` permite criar candidatos sem `pet_id` (campo opcional)
- **Lógica atual**: Só cria interesse se `pet_id` estiver presente no payload

```javascript
// Se especificou interesse em pet específico, criar o interesse
...(pet_id && {
  cidade: {
    create: {
      pet_id: pet_id,
      status: "interessado",
    },
  },
}),
```

### 3. Dados Antigos Inconsistentes

- **Confirmado**: Candidatos existentes no banco foram criados sem interesses
- **Exemplos**: ana leticia, João da Silva, Ana jeize (sem interesses)
- **Contraste**: Maria Silva (com interesse válido: pet_id=cmi9oz1r30019sp5m3puu3euv)

## Consequências

- Não é possível aprovar/rejeitar interesses sem `pet_id`.
- O frontend não exibe corretamente os pets de interesse dos candidatos.
- Dados inconsistentes no banco de dados.

## Soluções Identificadas

### SOLUÇÃO 1 - Corrigir Automação do Google Forms (RECOMENDADA)

**Status**: Requer acesso à configuração da automação

- **Ação**: Modificar a automação para incluir `pet_id` no payload do POST
- **Payload correto**:

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  // ... outros campos do formulário ...
  "pet_id": "ID_DO_PET_DE_INTERESSE" // ← OBRIGATÓRIO
}
```

- **Vantagem**: Solução definitiva, não quebra compatibilidade
- **Desvantagem**: Precisa modificar configuração externa (Google Forms/automação)

### SOLUÇÃO 2 - Endpoint Separado para Interesses

**Status**: Pode ser implementada imediatamente

- **Ação**: Usar endpoint existente `/api/candidatos/interesse` para adicionar interesses
- **Fluxo**: Automação cria candidato → Segunda chamada adiciona interesse
- **Vantagem**: Não requer mudança na automação principal
- **Desvantagem**: Dois requests por candidato, mais complexidade

### SOLUÇÃO 3 - Tornar pet_id Obrigatório

**Status**: Quebra compatibilidade, não recomendada sozinha

- **Ação**: Modificar validação para exigir `pet_id`

```javascript
// Em validateCreateCandidato
body("pet_id")
  .notEmpty()
  .withMessage("Pet ID é obrigatório para demonstrar interesse");
```

- **Vantagem**: Força integridade dos dados
- **Desvantagem**: Quebra automação atual até ser corrigida

### SOLUÇÃO 4 - Correção de Dados Antigos

**Status**: Necessária independente da solução escolhida

- **Ação**: Script para criar interesses para candidatos existentes sem pet_id
- **Opções**:
  - Criar interesse genérico para pet mais popular
  - Interface admin para vincular candidatos a pets manualmente
  - Remover candidatos sem interesse (se permitido pela regra de negócio)

## Análise Técnica Detalhada

### Fluxos Existentes no Sistema

#### ✅ Fluxo que FUNCIONA (Frontend Direto)

1. Usuário preenche formulário no frontend
2. Frontend envia `POST /api/candidatos` **com pet_id**
3. Backend cria candidato + interesse automaticamente
4. Admin pode aprovar/rejeitar normalmente

#### ❌ Fluxo que FALHA (Automação Google Forms)

1. Usuário preenche Google Forms
2. Automação envia `POST /api/candidatos` **sem pet_id**
3. Backend cria apenas candidato (sem interesse)
4. Admin vê candidato mas não pode aprovar/rejeitar (erro: "pet_id não encontrado")

#### 🔧 Fluxo ALTERNATIVO (Dois Endpoints)

1. Automação cria candidato: `POST /api/candidatos` (sem pet_id)
2. Segunda chamada adiciona interesse: `POST /api/candidatos/interesse`
3. Resultado final equivalente ao fluxo que funciona

### Estrutura do Banco Afetada

```
AdoptionCandidate (candidatos)
├── id/cpf (chave primária)
├── nome, email, telefone, etc.
└── cidade (relação → PetInterest)

PetInterest (interesses)
├── candidato_id → AdoptionCandidate
├── pet_id → Pet  ← CAMPO OBRIGATÓRIO AUSENTE
├── status (interessado/aprovado/rejeitado)
└── data_interesse
```

### Código Relevante

**Controller problemático**: `candidatosController.js:169`

```javascript
pet_id, // Pet específico de interesse (opcional) ← PROBLEMA
```

**Validação atual**: Permite pet_id vazio
**Lógica condicional**: Só cria interesse se pet_id existir

## Impacto e Prioridade

- **Severidade**: ALTA - Impede operação normal do sistema de adoção
- **Usuários afetados**: Todos os candidatos vindos do Google Forms
- **Dados comprometidos**: Candidatos sem interesses não podem ser processados
- **Solução urgente**: Implementar SOLUÇÃO 2 (endpoint separado) enquanto corrige automação
- **Solução definitiva**: SOLUÇÃO 1 (corrigir automação do Google Forms)
