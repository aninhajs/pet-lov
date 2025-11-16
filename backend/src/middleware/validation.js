import { body, param, query } from "express-validator";

// Validação para criar pet
export const validateCreatePet = [
  body("nome")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nome deve ter entre 2 e 50 caracteres"),

  body("tipo")
    .notEmpty()
    .withMessage("Tipo é obrigatório")
    .isIn(["cao", "gato", "outros"])
    .withMessage("Tipo deve ser: cao, gato ou outros"),

  body("idade")
    .notEmpty()
    .withMessage("Idade é obrigatória")
    .isLength({ max: 20 })
    .withMessage("Idade deve ter no máximo 20 caracteres"),

  body("porte")
    .notEmpty()
    .withMessage("Porte é obrigatório")
    .isIn(["pequeno", "medio", "grande"])
    .withMessage("Porte deve ser: pequeno, medio ou grande"),

  body("sexo")
    .notEmpty()
    .withMessage("Sexo é obrigatório")
    .isIn(["macho", "femea"])
    .withMessage("Sexo deve ser: macho ou femea"),

  body("cor")
    .optional()
    .isLength({ max: 30 })
    .withMessage("Cor deve ter no máximo 30 caracteres"),

  body("descricao")
    .notEmpty()
    .withMessage("Descrição é obrigatória")
    .isLength({ min: 10, max: 500 })
    .withMessage("Descrição deve ter entre 10 e 500 caracteres"),

  body("peso")
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage("Peso deve ser um número entre 0.1 e 100"),

  body("temperamento")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Temperamento deve ter no máximo 100 caracteres"),

  body("castrado")
    .optional()
    .isBoolean()
    .withMessage("Castrado deve ser true ou false"),

  body("vacinado")
    .optional()
    .isBoolean()
    .withMessage("Vacinado deve ser true ou false"),

  body("vermifugado")
    .optional()
    .isBoolean()
    .withMessage("Vermifugado deve ser true ou false"),

  body("necessidades_especiais")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Necessidades especiais deve ter no máximo 300 caracteres"),

  body("historia")
    .optional()
    .isLength({ max: 500 })
    .withMessage("História deve ter no máximo 500 caracteres"),
];

// Validação para atualizar pet
export const validateUpdatePet = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("nome")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nome deve ter entre 2 e 50 caracteres"),

  body("tipo")
    .optional()
    .isIn(["cao", "gato", "outros"])
    .withMessage("Tipo deve ser: cao, gato ou outros"),

  body("porte")
    .optional()
    .isIn(["pequeno", "medio", "grande"])
    .withMessage("Porte deve ser: pequeno, medio ou grande"),

  body("sexo")
    .optional()
    .isIn(["macho", "femea"])
    .withMessage("Sexo deve ser: macho ou femea"),

  body("status")
    .optional()
    .isIn(["disponivel", "em_processo", "adotado", "indisponivel"])
    .withMessage(
      "Status deve ser: disponivel, em_processo, adotado ou indisponivel"
    ),

  body("peso")
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage("Peso deve ser um número entre 0.1 e 100"),

  body("descricao")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Descrição deve ter entre 10 e 500 caracteres"),
];

// Validação para parâmetro ID
export const validatePetId = [
  param("id")
    .isString()
    .withMessage("ID deve ser uma string válida")
    .isLength({ min: 10 })
    .withMessage("ID inválido"),
];

// Validação para query parameters
export const validatePetQuery = [
  query("tipo")
    .optional()
    .isIn(["cao", "gato", "outros"])
    .withMessage("Tipo deve ser: cao, gato ou outros"),

  query("status")
    .optional()
    .isIn(["disponivel", "em_processo", "adotado", "indisponivel"])
    .withMessage(
      "Status deve ser: disponivel, em_processo, adotado ou indisponivel"
    ),

  query("porte")
    .optional()
    .isIn(["pequeno", "medio", "grande"])
    .withMessage("Porte deve ser: pequeno, medio ou grande"),

  query("sexo")
    .optional()
    .isIn(["macho", "femea"])
    .withMessage("Sexo deve ser: macho ou femea"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page deve ser um número inteiro maior que 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit deve ser um número entre 1 e 50"),
];

// Validação para atualizar status
export const validateUpdateStatus = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("status")
    .notEmpty()
    .withMessage("Status é obrigatório")
    .isIn(["disponivel", "em_processo", "adotado", "indisponivel"])
    .withMessage(
      "Status deve ser: disponivel, em_processo, adotado ou indisponivel"
    ),
];

// ========== VALIDAÇÕES PARA CANDIDATOS ==========

// Validação para criar candidato
export const validateCreateCandidato = [
  body("nome")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),

  body("telefone")
    .notEmpty()
    .withMessage("Telefone é obrigatório")
    .isMobilePhone("pt-BR")
    .withMessage("Telefone deve estar no formato brasileiro"),

  body("endereco")
    .notEmpty()
    .withMessage("Endereço é obrigatório")
    .isLength({ min: 10, max: 200 })
    .withMessage("Endereço deve ter entre 10 e 200 caracteres"),

  body("tipo_moradia")
    .notEmpty()
    .withMessage("Tipo de moradia é obrigatório")
    .isLength({ max: 100 })
    .withMessage("Tipo de moradia deve ter no máximo 100 caracteres"),

  body("tempo_disponivel")
    .notEmpty()
    .withMessage("Tempo disponível é obrigatório")
    .isLength({ max: 100 })
    .withMessage("Tempo disponível deve ter no máximo 100 caracteres"),

  body("experiencia_pets")
    .notEmpty()
    .withMessage("Experiência com pets é obrigatória")
    .isLength({ min: 5, max: 300 })
    .withMessage("Experiência deve ter entre 5 e 300 caracteres"),

  body("motivacao")
    .notEmpty()
    .withMessage("Motivação é obrigatória")
    .isLength({ min: 10, max: 500 })
    .withMessage("Motivação deve ter entre 10 e 500 caracteres"),

  body("pet_id")
    .optional()
    .isString()
    .withMessage("ID do pet deve ser uma string válida"),
];

// Validação para atualizar status do candidato
export const validateUpdateCandidatoStatus = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("status")
    .notEmpty()
    .withMessage("Status é obrigatório")
    .isIn(["pendente", "aprovado", "rejeitado"])
    .withMessage("Status deve ser: pendente, aprovado ou rejeitado"),

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações deve ter no máximo 500 caracteres"),
];

// Validação para criar interesse
export const validateCreateInteresse = [
  body("candidato_id")
    .notEmpty()
    .withMessage("ID do candidato é obrigatório")
    .isString()
    .withMessage("ID do candidato deve ser uma string"),

  body("pet_id")
    .notEmpty()
    .withMessage("ID do pet é obrigatório")
    .isString()
    .withMessage("ID do pet deve ser uma string"),
];

// ========== VALIDAÇÕES PARA ADOÇÕES ==========

// Validação para criar adoção
export const validateCreateAdocao = [
  body("pet_id")
    .notEmpty()
    .withMessage("ID do pet é obrigatório")
    .isString()
    .withMessage("ID do pet deve ser uma string"),

  body("candidato_id")
    .notEmpty()
    .withMessage("ID do candidato é obrigatório")
    .isString()
    .withMessage("ID do candidato deve ser uma string"),

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações deve ter no máximo 500 caracteres"),

  body("taxa_adocao")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Taxa de adoção deve ser um valor positivo"),
];

// Validação para atualizar status da adoção
export const validateUpdateAdocaoStatus = [
  param("id").isString().withMessage("ID deve ser uma string válida"),

  body("status")
    .notEmpty()
    .withMessage("Status é obrigatório")
    .isIn(["ativa", "cancelada", "devolvido"])
    .withMessage("Status deve ser: ativa, cancelada ou devolvido"),

  body("observacoes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observações deve ter no máximo 500 caracteres"),
];
