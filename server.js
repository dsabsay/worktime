const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const DEFAULT_PORT = 4000;
const INDEX_PATH = './index.html';

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
};

var port = process.argv[2] || DEFAULT_PORT;
var cwd = process.cwd();

http.createServer((req, res) => {
  var uriPath = url.parse(req.url).pathname;
  var uri = path.join(cwd, uriPath);

  if (!fs.existsSync(uri)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('404: Not found');
    return res.end();
  }

  if (fs.statSync(uri).isDirectory()) {  // serve index.html in a directory
    uri = path.join(uri, 'index.html');
  }

  var file = fs.readFileSync(uri);
  var contentType = CONTENT_TYPES[path.extname(uri)] || null;

  if (contentType) {
    res.writeHead(200, { 'Content-Type': contentType });
  }
  res.write(file);
  res.end();
}).listen(port);

console.log('Listening on port: ', port);
