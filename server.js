/**
 * server.js - Simple HTTP server for Fantasy Chess
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Default to index.html
  let filePath = req.url === '/' ? '/public/index.html' : req.url;
  
  // Remove query string
  filePath = filePath.split('?')[0];
  
  // Construct full path
  const fullPath = path.join(__dirname, filePath);

  // Get file extension
  const ext = path.extname(fullPath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log('⚔️  Fantasy Chess Server ⚔️');
  console.log(`🎮 Server running at http://localhost:${PORT}/`);
  console.log('📂 Serving files from:', __dirname);
  console.log('\nPress Ctrl+C to stop the server');
});
