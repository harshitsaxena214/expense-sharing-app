FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY . .
RUN npm run build

# Don't run as root
USER node

EXPOSE 8000

CMD ["node", "dist/server.js"]