import { prisma } from "../lib/prisma.js";

/**
 * Listar todas as vacinas ou filtrar por pet_id
 */
export const listarVacinas = async (req, res) => {
  try {
    const { pet_id, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const where = pet_id ? { pet_id } : {};

    const [vacinas, total] = await Promise.all([
      prisma.vaccine.findMany({
        where,
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              tipo: true,
            },
          },
        },
        orderBy: {
          data_aplicacao: "desc",
        },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.vaccine.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        vacinas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao listar vacinas:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao listar vacinas",
        details: error.message,
      },
    });
  }
};

/**
 * Buscar histórico de vacinas de um pet específico
 */
export const buscarVacinasPorPet = async (req, res) => {
  try {
    const { pet_id } = req.params;

    // Verificar se o pet existe
    const pet = await prisma.pet.findUnique({
      where: { id: pet_id },
      select: { id: true, nome: true, tipo: true },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    const vacinas = await prisma.vaccine.findMany({
      where: { pet_id },
      orderBy: {
        data_aplicacao: "desc",
      },
    });

    res.json({
      success: true,
      data: {
        pet,
        vacinas,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar vacinas do pet:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao buscar vacinas do pet",
        details: error.message,
      },
    });
  }
};

/**
 * Cadastrar nova vacina para um pet
 */
export const cadastrarVacina = async (req, res) => {
  try {
    const {
      pet_id,
      nome_vacina,
      data_aplicacao,
      data_revacina,
      lote,
      fabricante,
      veterinario,
      observacoes,
    } = req.body;

    // Validações básicas
    if (!pet_id || !nome_vacina || !data_aplicacao) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Campos obrigatórios: pet_id, nome_vacina, data_aplicacao",
        },
      });
    }

    // Verificar se o pet existe
    const pet = await prisma.pet.findUnique({
      where: { id: pet_id },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    // Criar vacina
    const vacina = await prisma.vaccine.create({
      data: {
        pet_id,
        nome_vacina,
        data_aplicacao: new Date(data_aplicacao),
        data_revacina: data_revacina ? new Date(data_revacina) : null,
        lote,
        fabricante,
        veterinario,
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
      },
    });

    console.log(`✅ Vacina cadastrada: ${nome_vacina} para pet ${pet.nome}`);

    res.status(201).json({
      success: true,
      data: vacina,
      message: "Vacina cadastrada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao cadastrar vacina:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao cadastrar vacina",
        details: error.message,
      },
    });
  }
};

/**
 * Cadastrar múltiplas vacinas de uma vez
 */
export const cadastrarVacinasEmLote = async (req, res) => {
  try {
    const { pet_id, vacinas } = req.body;

    // Validações básicas
    if (
      !pet_id ||
      !vacinas ||
      !Array.isArray(vacinas) ||
      vacinas.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Campos obrigatórios: pet_id e array de vacinas",
        },
      });
    }

    // Verificar se o pet existe
    const pet = await prisma.pet.findUnique({
      where: { id: pet_id },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Pet não encontrado",
        },
      });
    }

    // Validar cada vacina
    for (const vacina of vacinas) {
      if (!vacina.nome_vacina || !vacina.data_aplicacao) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Cada vacina deve ter nome_vacina e data_aplicacao",
          },
        });
      }
    }

    // Criar todas as vacinas
    const vacinasCriadas = await Promise.all(
      vacinas.map((vacina) =>
        prisma.vaccine.create({
          data: {
            pet_id,
            nome_vacina: vacina.nome_vacina,
            data_aplicacao: new Date(vacina.data_aplicacao),
            data_revacina: vacina.data_revacina
              ? new Date(vacina.data_revacina)
              : null,
            lote: vacina.lote,
            fabricante: vacina.fabricante,
            veterinario: vacina.veterinario,
            observacoes: vacina.observacoes,
          },
        })
      )
    );

    console.log(
      `✅ ${vacinasCriadas.length} vacina(s) cadastrada(s) para pet ${pet.nome}`
    );

    res.status(201).json({
      success: true,
      data: {
        pet: {
          id: pet.id,
          nome: pet.nome,
        },
        vacinas: vacinasCriadas,
      },
      message: `${vacinasCriadas.length} vacina(s) cadastrada(s) com sucesso`,
    });
  } catch (error) {
    console.error("❌ Erro ao cadastrar vacinas em lote:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao cadastrar vacinas",
        details: error.message,
      },
    });
  }
};

/**
 * Atualizar informações de uma vacina
 */
export const atualizarVacina = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_vacina,
      data_aplicacao,
      data_revacina,
      lote,
      fabricante,
      veterinario,
      observacoes,
    } = req.body;

    // Verificar se a vacina existe
    const vacinaExistente = await prisma.vaccine.findUnique({
      where: { id },
    });

    if (!vacinaExistente) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Vacina não encontrada",
        },
      });
    }

    // Atualizar vacina
    const vacinaAtualizada = await prisma.vaccine.update({
      where: { id },
      data: {
        nome_vacina,
        data_aplicacao: data_aplicacao ? new Date(data_aplicacao) : undefined,
        data_revacina: data_revacina ? new Date(data_revacina) : null,
        lote,
        fabricante,
        veterinario,
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
      },
    });

    console.log(`✅ Vacina ${id} atualizada`);

    res.json({
      success: true,
      data: vacinaAtualizada,
      message: "Vacina atualizada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar vacina:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao atualizar vacina",
        details: error.message,
      },
    });
  }
};

/**
 * Deletar registro de vacina
 */
export const deletarVacina = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a vacina existe
    const vacina = await prisma.vaccine.findUnique({
      where: { id },
    });

    if (!vacina) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Vacina não encontrada",
        },
      });
    }

    // Deletar vacina
    await prisma.vaccine.delete({
      where: { id },
    });

    console.log(`✅ Vacina ${id} removida`);

    res.json({
      success: true,
      message: "Vacina removida com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao remover vacina:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao remover vacina",
        details: error.message,
      },
    });
  }
};
