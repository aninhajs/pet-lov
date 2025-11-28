// Teste rápido para verificar usuários no banco
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log("🔍 Buscando todos os usuários no banco...\n");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        data_criacao: true,
      },
    });

    if (users.length === 0) {
      console.log("⚠️  Nenhum usuário encontrado no banco!");
      console.log("📝 Crie um usuário com: node create-admin.js\n");
    } else {
      console.log(`✅ Encontrados ${users.length} usuário(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.nome}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Tipo: ${user.tipo}`);
        console.log(`   ✓ Ativo: ${user.ativo ? "Sim" : "Não"}`);
        console.log(
          `   📅 Criado: ${user.data_criacao.toLocaleString("pt-BR")}`
        );
        console.log("");
      });

      console.log("💡 Use estes emails para fazer login no frontend");
      console.log(
        "🔑 Senha padrão (se criado com create-admin.js): admin123\n"
      );
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
