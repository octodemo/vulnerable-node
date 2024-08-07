FROM node:18.5.0-buster

LABEL maintainer="Daniel García (cr0hn) cr0hn@cr0hn.com"

ENV STAGE "DOCKER"

RUN apt-get update && apt-get install -y netcat

RUN apt-get install -y libssl1.1

# Build app folders
RUN mkdir /app
WORKDIR /app

# Install depends
COPY package.json /app/
RUN npm install

# Bundle code
COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]
