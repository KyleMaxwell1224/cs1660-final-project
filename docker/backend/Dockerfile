# pull official base image
FROM node:alpine

LABEL version="1.0"
LABEL description="This is the base docker image for my CS 1660 final project backend node app."
LABEL maintainer = ["kyleman1224@gmail.com"]

WORKDIR /app/backend
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY angular.json ./
COPY creds/lyrical-bolt-328905-99d9a0ee1aad.json ./

RUN npm install -f

EXPOSE 8000
# add app
COPY . ./

CMD ["node" , "backend/server.js"]