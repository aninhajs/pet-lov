import express from "express";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";
import {
  listarVacinas,
  buscarVacinasPorPet,
  cadastrarVacina,
  cadastrarVacinasEmLote,
  atualizarVacina,
  deletarVacina,
} from "../../controllers/vacinasController.js";

const router = express.Router();

// Aplicar autenticação e validação de admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/admin/cartao-vacina
 * @desc Listar todas as vacinas cadastradas
 * @access Admin
 * @queries ?pet_id=1&page=1&limit=10
 */
router.get("/", listarVacinas);

/**
 * @route GET /api/admin/cartao-vacina/pet/:pet_id
 * @desc Buscar histórico de vacinas de um pet específico
 * @access Admin
 */
router.get("/pet/:pet_id", buscarVacinasPorPet);

/**
 * @route POST /api/admin/cartao-vacina
 * @desc Cadastrar nova vacina para um pet
 * @access Admin
 */
router.post("/", cadastrarVacina);

/**
 * @route POST /api/admin/cartao-vacina/lote
 * @desc Cadastrar múltiplas vacinas de uma vez
 * @access Admin
 */
router.post("/lote", cadastrarVacinasEmLote);

/**
 * @route PUT /api/admin/cartao-vacina/:id
 * @desc Atualizar informações de uma vacina
 * @access Admin
 */
router.put("/:id", atualizarVacina);

/**
 * @route DELETE /api/admin/cartao-vacina/:id
 * @desc Deletar registro de vacina
 * @access Admin
 */
router.delete("/:id", deletarVacina);

export default router;
