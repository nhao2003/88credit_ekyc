# Use the official Node.js latest image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Set the environment variables
ENV RABBITMQ_HOST=rabbitmq

# Serve the app
CMD ["yarn", "preview"]