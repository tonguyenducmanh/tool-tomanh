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

type APIResponse struct {
	Status     int                 `json:"status"`
	StatusText string              `json:"statusText"`
	Headers    map[string][]string `json:"headers"`
	Body       string              `json:"body"`
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

		headers[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])
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
		json.NewEncoder(w).Encode(APIResponse{
			Status:     500,
			StatusText: "ERROR",
			Body:       err.Error(),
		})
		return
	}

	// ===== LOG REQUEST =====
	log.Println("=== API REQUEST ===")
	log.Println("Method:", strings.ToUpper(uiReq.HttpMethod))
	log.Println("URL:", uiReq.ApiURL)

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
		json.NewEncoder(w).Encode(APIResponse{
			Status:     500,
			StatusText: "ERROR",
			Body:       err.Error(),
		})
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
			json.NewEncoder(w).Encode(APIResponse{
				Status:     499,
				StatusText: "CANCELLED",
				Body:       "Request cancelled by user",
			})
			return
		default:
			json.NewEncoder(w).Encode(APIResponse{
				Status:     500,
				StatusText: "ERROR",
				Body:       err.Error(),
			})
			return
		}
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	// ===== LOG RESPONSE =====
	log.Println("=== API RESPONSE ===")
	log.Println("Status:", resp.StatusCode)
	log.Println("Body:", string(respBody))

	// TRẢ JSON ĐẦY ĐỦ
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(APIResponse{
		Status:     resp.StatusCode,
		StatusText: resp.Status,
		Headers:    resp.Header,
		Body:       string(respBody),
	})
}

func main() {
	// BỔ SUNG LOG TIME (date + time + microseconds)
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)

	log.Println("Agent running at http://127.0.0.1:7777")

	http.HandleFunc("/exec", handler)
	log.Fatal(http.ListenAndServe("127.0.0.1:7777", nil))
}
