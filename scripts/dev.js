const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const port = Number(process.env.PORT) || 3000;
const localNextBin = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

function startFallbackServer() {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>KodNest Home Dashboard</title>
  <style>
    body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f3f4f6;color:#111827}
    header{position:fixed;top:0;left:0;right:0;height:64px;background:rgba(255,255,255,.95);border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 20px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    .logo{display:flex;align-items:center;gap:8px}.k{height:40px;width:40px;border-radius:10px;background:#facc15;display:flex;align-items:center;justify-content:center;font-weight:800}
    .nav{display:flex;gap:8px}.nav span{padding:8px 12px;border-radius:999px;background:#f9fafb}
    .wrap{max-width:1100px;margin:0 auto;padding:90px 16px 40px}
    .hero,.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
    .hero{padding:24px;background:linear-gradient(to right,#fff,#fefce8,#f9fafb)}
    .btn{display:inline-block;margin-top:10px;background:#000;color:#fde047;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700}
    .row{display:flex;gap:12px;overflow:auto;padding-bottom:4px}.session{min-width:280px;padding:16px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}
    .bar{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden}.bar>i{display:block;height:100%;background:#facc15}
    h2{margin:20px 0 10px}
  </style>
</head>
<body>
<header><div class="logo"><div class="k">K</div><strong>KodNest</strong></div><div class="nav"><span>Home</span><span>Courses</span><span>Practice</span><span>Placements</span><span>Community</span></div><div>🔍 🔔 👤</div></header>
<div class="wrap">
  <section class="hero">
    <h1>Welcome back, Learner 👋</h1>
    <p>Continue your coding journey, join live sessions, and accelerate your placement prep.</p>
    <a class="btn" href="#">Chat with BroKod</a>
  </section>
  <h2>Live Sessions</h2>
  <div class="row">
    <article class="card session"><strong>DSA Power Hour</strong><p>Binary Search & Patterns</p></article>
    <article class="card session"><strong>System Design Essentials</strong><p>Scalable API Design</p></article>
    <article class="card session"><strong>Placement Interview Drill</strong><p>Behavioral + HR Simulation</p></article>
  </div>
  <h2>Self-Paced Courses</h2>
  <div class="grid">
    <article class="card" style="padding:16px"><strong>Full Stack Web Development</strong><p>64%</p><div class="bar"><i style="width:64%"></i></div></article>
    <article class="card" style="padding:16px"><strong>Data Structures & Algorithms</strong><p>42%</p><div class="bar"><i style="width:42%"></i></div></article>
  </div>
  <h2>Placement Achievements</h2>
  <div class="grid">
    <article class="card" style="padding:16px"><strong>Ananya R</strong><p>Infosys · 9.5 LPA</p></article>
    <article class="card" style="padding:16px"><strong>Karthik S</strong><p>Accenture · 7.2 LPA</p></article>
  </div>
</div>
</body></html>`;

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, mode: 'fallback-dev-server' }));
      return;
    }

    if (req.url === '/' || req.url === '/home') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
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
