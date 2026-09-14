import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml' };

createServer(async (req, res) => {
  try {
    if (req.url === '/api/config') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ appMode:'member', demoMode:true, supabaseUrl:'', supabaseAnonKey:'' }));
      return;
    }
    const requested = decodeURIComponent((req.url || '/').split('?')[0]);
    const file = normalize(join(root, requested === '/' ? 'index.html' : requested));
    if (!file.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
    const body = await readFile(file);
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 500, {'Content-Type':'text/plain; charset=utf-8'});
    res.end(error.code === 'ENOENT' ? 'Not found' : 'Local preview error');
  }
}).listen(Number(process.env.PORT || 4175), '127.0.0.1', () => {
  console.log(`Fitness 7 V5.4 local preview: http://localhost:${process.env.PORT || 4175}`);
});
