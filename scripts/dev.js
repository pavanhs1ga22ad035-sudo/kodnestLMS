const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const { pages } = require('./dev-pages');

const port = Number(process.env.PORT) || 3000;
const localNextBin = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

function startFallbackServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, mode: 'fallback-dev-server' }));
      return;
    }

    if (req.url.startsWith('/my-learning/class/')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Course Player</h1><p>Video player + accordion modules/topics preview.</p></body></html>');
      return;
    }

    if (pages[req.url]) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(pages[req.url]);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(port, () => {
    console.log(`[dev] Next.js not found. Running fallback preview server on http://127.0.0.1:${port}`);
  });
}

if (fs.existsSync(localNextBin)) {
  const child = spawn(localNextBin, ['dev'], { stdio: 'inherit', env: process.env });
  child.on('exit', (code) => process.exit(code ?? 0));
} else {
  startFallbackServer();
}
