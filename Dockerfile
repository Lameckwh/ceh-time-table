# Multi-stage Dockerfile for Next.js app on Red Hat UBI (OpenShift-ready)
# --- Build Stage ---


FROM registry.access.redhat.com/ubi8/nodejs-20 AS builder
WORKDIR /app
USER 0
RUN chown -R 1001:0 /app

# Copy package files
COPY package.json package-lock.json* ./
# Copy prisma schema before npm install
COPY prisma ./prisma
# Ensure correct permissions for user 1001
RUN chown -R 1001:0 /app
USER 1001
RUN npm install --legacy-peer-deps
# Copy the rest of the source code
COPY . .

# Build Next.js app
RUN npm run build

# --- Production Stage ---

FROM registry.access.redhat.com/ubi8/nodejs-20-minimal
WORKDIR /app
LABEL io.openshift.expose-services="3000:http" \
      io.openshift.tags="nextjs,nodejs,ubi8" \
      maintainer="Lameckwh"
USER 0
RUN chown -R 1001:0 /app \
    && chgrp -R 0 /app \
    && chmod -R g=u /app
USER 1001

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules


# Declare volume for persistent or shared data (adjust path as needed)
VOLUME ["/app/data"]

# Expose port (default for Next.js)
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Run Next.js app
CMD ["npx", "next", "start", "-p", "3000"]
