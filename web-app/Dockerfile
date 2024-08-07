# Use the official Node.js image as a base
FROM node:14-alpine as build

# Set the working directory inside the container
WORKDIR /usr/app/

# Copy package.json and package-lock.json to install dependencies
COPY ./package.json /usr/app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./ /usr/app/

# Build the React app for production
RUN npm run build

# Use nginx to serve the React app
FROM nginx:alpine

# Copy the built React app from the build stage
COPY --from=build /usr/app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker host
EXPOSE 80

# Default command to run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
