FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npx prisma generate

#RUN npx prisma migrate deploy

RUN npm run build

FROM node:22-alpine as production

WORKDIR /app

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]
