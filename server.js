const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const DEFAULT_PORT = 4000;
const DEFAULT_EVENT_STREAM_PORT = 4001;
const INDEX_PATH = './index.html';

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
};

var port = process.argv[2] || DEFAULT_PORT;
const eventStreamPort = process.argv[3] || DEFAULT_EVENT_STREAM_PORT;
var cwd = process.cwd();

// Static server
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

// Event stream server: pushes 'reload' events to the client whenever a file changes
http.createServer((req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': 'http://localhost:' + port,
  });

  const srcDir = path.join(cwd, 'src');
  fs.watch(srcDir, { recursive: true }, (eventType, fileName) => {
    res.write(
      `event: reload\ndata:File changed.`
    );
    res.write(`\n\n`);
  });
}).listen(eventStreamPort);

console.log(`Listening on port: ${port}`);
console.log(`Event stream listening on port ${eventStreamPort}`);
