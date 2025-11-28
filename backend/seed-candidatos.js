// Script para popular o banco com candidatos de exemplo
// Execute: node seed-candidatos.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const candidatos = [
    {
      nome: "Maria Silva",
      celular_01: "11999999999",
      endereco: "Rua das Flores, 123, São Paulo - SP",
      data_nascimento: new Date("1990-01-01"),
      trabalha: true,
      profissao: "Professora",
      perfil_social: "@mariasilva",
      mora_em: "Apartamento",
      tipo_residencia: "Próprio",
      proprietario_aceita_animais: true,
      normas_condominio_animais: "Permitido",
      tipo_portao: "Automático",
      possui_na_residencia: "Cachorro",
      tipo_quintal_varanda: "Pequeno",
      reside_com_quantas_pessoas: "2",
      quem_sao: "Marido e filha",
      todos_aceitam_adocao: true,
      responsavel_financeiro: "Maria Silva",
      reacao_mordida_arranho: "Levar ao veterinário",
      reacao_bagunca: "Educar",
      possui_veiculo: true,
      tipo_veiculo: "Carro",
      como_levara_veterinario: "Carro",
      pode_levar_imediato: true,
      moradores_trabalham: true,
      profissao_moradores: "Engenheiro",
      alguem_alergico: false,
      tem_criancas: true,
      comodo_dia: "Sala",
      local_dormir: "Quarto",
      ficara_preso: false,
      motivo_preso: null,
      tempo_preso: null,
      providencia_crescimento: "Adaptação",
      responsavel_viagem: "Vizinha",
      pretende_mudar_5_anos: false,
      destino_animal_mudanca: null,
      reacao_choro_latido: "Conversar",
      vacinas_que_dara: "V8, Raiva",
      marca_racao_adotado: "Golden",
      criterios_alimentacao: "Ração premium",
      filhotes_ou_castrar: "Castrar",
      preparado_responsabilidade: true,
      disposto_adaptacao: true,
      clinica_veterinario: "Clínica Pet",
      reacao_doenca: "Levar ao veterinário",
      conhece_doencas: true,
      frequencia_remedio_verme: "Semestral",
      frequencia_veterinario: "Anual",
      cidade: {
        create: [
          {
            pet_id: "cmi9oz1r30019sp5m3puu3euv",
            observacoes_admin: "Casa pequena",
            data_interesse: new Date("2024-09-10"),
          },
        ],
      },
      disposto_adaptacao: true,
      clinica_veterinario: "Clínica Pet",
      reacao_doenca: "Levar ao veterinário",
      conhece_doencas: true,
      frequencia_remedio_verme: "Semestral",
      frequencia_veterinario: "Anual",
    }
  ];
  for (const candidato of candidatos) {
    await prisma.adoptionCandidate.create({
      data: candidato,
    });
  }
  console.log("Candidatos de exemplo inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
