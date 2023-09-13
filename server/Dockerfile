# Use the official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for both front-end and back-end
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for both front-end and back-end
RUN cd client && npm install
RUN cd server && npm install

# Copy the application code for both front-end and back-end
COPY . .

# Build the React front-end
RUN cd client && npm run build

# Expose the port your Express.js server listens on
EXPOSE 3001

# Start your Express.js server
CMD ["npm", "start"]

