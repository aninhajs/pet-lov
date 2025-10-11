import express from "express";
import {
  getAdocoes,
  getAdocaoById,
  createAdocao,
  updateAdocaoStatus,
  getAdocoesByCandidato,
  getAdocoesStats,
} from "../controllers/adocoesController.js";
import {
  validateCreateAdocao,
  validateUpdateAdocaoStatus,
  validatePetId,
} from "../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/adocoes
 * @desc Listar todas as adoções (Admin)
 * @access Admin
 * @queries ?status=ativa&page=1&limit=10
 */
router.get("/", authenticateToken, requireAdmin, getAdocoes);

/**
 * @route GET /api/adocoes/stats
 * @desc Obter estatísticas das adoções (Admin)
 * @access Admin
 */
router.get("/stats", authenticateToken, requireAdmin, getAdocoesStats);

/**
 * @route GET /api/adocoes/:id
 * @desc Buscar adoção por ID (Admin)
 * @access Admin
 */
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  validatePetId,
  getAdocaoById
);

/**
 * @route GET /api/adocoes/candidato/:candidato_id
 * @desc Buscar adoções de um candidato específico
 * @access Admin
 */
router.get(
  "/candidato/:candidato_id",
  authenticateToken,
  requireAdmin,
  getAdocoesByCandidato
);

/**
 * @route POST /api/adocoes
 * @desc Finalizar adoção (Admin)
 * @access Admin
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCreateAdocao,
  createAdocao
);

/**
 * @route PATCH /api/adocoes/:id/status
 * @desc Atualizar status da adoção (Admin)
 * @access Admin
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validateUpdateAdocaoStatus,
  updateAdocaoStatus
);

export default router;
