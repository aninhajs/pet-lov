import express from "express";
import { createPet } from "../../controllers/petsController.js";
import { validateCreatePet } from "../../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Aplicar autenticação e validação de admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route POST /api/admin/cadastrar-pet
 * @desc Cadastrar novo pet
 * @access Admin
 */
router.post("/", validateCreatePet, createPet);

export default router;
