# Documentação do Banco de Dados (Prisma Schema)

## Visão Geral

Este documento descreve as entidades (models) do banco de dados do sistema de adoção de pets, suas propriedades e os relacionamentos entre elas, conforme definido no arquivo `schema.prisma`.

---

## Entidades e Relacionamentos

### 1. User

- **Descrição:** Representa um usuário do sistema (admin ou comum).
- **Campos principais:**
  - `id` (PK): Identificador único.
  - `email`: E-mail do usuário (único).
  - `senha_hash`: Hash da senha.
  - `tipo`: Enum `TipoUsuario` (admin, comum).
  - `ativo`: Booleano de status.
  - `nome`, `telefone`, `endereco`.
  - `data_criacao`, `data_atualizacao`.
- **Relacionamentos:**
  - 1:N com `Pet` (pets_cadastrados): Um usuário pode cadastrar vários pets.

### 2. Pet

- **Descrição:** Representa um animal disponível ou já adotado.
- **Campos principais:**
  - `id` (PK): Identificador único.
  - `nome`, `tipo` (Enum `TipoPet`), `idade`, `porte`, `sexo`, `cor`, `peso`, `descricao`.
  - `castrado`, `vacinado`, `vermifugado` (booleans).
  - `necessidades_especiais`, `historia`, `status` (Enum `StatusPet`).
  - `data_cadastro`, `data_atualizacao`.
  - `usuario_id`: FK para `User` (quem cadastrou).
  - `localizacao`.
- **Relacionamentos:**
  - N:1 com `User` (usuario_cadastrou).
  - 1:N com `Adoption` (adocoes): Um pet pode ter várias tentativas de adoção.
  - 1:N com `PetImage` (imagens): Um pet pode ter várias imagens.
  - 1:N com `PetInterest` (interesses): Vários candidatos podem demonstrar interesse.
  - 1:N com `Vaccine` (vacinas): Um pet pode ter vários registros de vacina.

### 3. PetImage

- **Descrição:** Imagens associadas a um pet.
- **Campos principais:**
  - `id` (PK), `pet_id` (FK), `url_imagem`, `nome_arquivo`, `tamanho`, `tipo_mime`, `principal`, `data_upload`.
- **Relacionamentos:**
  - N:1 com `Pet` (pet).

### 4. AdoptionCandidate

- **Descrição:** Pessoa que se candidata para adotar um pet.
- **Campos principais:**
  - `cpf` (PK): Identificador único do candidato.
  - `nome`, `endereco`, `celular_01`, `celular_02`, `data_nascimento`, `trabalha`, `profissao`, `perfil_social`, etc.
  - Diversos campos detalhados sobre perfil, residência, experiência com animais, etc.
- **Relacionamentos:**
  - 1:N com `Adoption` (cep): Um candidato pode ter várias adoções.
  - 1:N com `PetInterest` (cidade): Um candidato pode demonstrar interesse em vários pets.

### 5. PetInterest

- **Descrição:** Representa o interesse de um candidato em um pet.
- **Campos principais:**
  - `id` (PK), `candidato_id` (FK), `pet_id` (FK), `status` (Enum `StatusInteresse`), `data_interesse`, `data_avaliacao`, `observacoes_admin`.
- **Relacionamentos:**
  - N:1 com `AdoptionCandidate` (candidato).
  - N:1 com `Pet` (pet).
  - Restrição única: Um candidato só pode ter um interesse por pet.

### 6. Adoption

- **Descrição:** Representa uma tentativa de adoção (ativa, cancelada, devolvida).
- **Campos principais:**
  - `id` (PK), `pet_id` (FK), `candidato_id` (FK), `data_adocao`, `observacoes`, `taxa_adocao`, `status` (Enum `StatusAdocao`), `data_atualizacao`.
- **Relacionamentos:**
  - N:1 com `Pet` (pet).
  - N:1 com `AdoptionCandidate` (candidato).

### 7. Vaccine

- **Descrição:** Registro de vacina aplicada a um pet.
- **Campos principais:**
  - `id` (PK), `pet_id` (FK), `nome_vacina`, `data_aplicacao`, `data_revacina`, `lote`, `fabricante`, `veterinario`, `observacoes`, `data_cadastro`, `data_atualizacao`.
- **Relacionamentos:**
  - N:1 com `Pet` (pet).

---

## Enums

- **TipoPet:** cao, gato, outros
- **PortePet:** pequeno, medio, grande
- **SexoPet:** macho, femea
- **StatusPet:** disponivel, em_processo, adotado, indisponivel
- **TipoUsuario:** admin, comum
- **StatusCandidato:** pendente, aprovado, rejeitado
- **StatusInteresse:** interessado, aprovado, rejeitado
- **StatusAdocao:** ativa, cancelada, devolvido

---

## Resumo dos Relacionamentos

- **User** 1:N **Pet**
- **Pet** 1:N **PetImage**
- **Pet** 1:N **Adoption**
- **Pet** 1:N **PetInterest**
- **Pet** 1:N **Vaccine**
- **AdoptionCandidate** 1:N **Adoption**
- **AdoptionCandidate** 1:N **PetInterest**
- **PetInterest** N:1 **Pet**
- **PetInterest** N:1 **AdoptionCandidate**
- **Adoption** N:1 **Pet**
- **Adoption** N:1 **AdoptionCandidate**
- **Vaccine** N:1 **Pet**

---

## Observações

- O sistema foi modelado para manter o histórico completo de pets, adoções, interesses e vacinas.
- Pets não são excluídos ao serem adotados, apenas têm o status atualizado.
- O modelo permite rastrear todo o ciclo de vida do pet e dos candidatos.
