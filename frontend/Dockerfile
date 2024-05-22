# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the React app
RUN npm run build

# Start the server
CMD [ "node", "server.js" ]

# Expose the port the app runs on
EXPOSE 3000
