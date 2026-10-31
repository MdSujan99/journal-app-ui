# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent || npm install

# Copy source files and build
COPY . .
ARG REACT_APP_API_URL=/api/
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# ---------- Production Nginx Stage ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
