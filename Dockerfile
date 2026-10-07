FROM node:20-alpine
RUN mkdir /app
COPY package.json /app/
WORKDIR /app
COPY . ./

# The Electron app is built separately; the server image doesn't need its binary
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
