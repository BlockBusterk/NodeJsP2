FROM node:18-alpine

WORKDIR /home/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm install -g ts-node nodemon typescript


EXPOSE 3000


CMD ["nodemon", "--watch", "src", "--ext", "ts", "--exec", "ts-node", "src/index.ts"]
