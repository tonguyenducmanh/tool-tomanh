#!/bin/sh

set -e

APP_NAME="./dist/tomanh-agent"
SRC_FILE="tool_api_agent.go"

echo "==> Checking Go version"
go version

echo "==> Build macOS Intel (amd64)"
GOOS=darwin GOARCH=amd64 go build -o ${APP_NAME}-mac-intel ${SRC_FILE}

echo "==> Build macOS Apple Silicon (arm64)"
GOOS=darwin GOARCH=arm64 go build -o ${APP_NAME}-mac-arm ${SRC_FILE}

echo "==> Build Linux x86_64 (amd64)"
GOOS=linux GOARCH=amd64 go build -o ${APP_NAME}-linux ${SRC_FILE}

echo "==> Build Linux ARM64"
GOOS=linux GOARCH=arm64 go build -o ${APP_NAME}-linux-arm ${SRC_FILE}

echo "==> Build Windows x86_64 (amd64)"
GOOS=windows GOARCH=amd64 go build -o ${APP_NAME}.exe ${SRC_FILE}

echo "==> Build Windows ARM64"
GOOS=windows GOARCH=arm64 go build -o ${APP_NAME}-arm.exe ${SRC_FILE}

echo "==> Build completed successfully"
