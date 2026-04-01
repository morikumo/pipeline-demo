# ─── Stage 1: dependencies ───────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Met à jour les packages système pour corriger les CVEs connues
RUN apk update && apk upgrade --no-cache

COPY app/package*.json ./
RUN npm ci --only=production

# ─── Stage 2: final image ─────────────────────────────────────────────────────
FROM node:20-alpine AS final

# Met à jour les packages système ici aussi (c'est l'image qui sera scannée)
RUN apk update && apk upgrade --no-cache && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY app/index.js ./

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]