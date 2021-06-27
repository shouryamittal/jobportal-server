FROM node:14
WORKDIR /usr/src/jobPortal
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]
