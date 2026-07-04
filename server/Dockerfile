# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# Stage 2: Production Run
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

# Expose port and start server
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
