# Multi-stage Dockerfile for Next.js app on Red Hat UBI (OpenShift-ready)
# --- Build Stage ---
FROM registry.access.redhat.com/ubi8/nodejs-20 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# --- Production Stage ---
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/.env ./

# Expose port (default for Next.js)
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Run Next.js app
CMD ["npx", "next", "start", "-p", "3000"]
