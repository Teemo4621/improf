FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npx prisma generate

#RUN npx prisma migrate deploy

RUN npm run build

CMD ["npm", "run", "start:prod"]

FROM node:22-alpine as production

WORKDIR /app

COPY --chown=node:node --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]

EXPOSE 3000
