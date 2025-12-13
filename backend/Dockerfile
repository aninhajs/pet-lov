FROM node:20-alpine

WORKDIR /app

# Instala dependências do projeto
COPY package*.json ./
RUN npm ci

# Gera o cliente do Prisma (usa um DATABASE_URL padrão só para geração)
COPY prisma ./prisma
ARG DATABASE_URL=postgresql://user:password@localhost:5432/db
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Copia restante do código
COPY src ./src
COPY create-admin.js ./create-admin.js
COPY reset-password.js ./reset-password.js
COPY seed-candidatos.js ./seed-candidatos.js
COPY test-users.js ./test-users.js

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "src/server.js"]
