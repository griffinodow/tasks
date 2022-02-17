FROM node:alpine
WORKDIR /home/node/app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
RUN ls -l
RUN npm install 
RUN npm run build
RUN npm prune --production
ENV NODE_ENV production
CMD npm start
EXPOSE 80