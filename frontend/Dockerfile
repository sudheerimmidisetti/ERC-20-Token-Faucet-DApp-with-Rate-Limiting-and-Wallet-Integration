# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Environment variables must be available at build time
ARG VITE_RPC_URL
ARG VITE_TOKEN_ADDRESS
ARG VITE_FAUCET_ADDRESS
ENV VITE_RPC_URL=$VITE_RPC_URL
ENV VITE_TOKEN_ADDRESS=$VITE_TOKEN_ADDRESS
ENV VITE_FAUCET_ADDRESS=$VITE_FAUCET_ADDRESS
RUN npm run build

# Serve Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY server.js .
RUN npm install express
EXPOSE 3000
CMD ["node", "server.js"]