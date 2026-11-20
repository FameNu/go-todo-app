FROM golang:1.27.4-alpine AS builder

WORKDIR /src
RUN apk add --no-cache ca-certificates git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/server ./server
ENV PORT=8080
EXPOSE 8080
USER 10001:10001
ENTRYPOINT ["./server"]
