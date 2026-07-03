FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NEXT_MONGODB_URI
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_MONGODB_URI=$NEXT_MONGODB_URI
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/tsconfig.json .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
