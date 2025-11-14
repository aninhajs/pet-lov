import express from "express";
import {
  getPets,
  getPetById,
  updatePet,
  updatePetStatus,
  deletePet,
} from "../../controllers/petsController.js";
import {
  validateUpdatePet,
  validatePetId,
  validateUpdateStatus,
  validatePetQuery,
} from "../../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Aplicar autenticação e validação de admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/admin/gerenciar-pets
 * @desc Listar todos os pets (visão admin com todos os status)
 * @access Admin
 */
router.get("/", validatePetQuery, getPets);

/**
 * @route GET /api/admin/gerenciar-pets/:id
 * @desc Buscar pet específico por ID para edição
 * @access Admin
 */
router.get("/:id", validatePetId, getPetById);

/**
 * @route PUT /api/admin/gerenciar-pets/:id
 * @desc Atualizar pet completo
 * @access Admin
 */
router.put("/:id", validateUpdatePet, updatePet);

/**
 * @route PATCH /api/admin/gerenciar-pets/:id/status
 * @desc Atualizar apenas status do pet (disponível, em_processo, adotado)
 * @access Admin
 */
router.patch("/:id/status", validateUpdateStatus, updatePetStatus);

/**
 * @route DELETE /api/admin/gerenciar-pets/:id
 * @desc Deletar pet
 * @access Admin
 */
router.delete("/:id", validatePetId, deletePet);

export default router;
