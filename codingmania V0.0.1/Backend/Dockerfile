# ---- CodingMania Backend (Node + Express + Prisma) ----
# Debian-based image: Prisma needs OpenSSL and ffprobe-static ships a glibc binary.
FROM node:20-bookworm-slim

# Prisma engine deps
RUN apt-get update -y \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies (cached unless package files change)
COPY package*.json ./
RUN npm ci

# Generate Prisma client (needs schema only)
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source
COPY . .

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Entrypoint syncs the DB schema, then runs the CMD.
# Strip any CRLF line endings (Windows hosts) so the shebang works on Linux.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
