
FROM node:24-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --legacy-peer-deps


COPY . .


RUN npm run build


EXPOSE 3001


CMD ["npm", "run", "start:prod"]