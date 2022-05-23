const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const url = require('url');
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
      // const wStream = fs.createWriteStream(filepath);
      const limitedStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'}); // 1 Мб

      let fileExists = false;
      fs.readdirSync(path.join(__dirname, 'files')).forEach((file) => {
        fileExists = (file === pathname) ? true : fileExists;
      });

      if (fileExists) {
        res.writeHead(409, {'content-type': 'text/plain'});
        res.end('Filename with name ' + pathname + ' already exists.');
      } else {
        const wStream = fs.createWriteStream(filepath);

        if (pathname.includes('\/')) {
          res.writeHead(400, {'Content-Type': 'text/plain'});
          res.end('Nested path is not supported');
        }

        req.pipe(limitedStream).pipe(wStream);

        req.on('end', () => {
          res.writeHead(201, {'content-type': 'text/plain'});
          res.end('File was successfully uploaded.');
          wStream.end();
        });

        req.on('error', () => {
          fs.unlink(filepath, () => {});
          limitedStream.end();
          wStream.end();
        });

        limitedStream.on('error', (err) => {
          res.writeHead(413, {'content-type': 'text/plain'});
          res.end('The file size must be limited with 1 MB.');
          fs.unlink(filepath, () => {});
          wStream.end();
        });

        wStream.on('error', (err) => {
          res.writeHead(500, {'content-type': 'text/plain'});
          res.end('Something went wrong');
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
