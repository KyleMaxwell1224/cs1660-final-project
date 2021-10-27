FROM node:alpine AS app-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=app-build /app/dist/final-project /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]