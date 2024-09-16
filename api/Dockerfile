FROM node:18
WORKDIR /src
COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]