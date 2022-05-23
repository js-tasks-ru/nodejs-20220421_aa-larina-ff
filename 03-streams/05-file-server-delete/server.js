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
    case 'DELETE':
      if (pathname.includes('\/')) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end(message['400']);
      } else {
        let fileExists = false;
        fs.readdirSync(path.join(__dirname, 'files')).forEach((file) => {
          fileExists = (file === pathname) ? true : fileExists;
        });

        if (!fileExists) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end(message['404-delete']);
        }

        fs.unlink(filepath, (error) => {
          if (error) {
            res.writeHead(500, {'content-type': 'text/plain'});
            res.end(message['500']);
          } else {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end(message['200-delete']);
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end(message['501']);
  }
});

module.exports = server;
