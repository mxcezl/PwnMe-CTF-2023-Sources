# Dockerfile
FROM node:16-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY package*.json /usr/src/nuxt-app/
RUN npm install

COPY . /usr/src/nuxt-app/
RUN npm run build

ARG FLAG
RUN echo "${FLAG}" >> /home/flag.txt

ENV NUXT_HOST=0.0.0.0

CMD [ "npm", "start" ]