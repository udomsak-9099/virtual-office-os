FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
RUN npm install --legacy-peer-deps --production=false

# Generate Prisma client
FROM deps AS prisma
WORKDIR /app
COPY packages/database/prisma ./packages/database/prisma
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build
FROM prisma AS builder
WORKDIR /app
COPY . .
RUN npx nest build --path apps/api/tsconfig.json

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

EXPOSE 3001
ENV APP_PORT=3001

CMD ["node", "apps/api/dist/main.js"]
