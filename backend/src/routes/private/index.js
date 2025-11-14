import express from "express";
import adminRoutes from "./admin.js";
import gerenciarPetsRoutes from "./gerenciarPets.js";
import cadastrarPetRoutes from "./cadastrarPet.js";
import adoptantsRoutes from "./adoptants.js";
import cartaoVacinaRoutes from "./cartaoVacina.js";

const router = express.Router();

/**
 * Rotas Privadas - Requerem autenticação e permissão de Admin
 * Todas as rotas abaixo são protegidas pelos middlewares:
 * - authenticateToken: Verifica se o usuário está autenticado
 * - requireAdmin: Verifica se o usuário é admin
 */

// Dashboard e estatísticas gerais
router.use("/admin", adminRoutes);

// Gerenciar pets (listar, editar, deletar, atualizar status)
router.use("/admin/gerenciar-pets", gerenciarPetsRoutes);

// Cadastrar novo pet
router.use("/admin/cadastrar-pet", cadastrarPetRoutes);

// Gerenciar candidatos/adotantes
router.use("/admin/adoptants", adoptantsRoutes);

// Cartão de vacina dos pets
router.use("/admin/cartao-vacina", cartaoVacinaRoutes);

export default router;
