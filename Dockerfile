# Docker file for Ray-casting engine
FROM ubuntu
FROM node:16

# Create app directory
WORKDIR /

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files to ubuntu server
COPY . .

# Expose port 8080 (port server runs on)
EXPOSE 8080

# Run server
CMD ["npm", "run", "start"]
