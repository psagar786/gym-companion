import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const manifestPath = path.join(root, '.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const failures = [];
const seenPaths = new Set();
const seenHashes = new Map();
const maxBytes = 95 * 1024 * 1024;
let bytes = 0;

function webpDimensions(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8X' && buffer.length >= 30) {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  if (type === 'VP8L' && buffer.length >= 25 && buffer[20] === 0x2f) {
    const bits = buffer.readUIntLE(21, 4);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (type === 'VP8 ' && buffer.length >= 30 && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

for (const entry of manifest.entries || []) {
  if (seenPaths.has(entry.path)) failures.push(`duplicate manifest path: ${entry.path}`);
  seenPaths.add(entry.path);
  const absolute = path.join(root, entry.path);
  if (!fs.existsSync(absolute)) {
    failures.push(`missing active asset: ${entry.path}`);
    continue;
  }
  const data = fs.readFileSync(absolute);
  bytes += data.length;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (entry.sha256 && entry.sha256 !== hash) failures.push(`hash mismatch: ${entry.path}`);
  if (seenHashes.has(hash) && seenHashes.get(hash) !== entry.path) failures.push(`duplicate bytes: ${entry.path} and ${seenHashes.get(hash)}`);
  seenHashes.set(hash, entry.path);
  const dimensions = path.extname(absolute).toLowerCase() === '.webp' ? webpDimensions(data) : null;
  if (!dimensions || dimensions.width !== 512 || dimensions.height !== 512) failures.push(`not 512x512 WebP: ${entry.path}`);
}

for (const file of ['member-app.js', 'bootstrap.js', 'index.html', 'styles.css']) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  if (/SUPABASE_SERVICE_ROLE_KEY|service[_-]?role/i.test(content)) failures.push(`service-role reference in browser file: ${file}`);
}

if (bytes > maxBytes) failures.push(`active bundle exceeds 95 MiB gate: ${bytes} bytes`);
console.log(JSON.stringify({ files: seenPaths.size, bytes, MiB: Number((bytes / 1024 / 1024).toFixed(2)), failures }, null, 2));
if (failures.length) process.exitCode = 1;
