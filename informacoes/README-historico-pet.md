# Exibição do Histórico de Adoções e Interesses no Modal de Detalhes do Pet

## Visão Geral
Este documento descreve como o histórico de adoções e interesses de cada pet é exibido no modal de detalhes da página `GerenciarPets.jsx`.

---

## Funcionalidade

Ao abrir o modal de detalhes de um pet, o sistema busca automaticamente:
- Todas as tentativas de adoção do pet (com status, candidato e motivo de rejeição, se houver).
- Todos os interesses de candidatos no pet (com status, candidato e observações administrativas).

Essas informações são exibidas em uma seção "Histórico" dentro do modal, permitindo ao administrador visualizar todo o ciclo de vida do pet, mesmo após a adoção.

---

## Fluxo de Implementação

1. **Estados React adicionados:**
   ```js
   const [historicoAdocoes, setHistoricoAdocoes] = useState([]);
   const [historicoInteresses, setHistoricoInteresses] = useState([]);
   const [loadingHistorico, setLoadingHistorico] = useState(false);
   ```

2. **Busca automática ao abrir o modal:**
   ```js
   useEffect(() => {
     const fetchHistoricos = async () => {
       if (!petSelecionado) return;
       setLoadingHistorico(true);
       try {
         // Histórico de adoções
         const adocoesResp = await api.get(`/adocoes/pet/${petSelecionado.id}`);
         setHistoricoAdocoes(adocoesResp.data?.data || []);
       } catch {
         setHistoricoAdocoes([]);
       }
       try {
         // Histórico de interesses
         const interessesResp = await api.get(`/pet-interests/pet/${petSelecionado.id}`);
         setHistoricoInteresses(interessesResp.data?.data || []);
       } catch {
         setHistoricoInteresses([]);
       }
       setLoadingHistorico(false);
     };
     fetchHistoricos();
   }, [petSelecionado]);
   ```

3. **Renderização no modal:**
   ```jsx
   <div>
     <h3 className="font-semibold text-sky-700 mb-2 text-base flex items-center gap-2">📜 Histórico</h3>
     {loadingHistorico ? (
       <div className="text-gray-500 text-sm">Carregando histórico...</div>
     ) : (
       <div className="grid md:grid-cols-2 gap-4">
         <div>
           <h4 className="font-bold text-blue-700 mb-1 text-sm">Adoções</h4>
           {historicoAdocoes.length === 0 ? (
             <div className="text-xs text-gray-500">Nenhuma tentativa de adoção registrada.</div>
           ) : (
             <ul className="space-y-2">
               {historicoAdocoes.map((adocao) => (
                 <li key={adocao.id} className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                   <div className="flex justify-between items-center">
                     <span className="font-semibold text-blue-900 text-xs">{adocao.status}</span>
                     <span className="text-xs text-gray-700">{new Date(adocao.data_adocao).toLocaleDateString("pt-BR")}</span>
                   </div>
                   <div className="text-xs text-gray-800 mt-1">
                     Candidato: <b>{adocao.candidato?.nome || "-"}</b>
                   </div>
                   {adocao.motivo_rejeicao && (
                     <div className="text-xs text-red-700 mt-1">Motivo rejeição: {adocao.motivo_rejeicao}</div>
                   )}
                 </li>
               ))}
             </ul>
           )}
         </div>
         <div>
           <h4 className="font-bold text-green-700 mb-1 text-sm">Interesses</h4>
           {historicoInteresses.length === 0 ? (
             <div className="text-xs text-gray-500">Nenhum interesse registrado.</div>
           ) : (
             <ul className="space-y-2">
               {historicoInteresses.map((interesse) => (
                 <li key={interesse.id} className="bg-green-50 border-l-4 border-green-400 p-2 rounded">
                   <div className="flex justify-between items-center">
                     <span className="font-semibold text-green-900 text-xs">{interesse.status}</span>
                     <span className="text-xs text-gray-700">{new Date(interesse.data_interesse).toLocaleDateString("pt-BR")}</span>
                   </div>
                   <div className="text-xs text-gray-800 mt-1">
                     Candidato: <b>{interesse.candidato?.nome || "-"}</b>
                   </div>
                   {interesse.observacoes_admin && (
                     <div className="text-xs text-orange-700 mt-1">Obs: {interesse.observacoes_admin}</div>
                   )}
                 </li>
               ))}
             </ul>
           )}
         </div>
       </div>
     )}
   </div>
   ```

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
