package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
)

type ExecReq struct {
	Args []string `json:"args"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	// CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173/")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	if r.Method == "OPTIONS" {
		return
	}

	var req ExecReq
	json.NewDecoder(r.Body).Decode(&req)

	cmd := exec.Command("curl", req.Args...)
	out, err := cmd.CombinedOutput()

	json.NewEncoder(w).Encode(map[string]any{
		"output": string(out),
		"error":  err,
	})
}

func main() {
	log.Println("Agent running at 127.0.0.1:7777")
	http.HandleFunc("/exec", handler)
	http.ListenAndServe("127.0.0.1:7777", nil)
}
