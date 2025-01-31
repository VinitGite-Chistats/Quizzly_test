# Use the official Node.js 18 image based on Alpine Linux as the base image
# FROM node:18-alpine as build-step

# # Create a directory in the container and set it as the working directory
# WORKDIR /app
 
# # Copy package files to the working directory
# # COPY package*.json .

# # Copy the entire application code to the working directory
# COPY . .

# EXPOSE 8194
# EXPOSE 5173

# RUN cd ./frontend && \
#     npm install --force

# CMD cd ./frontend && npm run dev
# Use the official Node.js 18 image based on Alpine Linux as the base image
# # FROM node:18-alpine as build-step
# FROM node:18-alpine

# # Create a directory in the container and set it as the working directory
# WORKDIR /app

# COPY package*.json ./

# RUN npm install --force

# COPY . ./

# EXPOSE 8194

# CMD ["npm", "run", "dev"]
 
# Copy package files to the working directory
# COPY ./frontend/package*.json .
# COPY ./frontend .

# Copy the entire application code to the working directory
# RUN npm install --force


# EXPOSE 8194

# RUN cd ./frontend 

# CMD ["npm", "run", "dev"]

# # Development Stage
# FROM node:18-alpine as dev-step

# # Create a directory in the container and set it as the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install --force

# # Copy the entire application code
# COPY . .

# # Expose the development server port
# EXPOSE 5173

# # Command to run the Vite development server
# CMD ["npm", "run", "dev"]

# Production Stage
FROM node:18-alpine as build-step

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the application code
COPY . .

# Build the app for production
RUN npm run build

# Serve the production build using Nginx
FROM nginx:alpine as production-step

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the build step
COPY --from=build-step /app/dist /usr/share/nginx/html

# Expose your custom port (in this case, 8194)
EXPOSE 8194

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

