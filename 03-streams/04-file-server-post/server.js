const message = require('../message.json');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'}); // 1 Мб

      let fileExists = false;
      fs.readdirSync(path.join(__dirname, 'files')).forEach((file) => {
        fileExists = (file === pathname) ? true : fileExists;
      });

      if (fileExists) {
        res.writeHead(409, {'content-type': 'text/plain'});
        res.end(message['409']);
      } else {
        const wStream = fs.createWriteStream(filepath);

        if (pathname.includes('\/')) {
          res.writeHead(400, {'Content-Type': 'text/plain'});
          res.end(message['400']);
        }

        req.pipe(limitedStream).pipe(wStream);

        req.on('end', () => {
          res.writeHead(201, {'content-type': 'text/plain'});
          res.end(message['201']);
          wStream.end();
        });

        req.on('error', () => {
          fs.unlink(filepath, () => {});
          limitedStream.end();
          wStream.end();
        });

        limitedStream.on('error', (err) => {
          res.writeHead(413, {'content-type': 'text/plain'});
          res.end(message['413']);
          fs.unlink(filepath, () => {});
          wStream.end();
        });

        wStream.on('error', (err) => {
          res.writeHead(500, {'content-type': 'text/plain'});
          res.end(message['500']);
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end(message['501']);
  }
});

module.exports = server;
