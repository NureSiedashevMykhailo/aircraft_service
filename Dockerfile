# Multi-stage build for Nest.js API
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache openssl

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma schema
COPY prisma ./prisma
COPY package.json ./

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY . .

# Build Nest.js application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL and PostgreSQL client for wait script
RUN apk add --no-cache openssl postgresql-client

# Copy wait script
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application (wait for DB first)
# Note: wait-for-db.sh requires root, so we'll use depends_on in docker-compose instead
CMD ["node", "dist/main.js"]

