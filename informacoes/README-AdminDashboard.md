# AdminDashboard.jsx – Documentação

Este arquivo implementa o painel administrativo do sistema Abrace Uma Causa Animal. Ele permite que administradores visualizem estatísticas, vacinas recentes dos pets, acessem ações rápidas e consultem o histórico de vacinas de cada pet.

## Funcionalidades

### 1. Estatísticas Gerais

- Exibe o total de pets cadastrados, pets adotados, candidatos e processos pendentes.
- Os dados são carregados do backend via `PetServices.getAllPets()`.

### 2. Vacinas Recentes

- Mostra as vacinas mais recentes de até 2 pets diferentes.
- Permite buscar vacinas pelo nome do pet.
- Ao clicar no nome do pet, abre um modal flutuante exibindo todas as vacinas que o pet já tomou.
- Os dados são carregados do backend via `VacinaServices.getAllVacinas()`.

### 3. Modal de Histórico de Vacinas

- Modal flutuante que aparece ao clicar no nome do pet.
- Lista todas as vacinas do pet selecionado, com datas de aplicação e revacinação.
- Permite excluir vacinas cadastradas erroneamente diretamente pelo modal, atualizando a lista e removendo do banco de dados.
- Pode ser fechado pelo usuário.

### 4. Ações Rápidas

- Links para gerenciar candidatos, pets e registrar vacinas.
- Navegação rápida para páginas administrativas do sistema.

### 5. Logout

- Botão para sair do painel, removendo o token de autenticação e redirecionando para a tela de login.

## Principais Hooks e Estados

- `useState` para controlar estatísticas, vacinas, busca, loading e seleção de pet.
- `useEffect` para carregar dados do backend e atualizar a tela conforme busca.

## Estilização

- Utiliza Tailwind CSS para layout responsivo, cartões, modal e botões.
- Modal com fundo escurecido e animação de entrada.

## Observações

- O painel é totalmente responsivo e adaptado para diferentes tamanhos de tela.
- O código está preparado para integração com backend real.

---

**Arquivo:** `src/pages/(protegido)/AdminDashboard.jsx`
\*\*Documentação gerada automaticamente em 18/11/2025.
