import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Importar rotas públicas
import petsRoutes from "./routes/pets.js";
import authRoutes from "./routes/auth.js";
import candidatosRoutes from "./routes/candidatos.js";
import adocoesRoutes from "./routes/adocoes.js";

// Importar rotas privadas (admin)
import privateRoutes from "./routes/private/index.js";

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://seu-frontend.vercel.app"]
        : [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
          ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rota de saúde
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Pet Lov API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Rotas Públicas da API
app.use("/api/pets", petsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/candidatos", candidatosRoutes);
app.use("/api/adocoes", adocoesRoutes);

// Rotas Privadas (Admin) - Protegidas por autenticação
app.use("/api", privateRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro capturado:", err);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Erro interno do servidor",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Rota não encontrada",
      path: req.originalUrl,
    },
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`\nROTAS PÚBLICAS:`);
  console.log(`  Pets: http://localhost:${PORT}/api/pets`);
  console.log(`  Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  Candidatos: http://localhost:${PORT}/api/candidatos`);
  console.log(`  Adoções: http://localhost:${PORT}/api/adocoes`);
  console.log(`\nROTAS PRIVADAS (Admin):`);
  console.log(`  Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(
    `  Cadastrar Pet: http://localhost:${PORT}/api/admin/cadastrar-pet`
  );
  console.log(
    `  Gerenciar Pets: http://localhost:${PORT}/api/admin/gerenciar-pets`
  );
  console.log(`  Adotantes: http://localhost:${PORT}/api/admin/adoptants`);
  console.log(
    `  Cartão Vacina: http://localhost:${PORT}/api/admin/cartao-vacina`
  );
});
