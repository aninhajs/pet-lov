# Exibição do Histórico de Adoções e Interesses no Modal de Detalhes do Pet

## Visão Geral

Este documento descreve como implementar e exibir o histórico de adoções e interesses de cada pet no modal de detalhes da página `GerenciarPets.jsx`.

---

## Funcionalidade

Ao abrir o modal de detalhes de um pet, o sistema deve buscar automaticamente:

- Todas as tentativas de adoção do pet (com status, candidato e motivo de rejeição, se houver).
- Todos os interesses de candidatos no pet (com status, candidato e observações administrativas).

Essas informações são exibidas em uma seção "Histórico" dentro do modal, permitindo ao administrador visualizar todo o ciclo de vida do pet, mesmo após a adoção.

---

---

## Observações

- O histórico é carregado sempre que um pet é selecionado para detalhes.
- O backend deve fornecer os endpoints `/adocoes/pet/:pet_id` e `/pet-interests/pet/:pet_id`.
- O histórico permanece acessível mesmo após o pet ser adotado.

---

## Benefícios

- Transparência total do ciclo de vida do pet.
- Facilidade de auditoria e acompanhamento de adoções e interesses.
- Melhora a experiência do administrador e a rastreabilidade do sistema.
