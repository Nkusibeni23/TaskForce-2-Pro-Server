# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag to handle version conflicts
RUN npm install --legacy-peer-deps

# Copy source code and TypeScript config
COPY tsconfig.json .
COPY src/ src/

# Build TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies with legacy peer deps flag
RUN npm install --only=production --legacy-peer-deps

# Copy built JavaScript files from builder stage
COPY --from=builder /app/build ./build

# Set Node environment to production
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]