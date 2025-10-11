import { prisma } from "../lib/prisma.js";
import { validationResult } from "express-validator";

export const getAdocoes = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Calcular offset para paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtros
    const where = {};
    if (status) where.status = status.toLowerCase();

    // Buscar adoções com paginação
    const [adocoes, totalCount] = await Promise.all([
      prisma.adoption.findMany({
        where,
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              porte: true,
              sexo: true,
              idade: true,
              imagens: {
                where: { principal: true },
                select: { url_imagem: true },
              },
            },
          },
          candidato: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
            },
          },
        },
        orderBy: { data_adocao: "desc" },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.adoption.count({ where }),
    ]);

    // Calcular dados de paginação
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: adocoes,
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
    console.error("Erro ao buscar adoções:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getAdocaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const adocao = await prisma.adoption.findUnique({
      where: { id },
      include: {
        pet: {
          include: {
            imagens: {
              select: {
                id: true,
                url_imagem: true,
                principal: true,
              },
            },
          },
        },
        candidato: true,
      },
    });

    if (!adocao) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Adoção não encontrada",
        },
      });
    }

    res.json({
      success: true,
      data: adocao,
    });
  } catch (error) {
    console.error("Erro ao buscar adoção:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const createAdocao = async (req, res) => {
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

    const { pet_id, candidato_id, observacoes, taxa_adocao } = req.body;

    // Verificar se pet e candidato existem
    const [pet, candidato] = await Promise.all([
      prisma.pet.findUnique({ where: { id: pet_id } }),
      prisma.adoptionCandidate.findUnique({ where: { id: candidato_id } }),
    ]);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    if (!candidato) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Candidato não encontrado",
        },
      });
    }

    // Verificar se pet está disponível
    if (pet.status === "adotado") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Pet já foi adotado",
        },
      });
    }

    // Verificar se já existe adoção ativa para este pet
    const adocaoExistente = await prisma.adoption.findFirst({
      where: {
        pet_id,
        status: "ativa",
      },
    });

    if (adocaoExistente) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Pet já possui uma adoção ativa",
        },
      });
    }

    // Criar adoção usando uma transação
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Criar a adoção
      const novaAdocao = await prisma.adoption.create({
        data: {
          pet_id,
          candidato_id,
          observacoes,
          taxa_adocao: taxa_adocao ? parseFloat(taxa_adocao) : null,
          status: "ativa",
        },
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
          candidato: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      // 2. Atualizar status do pet para adotado
      await prisma.pet.update({
        where: { id: pet_id },
        data: { status: "adotado" },
      });

      // 3. Atualizar status do interesse para aprovado
      await prisma.petInterest.updateMany({
        where: {
          candidato_id,
          pet_id,
          status: "interessado",
        },
        data: {
          status: "aprovado",
          data_avaliacao: new Date(),
        },
      });

      // 4. Rejeitar outros interesses no mesmo pet
      await prisma.petInterest.updateMany({
        where: {
          pet_id,
          candidato_id: { not: candidato_id },
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

    res.status(201).json({
      success: true,
      data: result,
      message: "Adoção finalizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar adoção:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const updateAdocaoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;

    // Verificar se adoção existe
    const adocao = await prisma.adoption.findUnique({
      where: { id },
      include: {
        pet: { select: { id: true, nome: true } },
      },
    });

    if (!adocao) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Adoção não encontrada",
        },
      });
    }

    // Atualizar usando transação
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Atualizar adoção
      const adocaoAtualizada = await prisma.adoption.update({
        where: { id },
        data: {
          status: status.toLowerCase(),
          observacoes,
        },
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
          candidato: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      // 2. Se cancelada ou devolvida, atualizar status do pet
      if (status === "cancelada" || status === "devolvido") {
        await prisma.pet.update({
          where: { id: adocao.pet_id },
          data: { status: "disponivel" },
        });
      }

      return adocaoAtualizada;
    });

    res.json({
      success: true,
      data: result,
      message: `Status da adoção atualizado para "${status}"`,
    });
  } catch (error) {
    console.error("Erro ao atualizar status da adoção:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getAdocoesByCandidato = async (req, res) => {
  try {
    const { candidato_id } = req.params;

    const adocoes = await prisma.adoption.findMany({
      where: { candidato_id },
      include: {
        pet: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            porte: true,
            sexo: true,
            idade: true,
            imagens: {
              where: { principal: true },
              select: { url_imagem: true },
            },
          },
        },
      },
      orderBy: { data_adocao: "desc" },
    });

    res.json({
      success: true,
      data: adocoes,
    });
  } catch (error) {
    console.error("Erro ao buscar adoções do candidato:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getAdocoesStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      prisma.adoption.count(),
      prisma.adoption.count({ where: { status: "ativa" } }),
      prisma.adoption.count({ where: { status: "cancelada" } }),
      prisma.adoption.count({ where: { status: "devolvido" } }),

      // Adoções por mês (últimos 6 meses)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', data_adocao) as mes,
          COUNT(*) as total
        FROM adoptions 
        WHERE data_adocao >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', data_adocao)
        ORDER BY mes DESC
      `,
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        ativas: stats[1],
        canceladas: stats[2],
        devolvidos: stats[3],
        por_mes: stats[4],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas de adoções:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};
