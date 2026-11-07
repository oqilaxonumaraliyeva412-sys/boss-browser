# Multi-stage Docker build for BOSS BROWSER Web Platform
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:vite

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
