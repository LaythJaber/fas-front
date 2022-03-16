FROM node:12.22.1 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
ENV NODE_OPTIONS="--max_old_space_size=8048"
RUN npm install
COPY . .
RUN npm run build:prod
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /usr/share/nginx/html/*
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
