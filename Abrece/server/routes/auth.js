// server/routes/auth.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// delegate correto (model: ong_credencial, id: id_crecendial, email único, password)
const Cred = prisma.ong_credencial;

// helper: BigInt a partir de string/number
const toBigInt = (v) => (typeof v === "bigint" ? v : BigInt(String(v)));

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    const cred = await Cred.findUnique({ where: { email } });
    if (!cred || !cred.password)
      return res.status(401).json({ error: "Credenciais inválidas" });

    const dbPass = cred.password;
    const isHash = typeof dbPass === "string" && dbPass.startsWith("$2");
    const valid = isHash ? await bcrypt.compare(password, dbPass) : dbPass === password;
    if (!valid) return res.status(401).json({ error: "Credenciais inválidas" });

    // 🔑 Converta BigInt -> string no token e na resposta
    const payload = { id: String(cred.id_crecendial), email: cred.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error("Auth login error:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Token ausente" });

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ error: "Token inválido" });

    const user = await Cred.findUnique({
      where: { id_crecendial: toBigInt(decoded.id) },
      select: { id_crecendial: true, email: true },
    });
    if (!user) return res.status(401).json({ error: "Token inválido" });

    return res.json({ user: { id: String(user.id_crecendial), email: user.email } });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
