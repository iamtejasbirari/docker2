FROM node:18-alpine as backend

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000         
    
CMD [ "npm", "start" ]