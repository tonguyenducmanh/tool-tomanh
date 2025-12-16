package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

type UIRequest struct {
	ApiURL      string `json:"apiUrl"`
	HttpMethod  string `json:"httpMethod"`
	HeadersText string `json:"headersText"`
	BodyText    string `json:"bodyText"`
}

func parseHeaders(text string) map[string]string {
	headers := map[string]string{}

	lines := strings.Split(text, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		parts := strings.SplitN(line, ":", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		headers[key] = val
	}

	return headers
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	ctx := r.Context()

	var uiReq UIRequest
	if err := json.NewDecoder(r.Body).Decode(&uiReq); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	var body io.Reader
	if strings.TrimSpace(uiReq.BodyText) != "" {
		body = bytes.NewBufferString(uiReq.BodyText)
	}

	req, err := http.NewRequestWithContext(
		ctx,
		strings.ToUpper(uiReq.HttpMethod),
		uiReq.ApiURL,
		body,
	)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	for k, v := range parseHeaders(uiReq.HeadersText) {
		req.Header.Set(k, v)
	}

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}

	client := &http.Client{
		Transport: tr,
		Timeout:   60 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		select {
		case <-ctx.Done():
			w.WriteHeader(499)
			w.Write([]byte("Request cancelled by client"))
			return
		default:
			http.Error(w, err.Error(), 502)
			return
		}
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	for k, vals := range resp.Header {
		for _, v := range vals {
			w.Header().Add(k, v)
		}
	}

	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

func main() {
	log.Println("Agent running at http://127.0.0.1:7777")
	http.HandleFunc("/exec", handler)
	log.Fatal(http.ListenAndServe("127.0.0.1:7777", nil))
}
