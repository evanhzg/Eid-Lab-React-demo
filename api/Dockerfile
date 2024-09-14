FROM node:18
WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]