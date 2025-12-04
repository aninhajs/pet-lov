import { prisma } from "../lib/prisma.js";
import { validationResult } from "express-validator";

export const getCandidatos = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Calcular offset para paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtros
    const where = {};
    if (status) where.status = status.toLowerCase();

    // Buscar candidatos com paginação
    const [candidatos, totalCount] = await Promise.all([
      prisma.adoptionCandidate.findMany({
        where,
        include: {
          cidade: {
            include: {
              pet: {
                select: {
                  id: true,
                  nome: true,
                  tipo: true,
                  status: true,
                },
              },
            },
            orderBy: { data_interesse: "desc" },
          },
        },
        orderBy: { cpf: "desc" },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.adoptionCandidate.count({ where }),
    ]);

    // Calcular dados de paginação
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: candidatos,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getCandidatoById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidato = await prisma.adoptionCandidate.findUnique({
      where: { cpf: id },
      include: {
        cidade: {
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                tipo: true,
                porte: true,
                status: true,
                imagens: {
                  where: { principal: true },
                  select: { url_imagem: true },
                },
              },
            },
          },
          orderBy: { data_interesse: "desc" },
        },
        cep: {
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                tipo: true,
                porte: true,
              },
            },
          },
          orderBy: { data_adocao: "desc" },
        },
      },
    });

    // Se candidato existe, buscar histórico de rejeições
    if (candidato) {
      const historicoRejeicoes = await prisma.petInterest.findMany({
        where: {
          candidato_id: id,
          status: "rejeitado",
          observacoes_admin: { not: null },
        },
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
        },
        orderBy: { data_avaliacao: "desc" },
      });

      // Adicionar histórico ao candidato
      candidato.historico_rejeicoes = historicoRejeicoes;
    }

    if (!candidato) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Candidato não encontrado",
        },
      });
    }

    res.json({
      success: true,
      data: candidato,
    });
  } catch (error) {
    console.error("Erro ao buscar candidato:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const createCandidato = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Dados inválidos",
          details: errors.array(),
        },
      });
    }

    const {
      nome,
      email,
      telefone,
      endereco,
      tipo_moradia,
      tempo_disponivel,
      experiencia_pets,
      motivacao,
      pet_id, // Pet específico de interesse (opcional)
    } = req.body;

    // Verificar se já existe candidato com mesmo email
    const candidatoExistente = await prisma.adoptionCandidate.findFirst({
      where: { email },
    });

    if (candidatoExistente) {
      return res.status(409).json({
        success: false,
        error: {
          message: "Já existe um cadastro com este email",
        },
      });
    }

    // Criar candidato
    const novoCandidato = await prisma.adoptionCandidate.create({
      data: {
        nome,
        email,
        telefone,
        endereco,
        tipo_moradia,
        tempo_disponivel,
        experiencia_pets,
        motivacao,

        // Se especificou interesse em pet específico, criar o interesse
        ...(pet_id && {
          cidade: {
            create: {
              pet_id: pet_id,
              status: "interessado",
            },
          },
        }),
      },
      include: {
        cidade: {
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                tipo: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: novoCandidato,
      message:
        "Formulário de adoção enviado com sucesso! Entraremos em contato em breve.",
    });
  } catch (error) {
    console.error("Erro ao criar candidato:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const updateCandidatoStatus = async (req, res) => {
  try {
    const { id } = req.params; // Aqui 'id' é o CPF
    const { status, observacoes, pet_id } = req.body;

    console.log("🔍 DEBUG - updateCandidatoStatus:");
    console.log("  - ID (CPF):", id);
    console.log("  - Status:", status);
    console.log("  - Pet ID:", pet_id);
    console.log("  - Observações:", observacoes);

    // Verificar se candidato existe
    const candidato = await prisma.adoptionCandidate.findUnique({
      where: { cpf: id },
      include: {
        cidade: {
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                tipo: true,
              },
            },
          },
          orderBy: { data_interesse: "desc" },
        },
      },
    });

    console.log("📋 Candidato encontrado:", candidato ? "SIM" : "NÃO");

    if (!candidato) {
      console.log("❌ Candidato não encontrado para CPF:", id);
      return res.status(404).json({
        success: false,
        error: {
          message: "Candidato não encontrado",
        },
      });
    }

    // Atualizar apenas o interesse do candidato para o pet específico
    if (!pet_id) {
      console.log("❌ pet_id não fornecido");
      return res.status(400).json({
        success: false,
        error: {
          message: "pet_id é obrigatório para aprovar/rejeitar interesse.",
        },
      });
    }

    // Se estiver aprovando, verificar se o pet ainda está disponível
    if (status.toLowerCase() === "aprovado") {
      console.log("🐕 Buscando pet com ID:", pet_id);

      const pet = await prisma.pet.findUnique({
        where: { id: pet_id },
        select: { id: true, status: true, nome: true },
      });

      console.log("🐕 Pet encontrado:", pet);

      if (!pet) {
        console.log("❌ Pet não encontrado com ID:", pet_id);
        return res.status(404).json({
          success: false,
          error: {
            message: "Pet não encontrado",
          },
        });
      }

      if (pet.status === "adotado") {
        console.log("❌ Pet já está adotado:", pet.nome);
        return res.status(400).json({
          success: false,
          error: {
            message: "Pet já foi adotado por outro candidato",
          },
        });
      }

      // Verificar se já existe adoção ativa para este pet
      console.log("🔍 Verificando adoções ativas para pet:", pet_id);

      const adocaoExistente = await prisma.adoption.findFirst({
        where: {
          pet_id,
          status: "ativa",
        },
      });

      console.log("📋 Adoção existente encontrada:", adocaoExistente);

      if (adocaoExistente) {
        console.log("❌ Pet já possui adoção ativa");

        // Verificar se é o mesmo candidato tentando aprovar novamente
        const isMesmoCandidato = adocaoExistente.candidato_id === id;

        return res.status(400).json({
          success: false,
          error: {
            message: isMesmoCandidato
              ? `Candidato já foi aprovado para este pet em ${new Date(
                  adocaoExistente.data_adocao
                ).toLocaleDateString("pt-BR")}. A adoção já está ativa.`
              : "Pet já possui uma adoção ativa com outro candidato",
          },
        });
      }

      // Usar transação para aprovar interesse + criar adoção automaticamente
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Atualizar interesse para aprovado
        await prisma.petInterest.updateMany({
          where: { candidato_id: id, pet_id },
          data: {
            status: "aprovado",
            data_avaliacao: new Date(),
            observacoes_admin: observacoes,
          },
        });

        // 2. Criar adoção automaticamente
        const novaAdocao = await prisma.adoption.create({
          data: {
            pet_id,
            candidato_id: id,
            observacoes:
              observacoes ||
              "Adoção registrada automaticamente na aprovação do interesse",
            status: "ativa",
          },
        });

        // 3. Atualizar status do pet para adotado
        await prisma.pet.update({
          where: { id: pet_id },
          data: { status: "adotado" },
        });

        // 4. Rejeitar outros interesses no mesmo pet
        await prisma.petInterest.updateMany({
          where: {
            pet_id,
            candidato_id: { not: id },
            status: "interessado",
          },
          data: {
            status: "rejeitado",
            data_avaliacao: new Date(),
            observacoes_admin: "Pet foi adotado por outro candidato",
          },
        });

        return novaAdocao;
      });

      console.log(
        `✅ Adoção automática criada: Pet ${pet_id} → Candidato ${id}`
      );
    } else {
      // Para rejeição, apenas atualizar o interesse
      await prisma.petInterest.updateMany({
        where: { candidato_id: id, pet_id },
        data: {
          status: status.toLowerCase(),
          data_avaliacao: new Date(),
          observacoes_admin: observacoes,
        },
      });
    }

    const candidatoAtualizado = await prisma.adoptionCandidate.findUnique({
      where: { cpf: id },
      include: {
        cidade: {
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                tipo: true,
              },
            },
          },
          orderBy: { data_interesse: "desc" },
        },
      },
    });

    res.json({
      success: true,
      data: candidatoAtualizado,
      message:
        status.toLowerCase() === "aprovado"
          ? "Candidato aprovado e adoção registrada automaticamente! Pet marcado como adotado."
          : "Candidato rejeitado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar status do candidato:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const createInteresse = async (req, res) => {
  try {
    const { candidato_id, pet_id } = req.body;

    // Verificar se candidato e pet existem
    const [candidato, pet] = await Promise.all([
      prisma.adoptionCandidate.findUnique({ where: { id: candidato_id } }),
      prisma.pet.findUnique({ where: { id: pet_id } }),
    ]);

    if (!candidato) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Candidato não encontrado",
        },
      });
    }

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    // Verificar se interesse já existe
    const interesseExistente = await prisma.petInterest.findUnique({
      where: {
        candidato_id_pet_id: {
          candidato_id,
          pet_id,
        },
      },
    });

    if (interesseExistente) {
      return res.status(409).json({
        success: false,
        error: {
          message: "Candidato já demonstrou interesse neste pet",
        },
      });
    }

    const novoInteresse = await prisma.petInterest.create({
      data: {
        candidato_id,
        pet_id,
        status: "interessado",
      },
      include: {
        candidato: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            nome: true,
            tipo: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: novoInteresse,
      message: "Interesse registrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar interesse:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getCandidatoStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      prisma.adoptionCandidate.count(),
      prisma.petInterest.count({ where: { status: "interessado" } }),
      prisma.petInterest.count({ where: { status: "aprovado" } }),
      prisma.petInterest.count({ where: { status: "rejeitado" } }),
      prisma.adoption.count({ where: { status: "ativa" } }),
    ]);

    res.json({
      success: true,
      data: {
        total_candidatos: stats[0],
        interesses_pendentes: stats[1],
        interesses_aprovados: stats[2],
        interesses_rejeitados: stats[3],
        adocoes_ativas: stats[4],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de candidatos:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getInteressesByPet = async (req, res) => {
  try {
    const { pet_id } = req.params;

    const interesses = await prisma.petInterest.findMany({
      where: { pet_id },
      include: {
        candidato: {
          select: {
            id: true,
            cpf: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
      orderBy: { data_interesse: "desc" },
    });

    res.json({
      success: true,
      data: interesses,
    });
  } catch (error) {
    console.error("Erro ao buscar interesses do pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};
