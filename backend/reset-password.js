// reset-password.js - Resetar senha do usuário
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = "anajeize27@gmail.com";
    const novaSenha = "admin123"; // Nova senha simples para teste

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha no banco
    const user = await prisma.user.update({
      where: { email },
      data: { senha_hash: senhaHash },
    });

    console.log("\n Senha resetada com sucesso!");
    console.log(" Email:", email);
    console.log(" Nova senha:", novaSenha);
    console.log(" Usuário:", user.nome);
    console.log("\n Agora tente fazer login com:");
    console.log("   Email: anajeize27@gmail.com");
    console.log("   Senha: admin123");
  } catch (error) {
    console.error(" Erro ao resetar senha:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
