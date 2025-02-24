# Use Node 21 (Alpine variant for a smaller footprint)
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (Next.js dev server defaults to 3000)
EXPOSE 3000

# Default command: start Next.js in dev mode (hot reload)
CMD ["npm", "run", "dev"]
