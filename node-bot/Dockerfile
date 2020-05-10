# Setting up image
FROM node:12

# Set the working directory to /app
WORKDIR /app

COPY package.json ./

RUN npm install

# Bundle app source
COPY . ./