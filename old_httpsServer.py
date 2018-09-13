#!/usr/bin/python

import BaseHTTPServer, SimpleHTTPServer
#import http.server;
import ssl

httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
#httpd = http.server.HTTPServer(('0.0.0.0', 443), http.server.SimpleHTTPRequestHandler)
try:
	httpd.socket = ssl.wrap_socket (httpd.socket, certfile='./fullchain.pem',keyfile='./privkey.pem',server_side=True,ssl_version=ssl.PROTOCOL_TLSv1_2)
except:
	httpd.socket = ssl.wrap_socket (httpd.socket, certfile='../fullchain.pem',keyfile='../privkey.pem',server_side=True,ssl_version=ssl.PROTOCOL_TLSv1_2)
httpd.serve_forever()

