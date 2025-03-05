# Use Node.js 21.7.1 (Debian-based, safer for dependencies)
FROM node:21.7.1

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
