# Registro de Motivos de Rejeição em Tentativas de Adoção

## Visão Geral

Para garantir que o administrador possa analisar o histórico de tentativas de adoção de um candidato, inclusive os motivos de rejeição, cada tentativa de adoção deve registrar o motivo da rejeição de forma individual.

## Como funciona

- **Cada tentativa de adoção** gera um registro próprio, contendo:

  - ID do pet
  - ID do candidato
  - Status da tentativa (aprovado, rejeitado, em análise)
  - Data da tentativa
  - Motivo da rejeição (campo string, preenchido quando status = rejeitado)

- **Se o mesmo candidato tentar adotar novamente**, cada nova tentativa terá seu próprio motivo registrado, permitindo ao admin visualizar todo o histórico e contexto de cada decisão.

## Benefícios

- O admin pode ver todos os motivos de rejeição anteriores ao analisar uma nova tentativa do mesmo candidato.
- O histórico fica transparente e auditável, facilitando decisões futuras.

## Exemplo de fluxo

1. Candidato A tenta adotar o Pet X e é rejeitado (motivo: casa pequena).
2. Algum tempo depois, o mesmo candidato tenta novamente adotar o Pet X ou outro pet.
3. O sistema registra uma nova tentativa, com novo status e, se rejeitado, novo motivo.
4. O admin pode ver no histórico do pet (ou do candidato) todos os motivos anteriores.

## Recomendação de modelagem

No banco de dados, a tabela de tentativas de adoção (ex: `adocoes`) deve conter um campo `motivo_rejeicao` e cada linha representa uma tentativa única.

---

**Resumo:**
Sempre registre o motivo da rejeição na própria tentativa de adoção, nunca apenas no cadastro do candidato. Assim, o histórico fica completo e cada decisão é contextualizada.
