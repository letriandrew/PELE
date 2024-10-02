# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g serve


# Copy the rest of your frontend code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

RUN npm run build

# Command to run your React app
CMD ["serve", "-s", "build"]
