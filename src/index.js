import http from 'http';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const port = process.env.PORT || 8080;

const server = http.createServer();

server.on('request', async (req, res) => {
  const filePath = req.url === '/' ? './index.html' : '.' + req.url;
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  if (req.url === '/api') {
    const apiEndpoint = 'http://localhost:1337/api/ochin-pakhis/';
    const apiToken = 'caed77bff0be331afc4ef98201e29fc944101faf76f61c671c6cb2696fee75af51c8e6151626473a5b765b6f9a1c655386c6be13d65f9b821ce5d5c10775fff14426d9fc850900ee5d787a5901cd6fa1172ab7492a6025b3221c989eff3c867d578142280207c3e163fbcd9ea7abe86dddceec2b8c1891c7d552de86d3fc51ba';

    try {
      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(response.status);
        res.end(`API request failed with status ${response.status}`);
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 Not Found why');
        } else {
          res.writeHead(500);
          res.end('500 Internal Server Error');
        }
      } else {
        if (extname === '.png' || extname === '.jpg') {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'binary');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
