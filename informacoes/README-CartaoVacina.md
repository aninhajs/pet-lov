# CartaoVacina.jsx - Detalhamento da Página

Esta página é responsável pelo cadastro de vacinas para pets já cadastrados no sistema. Abaixo está um detalhamento completo de todas as funcionalidades e comportamentos presentes no código:

## Funcionalidades

### 1. Carregamento dos Pets

- Ao abrir a página, é feita uma requisição ao backend para buscar todos os pets cadastrados.
- Os pets são armazenados no estado `pets`.
- Caso haja erro ao carregar, uma mensagem de erro é exibida.

### 2. Pesquisa e Seleção de Pet

- O usuário pode pesquisar o nome do pet em um campo de texto.
- Conforme o usuário digita, uma lista de sugestões (autocomplete) aparece abaixo do campo, mostrando os pets que correspondem ao texto digitado.
- Ao clicar em um pet da lista, ele é selecionado para o cadastro da vacina.
- Não há mais um campo de seleção tradicional (select), apenas o autocomplete.

### 3. Cadastro de Vacinas

- O formulário permite cadastrar uma ou mais vacinas para o pet selecionado.
- Cada vacina possui os campos:
  - Nome da Vacina
  - Data da Vacina
  - Data de Revacinação (opcional)
- O usuário pode adicionar ou remover vacinas dinamicamente.

### 4. Validação de Datas

- A data de revacinação não pode ser igual ou anterior à data da vacina.
- Caso o usuário tente inserir uma data inválida, um alerta é exibido e o valor não é aceito.
- A validação também ocorre ao enviar o formulário.

### 5. Envio para o Backend

- Ao submeter o formulário, as vacinas válidas são enviadas para o backend, vinculadas ao pet selecionado.
- Se o cadastro for bem-sucedido, uma mensagem de sucesso é exibida e o formulário é resetado.
- Se houver erro, uma mensagem de erro é exibida.

### 6. Toast de Mensagem

- Mensagens de sucesso ou erro aparecem no topo direito da tela, com ícones e cores diferentes conforme o tipo.

### 7. Navegação

- Botão para voltar ao dashboard.
- Botão para sair, que remove o login do admin e redireciona para a página inicial.

## Estrutura Visual

- Layout responsivo e moderno, com uso de Tailwind CSS.
- Campos e botões estilizados para melhor experiência do usuário.
- Autocomplete de pets com destaque para o pet selecionado.

## Observações Técnicas

- Utiliza React Hooks (`useState`, `useEffect`).
- Integração com serviços de pets e vacinas via `PetServices` e `VacinaServices`.
- Todo o fluxo é controlado por estados locais.
- O código está preparado para múltiplos pets e múltiplas vacinas por pet.

---

Este README detalha todas as funcionalidades e comportamentos implementados na página de cadastro de vacinas para pets, facilitando o entendimento e manutenção do código.
