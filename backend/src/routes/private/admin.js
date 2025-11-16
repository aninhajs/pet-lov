import express from "express";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";
import { getPetStats } from "../../controllers/petsController.js";
import { getCandidatoStats } from "../../controllers/candidatosController.js";
import { getAdocoesStats } from "../../controllers/adocoesController.js";

const router = express.Router();

// Aplicar autenticação e validação de admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/admin/dashboard
 * @desc Obter dados do dashboard admin (estatísticas gerais)
 * @access Admin
 */
router.get("/dashboard", async (req, res) => {
  try {
    // Aqui você pode criar uma função consolidada que retorna todas as stats
    // Por enquanto, retorna uma estrutura básica
    res.json({
      success: true,
      data: {
        message: "Dashboard admin - endpoint para estatísticas gerais",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Erro ao carregar dashboard",
      },
    });
  }
});

/**
 * @route GET /api/admin/stats/pets
 * @desc Obter estatísticas dos pets
 * @access Admin
 */
router.get("/stats/pets", getPetStats);

/**
 * @route GET /api/admin/stats/candidatos
 * @desc Obter estatísticas dos candidatos
 * @access Admin
 */
router.get("/stats/candidatos", getCandidatoStats);

/**
 * @route GET /api/admin/stats/adocoes
 * @desc Obter estatísticas das adoções
 * @access Admin
 */
router.get("/stats/adocoes", getAdocoesStats);

export default router;
