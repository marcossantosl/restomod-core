FROM node:24-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/assistente

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_N8N_WEBHOOK_URL=$NEXT_PUBLIC_N8N_WEBHOOK_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public 2>/dev/null || true

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
