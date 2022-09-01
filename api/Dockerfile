FROM node:16-alpine
WORKDIR /app
COPY ./package*.json ./
COPY ./yarn.lock .
RUN yarn install --frozen-lockfile 
# RUN npm install --frozen-lockfile 

COPY . .
# 172.16.0.1 is the proxy for DB
ENV DATABASE_URL "mysql://root:testpassword@172.16.0.2:80/testdb"
RUN npx prisma generate
RUN yarn build
# RUN npm run build

# Following code assumes that DB is up and running
# And container was able to make a connection w/ DB
RUN npx prisma migrate dev --name init
RUN npx prisma db seed

# ENV PORT 3000
EXPOSE 3000
CMD [ "node", "dist/index.js" ]  

