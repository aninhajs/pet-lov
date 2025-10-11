import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

/**
 * @route POST /api/auth/login
 * @desc Login do usuário
 * @access Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
    
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Dados inválidos',
          details: errors.array()
        }
      })
    }
    
    const { email, senha } = req.body
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !user.ativo) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciais inválidas'
        }
      })
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash)
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Credenciais inválidas'
        }
      })
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        }
      },
      message: 'Login realizado com sucesso!'
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor'
      }
    })
  }
})

/**
 * @route POST /api/auth/register
 * @desc Cadastrar novo usuário admin (temporário para desenvolvimento)
 * @access Public (em produção, remover ou proteger)
 */
router.post('/register', [
  body('nome')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
    
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
    
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
    
  body('telefone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Telefone inválido')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Dados inválidos',
          details: errors.array()
        }
      })
    }
    
    const { nome, email, senha, telefone, endereco } = req.body
    
    // Verificar se email já existe
    const userExistente = await prisma.user.findUnique({
      where: { email }
    })
    
    if (userExistente) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Email já está em uso'
        }
      })
    }
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)
    
    // Criar usuário
    const novoUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha_hash: senhaHash,
        telefone,
        endereco,
        tipo: 'admin' // Por padrão, criar como admin
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        data_criacao: true
      }
    })
    
    res.status(201).json({
      success: true,
      data: novoUser,
      message: 'Usuário cadastrado com sucesso!'
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro interno do servidor'
      }
    })
  }
})

export default router