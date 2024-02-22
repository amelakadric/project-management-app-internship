FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV DATABASE_URL=${DATABASE_URL}


EXPOSE 3000


CMD ["npm", "run", "start:dev"]
