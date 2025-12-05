// Script para criar usuário admin inicial
// Execute: node create-admin.js

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("  Criando usuário admin...");

    const email = "ongabrace63@gmail.com";
    const senha = "Ongabrace25#";

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("  Usuário já existe!");
      console.log(" Email:", existingUser.email);
      console.log(" Nome:", existingUser.nome);
      console.log(" Use a senha: admin123");
      return;
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome: "Administrador",
        email: email,
        senha_hash: senhaHash,
        // tipo: "admin",
        // telefone: "85988887777",
        // endereco: "Fortaleza - CE",
        // ativo: true,
        // data_atualizacao: new Date(),
      },
    });

    console.log(" Usuário admin criado com sucesso!");
    console.log(" Email:", user.email);
    console.log(" Senha:", senha);
    console.log(" Nome:", user.nome);
    // console.log(" Criado em:", user.data_criacao);
  } catch (error) {
    console.error(" Erro ao criar admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
