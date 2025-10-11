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
          interesses: {
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
          adocoes: {
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
        orderBy: { data_cadastro: "desc" },
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
      where: { id },
      include: {
        interesses: {
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
        adocoes: {
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
          interesses: {
            create: {
              pet_id: pet_id,
              status: "interessado",
            },
          },
        }),
      },
      include: {
        interesses: {
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
    const { id } = req.params;
    const { status, observacoes } = req.body;

    // Verificar se candidato existe
    const candidato = await prisma.adoptionCandidate.findUnique({
      where: { id },
    });

    if (!candidato) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Candidato não encontrado",
        },
      });
    }

    // Atualizar todos os interesses do candidato com mesmo status
    await prisma.petInterest.updateMany({
      where: { candidato_id: id },
      data: {
        status: status.toLowerCase(),
        data_avaliacao: new Date(),
        observacoes_admin: observacoes,
      },
    });

    const candidatoAtualizado = await prisma.adoptionCandidate.findUnique({
      where: { id },
      include: {
        interesses: {
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

    res.json({
      success: true,
      data: candidatoAtualizado,
      message: `Candidato ${
        status === "aprovado" ? "aprovado" : "rejeitado"
      } com sucesso!`,
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
