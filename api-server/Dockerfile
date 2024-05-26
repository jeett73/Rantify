FROM node:18.10.0-alpine
RUN apk add --no-cache --update bash
WORKDIR /usr/app/
COPY ./package.json /usr/app/
COPY ./package-lock.json /usr/app/
#COPY ./config/.env.sample ./config/.env
RUN npm install
COPY ./ /usr/app/
# EXPOSE 8080
RUN ls -la /usr/app/
RUN mkdir -p ./logs
CMD ["sh", "start.sh"]