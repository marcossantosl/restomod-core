# ── Etapa 1: build ──────────────────────────────────────────────
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copia dependências e baixa
COPY go.mod go.sum ./
RUN go mod download

# Copia o restante do código
COPY . .

# Compila o binário
RUN go build -o server .

# ── Etapa 2: imagem final (leve) ────────────────────────────────
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
