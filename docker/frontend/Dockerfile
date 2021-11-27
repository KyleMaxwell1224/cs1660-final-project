FROM node:alpine AS app-build

LABEL version="1.0"
LABEL description="This is the base docker image for my CS 1660 final project Angular frontend."
LABEL maintainer = ["kyleman1224@gmail.com"]

# set working directory 
WORKDIR /app
COPY . ./
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=app-build /app/dist/final-project /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]