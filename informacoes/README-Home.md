# README - Página Home

Este documento descreve todas as funcionalidades e elementos presentes na página `Home.jsx` do projeto Abrace Uma Causa Animal.

## Visão Geral

A página Home é a porta de entrada do site, apresentando o projeto, pets disponíveis para adoção e formas de ajudar a ONG. O layout é moderno, responsivo e utiliza animações para engajar o usuário.

## Funcionalidades

### 1. Cabeçalho (Header)

- Exibe o logo da ONG e o nome "Abrace Uma Causa Animal".
- Botão para visualizar todos os pets disponíveis (`Ver Pets`).
- Botão externo para formulário de adoção (`Adotar Pet`).

### 2. Título Principal

- Frase destacada: **Encontre seu novo melhor amigo**.
- Cada letra do título tem cor diferente, criando efeito visual.
- Patinhas animadas (🐾) dos dois lados do título, com movimento suave e cor amarela escura.
- Fonte utilizada: Inter.

### 3. Subtítulo

- Frase motivacional: "Conectamos corações e patas! Descubra pets incríveis esperando por uma família amorosa. Cada adoção é uma segunda chance para a felicidade."

### 4. Pets em Destaque

- Mostra até 4 pets disponíveis para adoção, com fotos em carrossel.
- Cada card exibe nome, localização, idade e botão para abrir detalhes.
- Cards possuem borda colorida e efeito de hover.
- Se não houver pets disponíveis, mostra mensagem informativa.

### 5. Modal de Detalhes do Pet

- Ao clicar em um pet, abre modal flutuante com informações detalhadas:
  - Fotos do pet (carrossel).
  - Nome, status (disponível/adotado/em processo), sexo, idade, porte, tipo, cor, peso.
  - Situação (castrado, vacinado, vermifugado, etc).
  - Descrição do pet.
  - Botão externo para adotar o pet.

### 6. Seção "Como posso ajudar?"

- Cards explicativos sobre formas de ajudar a ONG:
  - Sua Nota Tem Valor (doação via nota fiscal).
  - Bazar Solidário (doação de itens).
  - Doação de ração (inclui chave PIX).
  - Campanha Nosso Lar (vaquinha para espaço físico).

### 7. Rodapé

- Componente `Footer` exibido ao final da página.

### 8. Estilo e Animações

- Layout responsivo usando Tailwind CSS.
- Animação das patinhas com CSS customizado.
- Efeitos de hover e transições suaves nos cards e botões.

## Observações Técnicas

- Consome pets da API via `PetServices.getAllPets()`.
- Utiliza React Hooks (`useState`, `useEffect`).
- Utiliza componentes reutilizáveis (`Footer`).
- Importa fonte Inter via Google Fonts no `index.html`.

---

Qualquer dúvida ou sugestão, entre em contato com a equipe de desenvolvimento.
