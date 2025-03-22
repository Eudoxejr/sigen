# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./

# Copie des fichiers d'environnement
COPY .env ./
COPY .env.production ./

RUN npm install

COPY . .
# Définir la limite de mémoire à 4 Go pendant le build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage

# Copie des fichiers d'environnement
COPY --from=build-stage /app/.env* ./

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
