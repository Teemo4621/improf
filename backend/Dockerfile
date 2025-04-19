FROM node:22-slim as build

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile --production

COPY ./ ./

RUN npx prisma generate

#RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

FROM node:22-slim as production

WORKDIR /app

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
