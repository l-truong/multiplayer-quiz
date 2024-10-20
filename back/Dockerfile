# Use official Node.js 20 image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your project files into the container
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 3000

# Command to start your application
CMD ["npm", "start"]