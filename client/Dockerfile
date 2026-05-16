# Stage 1: Build ứng dụng
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

# Thêm flag --legacy-peer-deps để bỏ qua xung đột phiên bản
RUN npm install --legacy-peer-deps

COPY . .
RUN npx vite build

# Stage 2: Phục vụ bằng Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]