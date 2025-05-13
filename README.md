# JSON Schema Tool

A web-based tool for working with JSON Schema. This application provides a user interface to:
- parse JSON schema as tables for human to read
- validate JSON string against a json schema

![image](https://github.com/colinzhu/resources/blob/master/junit-web-launcher/screenshot-1.png?raw=true)

## Usage

To run the application:

```bash
go run app.go
```

The application will:
1. Start a local server defulat on a random port and 127.0.0.1
2. Automatically open your default web browser to the tool's interface

By default, the server will be accessible at `http://localhost:<port>/json-schema-tool/`

use `-p` to specify the port number. e.g. `go run app.go -p 8080`
