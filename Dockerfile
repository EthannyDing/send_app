FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE $PORT
EXPOSE $FS_PORT
EXPOSE $WASP_PORT

CMD npm start
