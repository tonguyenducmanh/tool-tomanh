# Tomanh API Agent – Build & Run Guide (macOS, Linux)

Tài liệu này hướng dẫn cách build và chạy agent Go trên macOS và Linux.

---

## 1. Yêu cầu

- Go >= 1.20
- File nguồn: `tool_api_agent.go`

Kiểm tra Go:

```bash
go version
```

## 2. Build agent

### 2.1 Build cho máy hiện tại

```
go build -o tomanh-agent tool_api_agent.go
```

### 2.2 Build cho macOS

Mac Intel

```
GOOS=darwin GOARCH=amd64 go build -o tomanh-agent-mac-intel tool_api_agent.go
```

Mac Apple Silicon

```
GOOS=darwin GOARCH=arm64 go build -o tomanh-agent-mac-arm tool_api_agent.go
```

Linux x86_64

```
GOOS=linux GOARCH=amd64 go build -o tomanh-agent-linux tool_api_agent.go
```

Linux ARM64:

```
GOOS=linux GOARCH=arm64 go build -o tomanh-agent-linux-arm tool_api_agent.go
```

### 3. Chạy agent

3.1 macOS

```
chmod +x tomanh-agent
./tomanh-agent
```

3.2 Linux

```
chmod +x tomanh-agent-linux
./tomanh-agent-linux
```
