# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and source from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
