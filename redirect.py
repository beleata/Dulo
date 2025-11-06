#!/usr/bin/env python3
import http.server
import socketserver
import urllib.parse

class RedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(302)
            self.send_header('Location', '/home.html')
            self.end_headers()
        else:
            super().do_GET()

if __name__ == "__main__":
    PORT = 8001
    Handler = RedirectHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at port {PORT}")
        httpd.serve_forever()