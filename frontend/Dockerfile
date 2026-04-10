FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache optimization)
COPY package.json package-lock.json ./

RUN npm install

# Copy rest of the code
COPY . .

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

