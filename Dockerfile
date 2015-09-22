FROM node:4

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src/

RUN npm install

EXPOSE 10000

CMD ["npm", "start"]