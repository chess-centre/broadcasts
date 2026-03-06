FROM node:20-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/protocol/package.json packages/protocol/
COPY packages/config/ packages/config/
COPY apps/relay/package.json apps/relay/
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY packages/protocol/ packages/protocol/
COPY apps/relay/ apps/relay/
RUN pnpm --filter @broadcasts/protocol build && pnpm --filter @broadcasts/relay build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/apps/relay/dist ./dist
COPY --from=builder /app/apps/relay/package.json ./
COPY --from=builder /app/node_modules ./node_modules
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/index.js"]
