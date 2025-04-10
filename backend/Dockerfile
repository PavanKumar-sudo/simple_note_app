# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port (example: 5000)
EXPOSE 5000

# Start backend server
CMD ["node", "index.js"]
