package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
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

	// ===== LOG REQUEST =====
	log.Println("=== API REQUEST ===")
	log.Println("Method:", strings.ToUpper(uiReq.HttpMethod))
	log.Println("URL:", uiReq.ApiURL)
	log.Println("Headers:")

	for k, v := range parseHeaders(uiReq.HeadersText) {
		log.Printf("  %s: %s\n", k, v)
	}
	if strings.TrimSpace(uiReq.BodyText) != "" {
		log.Println("Body:")
		log.Println(uiReq.BodyText)
	} else {
		log.Println("Body: <empty>")
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
		Timeout:   0,
	}

	resp, err := client.Do(req)
	if err != nil {
		select {
		case <-ctx.Done():
			log.Println("Request cancelled by client")
			w.WriteHeader(499)
			w.Write([]byte("Request cancelled by client"))
			return
		default:
			log.Println("Request error:", err.Error())
			http.Error(w, err.Error(), 502)
			return
		}
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	// ===== LOG RESPONSE =====
	log.Println("=== API RESPONSE ===")
	log.Println("Status Code:", resp.StatusCode)
	log.Println("Response Headers:")

	for k, v := range resp.Header {
		log.Printf("  %s: %s\n", k, strings.Join(v, ", "))
	}
	if len(respBody) > 0 {
		log.Println("Response Body:")
		log.Println(string(respBody))
	} else {
		log.Println("Response Body: <empty>")
	}

	for k, vals := range resp.Header {
		// bỏ việc gán access-control, cái này sẽ do agent quyết định
		if strings.HasPrefix(strings.ToLower(k), "access-control-") {
			continue
		}
		for _, v := range vals {
			w.Header().Add(k, v)
		}
	}

	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

func main() {
	// BỔ SUNG LOG TIME (date + time + microseconds)
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)

	log.Println("Agent running at http://127.0.0.1:7777")
	http.HandleFunc("/exec", handler)
	log.Fatal(http.ListenAndServe("127.0.0.1:7777", nil))
}
