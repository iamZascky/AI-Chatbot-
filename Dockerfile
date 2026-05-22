FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Hugging Face Spaces require port 7860
EXPOSE 7860
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
