FROM node:11-stretch

# for caching node_modules
COPY ./backend/package.json /app/backend/package.json
COPY ./backend/yarn.lock /app/backend/yarn.lock
WORKDIR /app/backend
RUN yarn config set workspaces-experimental true
RUN yarn install

COPY ./backend/ /app/backend

COPY ./frontend/package.json /app/frontend/package.json
COPY ./frontend/yarn.lock /app/frontend/yarn.lock
WORKDIR /app/frontend
RUN yarn install

COPY ./frontend /app/frontend
RUN yarn build && rm -rf /app/backend/static && cp -rf /app/frontend/dist /app/backend/static
