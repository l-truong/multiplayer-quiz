# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port (default is 8080 for Vue)
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "serve"]