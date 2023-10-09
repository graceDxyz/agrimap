# Use the official Node.js image as a base image
FROM node:18.18.0-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for both front-end and back-end
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for both front-end and back-end
RUN cd client && npm install
RUN cd server && npm install

COPY . . 

# Build the React front-end
RUN cd client && npm run build

# Change working directory to the server
WORKDIR /app/server

# Build the server
RUN npm run build

# Copy the 'json' folder to the server's 'build' directory
COPY server/src/json ./build/src/json

# # Start your Express.js server
CMD ["node", "build/src/app.js"]


