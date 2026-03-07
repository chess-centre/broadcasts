FROM node:20-slim
WORKDIR /app
RUN npm install ws@8
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/index.js"]
