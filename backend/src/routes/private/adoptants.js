import express from "express";
import {
  getCandidatos,
  getCandidatoById,
  updateCandidatoStatus,
  getCandidatoStats,
} from "../../controllers/candidatosController.js";
import {
  validateUpdateCandidatoStatus,
  validatePetId,
} from "../../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Aplicar autenticação e validação de admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/admin/adoptants
 * @desc Listar todos os candidatos/adotantes
 * @access Admin
 * @queries ?status=pendente&page=1&limit=10
 */
router.get("/", getCandidatos);

/**
 * @route GET /api/admin/adoptants/stats
 * @desc Obter estatísticas dos candidatos
 * @access Admin
 */
router.get("/stats", getCandidatoStats);

/**
 * @route GET /api/admin/adoptants/:id
 * @desc Buscar candidato específico por ID
 * @access Admin
 */
router.get("/:id", validatePetId, getCandidatoById);

/**
 * @route PATCH /api/admin/adoptants/:id/status
 * @desc Atualizar status do candidato (aprovar, reprovar, pendente)
 * @access Admin
 */
router.patch(
  "/:id/status",
  validateUpdateCandidatoStatus,
  updateCandidatoStatus
);

export default router;
