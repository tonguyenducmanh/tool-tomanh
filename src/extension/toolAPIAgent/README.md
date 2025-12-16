# Tomanh API Agent – Build & Run Guide (macOS, Linux, Windows)

Tài liệu hướng dẫn build và chạy agent Go trên macOS, Linux và Windows.

---

## 1. Yêu cầu

- Go >= 1.20
- File nguồn: `tool_api_agent.go`

Kiểm tra Go:

```bash
go version
```

## 2. Build agent

Chạy file build all

```
./build_all.sh
```

## 3. Chạy agent

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

3.3 Windows

```

tomanh-agent.exe

```

```
