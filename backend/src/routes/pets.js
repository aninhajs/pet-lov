import express from 'express'
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  updatePetStatus,
  deletePet,
  getPetStats
} from '../controllers/petsController.js'
import {
  validateCreatePet,
  validateUpdatePet,
  validatePetId,
  validatePetQuery,
  validateUpdateStatus
} from '../middleware/validation.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * @route GET /api/pets
 * @desc Listar todos os pets com filtros e paginação
 * @access Public
 * @queries ?tipo=cao&status=disponivel&porte=medio&page=1&limit=10
 */
router.get('/', validatePetQuery, optionalAuth, getPets)

/**
 * @route GET /api/pets/stats
 * @desc Obter estatísticas dos pets
 * @access Admin
 */
router.get('/stats', authenticateToken, requireAdmin, getPetStats)

/**
 * @route GET /api/pets/:id
 * @desc Buscar pet por ID
 * @access Public
 */
router.get('/:id', validatePetId, getPetById)

/**
 * @route POST /api/pets
 * @desc Cadastrar novo pet
 * @access Admin
 */
router.post('/', authenticateToken, requireAdmin, validateCreatePet, createPet)

/**
 * @route PUT /api/pets/:id
 * @desc Atualizar pet completo
 * @access Admin
 */
router.put('/:id', authenticateToken, requireAdmin, validateUpdatePet, updatePet)

/**
 * @route PATCH /api/pets/:id/status
 * @desc Atualizar apenas status do pet
 * @access Admin
 */
router.patch('/:id/status', authenticateToken, requireAdmin, validateUpdateStatus, updatePetStatus)

/**
 * @route DELETE /api/pets/:id
 * @desc Deletar pet
 * @access Admin
 */
router.delete('/:id', authenticateToken, requireAdmin, validatePetId, deletePet)

export default router