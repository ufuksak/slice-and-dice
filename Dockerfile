# /app directory is set as a working directory within the base image
FROM node:18 as builder

RUN mkdir -p /src/openapi
COPY src/openapi/api.schema.yml /src/openapi
COPY src /app/src

# set /app directory as default working directory
WORKDIR /app
RUN mkdir -p dist/src/openapi
COPY src/openapi/api.schema.yml dist/src/openapi

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
COPY --chown=node:node package.json package-lock.json tsconfig.json jest.config.js redis ./

RUN npm cache verify

# Install dependencies before copying source code for better docker cache utilization
RUN npm install

# copy all files from current dir to /app in container
COPY --chown=node:node src /app/src

RUN npm run build

######

FROM node:18 as application

ENV NODE_ENV=production

# set /app directory as default working directory
WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
RUN npm cache verify
RUN npm install --production

# copy only production files
COPY --from=builder --chown=node:node /app/dist ./dist

# COPY .version-info .

#######
# run distroless image with debug tag, debug tag will be removed in future
# TO DO remove "-debug" from image tag

FROM gcr.io/distroless/nodejs:18-debug

RUN apt-get -y update
RUN apt-get -y install vim nano

# copy application from previous stage

COPY --from=application /app /app

WORKDIR /app

# cmd to start service with non root user
USER 1000

# cmd to start service
CMD [ "/app/dist/src/server.js" ]
