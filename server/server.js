import express from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import petsRouter from "./routes/pets.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/pets", petsRouter);
app.use("/api/auth", authRouter);

app.listen(port, "0.0.0.0", () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
