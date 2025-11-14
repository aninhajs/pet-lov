import { prisma } from "../lib/prisma.js";
import { validationResult } from "express-validator";

export const getPets = async (req, res) => {
  try {
    const { tipo, status, porte, sexo, page = 1, limit = 10 } = req.query;

    // Calcular offset para paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtros
    const where = {};
    if (tipo) where.tipo = tipo.toLowerCase();
    if (status) where.status = status.toLowerCase();
    if (porte) where.porte = porte.toLowerCase();
    if (sexo) where.sexo = sexo.toLowerCase();

    // Buscar pets com paginação
    const [pets, totalCount] = await Promise.all([
      prisma.pet.findMany({
        where,
        include: {
          imagens: {
            select: {
              id: true,
              url_imagem: true,
              nome_arquivo: true,
              principal: true,
            },
            orderBy: { principal: "desc" }, // Principal primeiro
          },
          usuario_cadastrou: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { data_cadastro: "desc" },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.pet.count({ where }),
    ]);

    // Calcular dados de paginação
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: pets,
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
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        imagens: {
          select: {
            id: true,
            url_imagem: true,
            nome_arquivo: true,
            principal: true,
          },
          orderBy: { principal: "desc" },
        },
        usuario_cadastrou: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error("Erro ao buscar pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const createPet = async (req, res) => {
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
      tipo,
      idade,
      porte,
      sexo,
      cor,
      peso,
      descricao,
      temperamento,
      castrado = false,
      vacinado = false,
      vermifugado = false,
      necessidades_especiais,
      historia,
      imagens = [],
    } = req.body;

    // Calcular tamanho aproximado das imagens em base64 (se não fornecido)
    const processarImagens = imagens.map((img, index) => {
      const tamanhoBytes = img.url ? Math.ceil((img.url.length * 3) / 4) : null;
      return {
        url_imagem: img.url,
        nome_arquivo:
          img.nome ||
          `pet-${nome.replace(/\s+/g, "-")}-${Date.now()}-${index}.jpg`,
        tamanho: img.tamanho || tamanhoBytes,
        tipo_mime: img.tipo || "image/jpeg",
        principal: index === 0, // Primeira imagem é principal
      };
    });

    // Criar pet no banco
    const novoPet = await prisma.pet.create({
      data: {
        nome,
        tipo: tipo.toLowerCase(),
        idade,
        porte: porte.toLowerCase(),
        sexo: sexo.toLowerCase(),
        cor: cor && cor.trim() !== "" ? cor : "Não informada",
        peso: peso ? parseFloat(peso) : null,
        descricao,
        temperamento: temperamento || null,
        castrado: Boolean(castrado),
        vacinado: Boolean(vacinado),
        vermifugado: Boolean(vermifugado),
        necessidades_especiais: necessidades_especiais || null,
        historia: historia || null,
        status: "disponivel",
        usuario_id: req.user.id, // Vem do middleware de auth

        // Criar imagens se fornecidas
        ...(processarImagens.length > 0 && {
          imagens: {
            create: processarImagens,
          },
        }),
      },
      include: {
        imagens: true,
        usuario_cadastrou: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: novoPet,
      message: "Pet cadastrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
        details: error.message,
      },
    });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se pet existe
    const petExistente = await prisma.pet.findUnique({
      where: { id },
    });

    if (!petExistente) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

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

    const updateData = { ...req.body };

    // Converter tipos se necessário
    if (updateData.peso) updateData.peso = parseFloat(updateData.peso);
    if (updateData.castrado !== undefined)
      updateData.castrado = Boolean(updateData.castrado);
    if (updateData.vacinado !== undefined)
      updateData.vacinado = Boolean(updateData.vacinado);
    if (updateData.vermifugado !== undefined)
      updateData.vermifugado = Boolean(updateData.vermifugado);

    // Converter enums para lowercase
    if (updateData.tipo) updateData.tipo = updateData.tipo.toLowerCase();
    if (updateData.porte) updateData.porte = updateData.porte.toLowerCase();
    if (updateData.sexo) updateData.sexo = updateData.sexo.toLowerCase();
    if (updateData.status) updateData.status = updateData.status.toLowerCase();

    const petAtualizado = await prisma.pet.update({
      where: { id },
      data: updateData,
      include: {
        imagens: true,
        usuario_cadastrou: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: petAtualizado,
      message: "Pet atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    const statusValidos = [
      "disponivel",
      "em_processo",
      "adotado",
      "indisponivel",
    ];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Status inválido",
          validOptions: statusValidos,
        },
      });
    }

    const petAtualizado = await prisma.pet.update({
      where: { id },
      data: { status },
      include: {
        imagens: {
          where: { principal: true },
        },
      },
    });

    res.json({
      success: true,
      data: petAtualizado,
      message: `Status do pet alterado para "${status}"`,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    console.error("Erro ao atualizar status do pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se pet existe
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    // Deletar pet (cascade vai deletar as imagens)
    await prisma.pet.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Pet removido com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const getPetStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      prisma.pet.count(),
      prisma.pet.count({ where: { status: "disponivel" } }),
      prisma.pet.count({ where: { status: "em_processo" } }),
      prisma.pet.count({ where: { status: "adotado" } }),
      prisma.pet.count({ where: { tipo: "cao" } }),
      prisma.pet.count({ where: { tipo: "gato" } }),
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        disponiveis: stats[1],
        em_processo: stats[2],
        adotados: stats[3],
        caes: stats[4],
        gatos: stats[5],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};
