#!/bin/bash

# Pull the latest changes
git pull

# Build the project
npm run build

# Copy necessary files
cp package.json ./build/
cp package-lock.json ./build/

# Create or update the .env file
# echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> ./build/.env
#echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> ./build/.env

# Navigate to build directory and install dependencies
cd build
npm install

# Restart the application
pm2 restart ecosystem.config.cjs
