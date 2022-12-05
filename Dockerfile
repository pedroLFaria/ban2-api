FROM node:18.12.1 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run build

FROM node:18.12.1-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --quiet --only=production
COPY --from=builder ./app/dist ./dist
EXPOSE 4000
CMD npm run start:prod