🔑 Credenciais do Supabase

As credenciais do Supabase são as chaves que permitem seu app se conectar ao banco de dados hospedado na nuvem.
Elas ficam disponíveis em Project Settings → API dentro do painel do Supabase.

🧩 O que cada credencial faz
🟦 SUPABASE_URL

É o endereço base do seu projeto no Supabase.
Serve para o SDK saber para onde enviar as requisições.

Exemplo:

https://abcd1234efgh.supabase.co

🟩 SUPABASE_ANON_KEY

É a chave pública.
Pode ser usada no frontend (React, Vite, etc.), porque tem permissões limitadas.
Ela respeita as regras do RLS (Row Level Security).

Usos típicos:

Fazer login/cadastro de usuários;

Buscar ou salvar dados permitidos pelas regras do banco.

🟥 SUPABASE_SERVICE_KEY

É a chave privada do projeto (com acesso total ao banco).
⚠️ Use apenas no backend (Node, Express, etc.)!

Por quê?

Essa chave ignora o RLS e pode alterar qualquer dado;

Se alguém tiver acesso a ela, consegue manipular todo o banco.