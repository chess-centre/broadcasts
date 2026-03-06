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
RUN pnpm --filter @broadcasts/relay deploy --prod /app/deployed

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/deployed/node_modules ./node_modules
COPY --from=builder /app/deployed/dist ./dist
COPY --from=builder /app/deployed/package.json ./
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/index.js"]
