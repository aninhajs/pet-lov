import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token de acesso requerido",
        },
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        tipo: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Usuário não encontrado",
        },
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token inválido",
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          message: "Token expirado",
        },
      });
    }

    console.error("Erro na autenticação:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Erro interno do servidor",
      },
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo !== "admin") {
    return res.status(403).json({
      success: false,
      error: {
        message:
          "Acesso negado. Apenas administradores podem realizar esta ação.",
      },
    });
  }

  next();
};

// Middleware opcional de auth (para rotas públicas que podem ter funcionalidades extras com auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          tipo: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Em caso de erro, continua sem usuário autenticado
    next();
  }
};
