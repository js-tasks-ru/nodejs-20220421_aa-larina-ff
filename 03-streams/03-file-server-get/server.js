const message = require('../message.json');

const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname !== 'favicon.ico') {
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);

        stream.on('error', (error) => {
          if (error.code === 'ENOENT') {
            if (pathname.includes('\/')) {
              res.writeHead(400, {'Content-Type': 'text/html'});
              res.end(message['400']);
            } else {
              res.writeHead(404, {'Content-Type': 'text/html'});
              res.end(message['404-get']);
            }
          }
        });

        stream.on('end', () => res.end());
      }
      break;

    default:
      res.statusCode = 501;
      res.end(message['501']);
  }
});

module.exports = server;
