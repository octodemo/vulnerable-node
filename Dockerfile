FROM golang:1.16-buster AS build

WORKDIR /app

COPY go.mod .
RUN go mod download

COPY *.go .

RUN go build -o app

LABEL maintainer="Daniel García (cr0hn) cr0hn@cr0hn.com"

ENV STAGE "DOCKER"

RUN apt-get update && apt-get install -y netcat

# install vulnerable version of a library
RUN apt-get install -y curl=7.64.0-4+deb10u2

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
