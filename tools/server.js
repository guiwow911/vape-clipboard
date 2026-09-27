/* =========================================================================
   Vape V4 Clipboard —— 本地静态服务器（开发预览用）
   把 src/web/（index.html / style.css / app.js）和 assets/ 通过
   http://127.0.0.1:<port>/ 提供出去。

   用 http 而不是直接开 file:// 的原因：只有安全上下文（http/https）
   才能调用系统剪切板 API（navigator.clipboard）。

   用法： node tools/server.js [port]
   ========================================================================= */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const REPO   = path.resolve(__dirname, '..');            // 仓库根目录
const WEB    = path.join(REPO, 'src', 'web');            // 界面文件
const ASSETS = path.join(REPO, 'assets');                // 图片 / 图标

const PORT = parseInt(process.argv[2] || '8788', 10);
const MIME = {
  '.html':'text/html; charset=utf-8',
  '.css' :'text/css; charset=utf-8',
  '.js'  :'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg' :'image/svg+xml',
  '.jpg' :'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png',
  '.ico' :'image/x-icon', '.woff2':'font/woff2'
};

const server = http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch (e) { res.writeHead(400); return res.end('bad request'); }
  if (rel === '/' || rel === '') rel = '/index.html';

  // /assets/... 走仓库的 assets/，其余走 src/web/
  let base = WEB;
  if (rel.startsWith('/assets/')) {
    base = ASSETS;
    rel  = rel.slice('/assets'.length);
  }

  const file = path.normalize(path.join(base, rel));
  if (!file.startsWith(base)) { res.writeHead(403); return res.end('forbidden'); }

  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('404'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(buf);
  });
});

server.on('error', err => {
  console.error('[server] ' + err.message);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => {
  console.log('[server] ' + WEB + ' -> http://127.0.0.1:' + PORT + '/');
});
