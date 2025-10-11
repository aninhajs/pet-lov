import express from "express";
import {
  getCandidatos,
  getCandidatoById,
  createCandidato,
  updateCandidatoStatus,
  createInteresse,
  getCandidatoStats,
} from "../controllers/candidatosController.js";
import {
  validateCreateCandidato,
  validateUpdateCandidatoStatus,
  validateCreateInteresse,
  validatePetId,
} from "../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/candidatos
 * @desc Listar todos os candidatos (Admin)
 * @access Admin
 * @queries ?status=pendente&page=1&limit=10
 */
router.get("/", authenticateToken, requireAdmin, getCandidatos);

/**
 * @route GET /api/candidatos/stats
 * @desc Obter estatísticas dos candidatos (Admin)
 * @access Admin
 */
router.get("/stats", authenticateToken, requireAdmin, getCandidatoStats);

/**
 * @route GET /api/candidatos/:id
 * @desc Buscar candidato por ID (Admin)
 * @access Admin
 */
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  validatePetId,
  getCandidatoById
);

/**
 * @route POST /api/candidatos
 * @desc Criar novo candidato (formulário público de adoção)
 * @access Public
 */
router.post("/", validateCreateCandidato, createCandidato);

/**
 * @route PATCH /api/candidatos/:id/status
 * @desc Atualizar status do candidato (Admin)
 * @access Admin
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validateUpdateCandidatoStatus,
  updateCandidatoStatus
);

/**
 * @route POST /api/candidatos/interesse
 * @desc Criar interesse de candidato em pet específico
 * @access Public/Admin
 */
router.post("/interesse", validateCreateInteresse, createInteresse);

export default router;
