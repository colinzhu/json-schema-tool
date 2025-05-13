package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os/exec"
	"runtime"

	"github.com/colinzhu/json-schema-tool/handler"
)

func main() {
	startServer()
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default: // linux or others
		cmd = exec.Command("xdg-open", url)
	}
	_ = cmd.Start()
}

func startServer() {
	http.Handle("/json-schema-tool/", handler.NewEmbedStaticFileServer())

	port := flag.Int("p", 0, "Port number to use, default is 0 for random")
	host := flag.Bool("h", false, "Host on 0.0.0.0 instead of 127.0.0.1")
	flag.Parse()

	var addr string
	if *host {
		addr = "0.0.0.0"
	} else {
		addr = "127.0.0.1"
	}

	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", addr, *port))
	if err != nil {
		log.Fatal(err)
	}
	addr = listener.Addr().String()

	log.Printf("Starting server at http://%s/json-schema-tool/\n", addr)
	openBrowser(fmt.Sprintf("http://%s/json-schema-tool/", addr))
	log.Fatal(http.Serve(listener, nil))
}
