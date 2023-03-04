FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i -g pnpm
RUN npm install -g typescript 

RUN pnpm install --production

# build app
RUN pnpm run build

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "dist/app.js" ]