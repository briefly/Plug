FROM node:4

# Make sure the build tools are available
RUN apt-get install gcc make build-essential


ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src/

RUN npm install

EXPOSE 10000

CMD ["npm", "start"]