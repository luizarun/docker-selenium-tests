FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "ts-node", "test_docker_selenium.ts"]