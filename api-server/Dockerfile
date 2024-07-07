# RUN apk add --no-cache --update bash
# WORKDIR /usr/app/
# COPY ./package.json /usr/app/
# COPY ./package-lock.json /usr/app/
# #COPY ./config/.env.sample ./config/.env
# RUN npm install
# COPY ./ /usr/app/
# # EXPOSE 8080
# RUN ls -la /usr/app/
# RUN mkdir -p ./logs
# CMD ["sh", "start.sh"]
# Set the working directory inside the container
FROM node:18.10.0-alpine 
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY ./package.json /app

# Clear npm cache and install dependencies again
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY ./ /app

# Expose the port on which the Node.js application will run
EXPOSE 3000

# Command to run your Node.js application
CMD ["npm", "start"]