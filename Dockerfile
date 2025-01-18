FROM node:20-bullseye-slim


WORKDIR /app


COPY package.json ./



RUN npm install -g pnpm

RUN pnpm install


COPY . .


RUN pnpm run build


CMD ["pnpm", "preview"]