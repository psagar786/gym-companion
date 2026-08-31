import crypto from 'node:crypto';
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/exercises/biweekly-artwork-manifest.json'), 'utf8'));
const failures = [], warnings = [], paths = new Map();
const phases = ['setup', 'move', 'return'];
function parsePng(file) {
  const bytes = fs.readFileSync(file);
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20), depth = bytes[24], type = bytes[25];
  if (depth !== 8 || ![2, 6].includes(type)) return { width, height, pixels: null };
  const channels = type === 6 ? 4 : 3, chunks = []; let offset = 8;
  while (offset + 12 <= bytes.length) { const length = bytes.readUInt32BE(offset), kind = bytes.toString('ascii', offset + 4, offset + 8); if (kind === 'IDAT') chunks.push(bytes.subarray(offset + 8, offset + 8 + length)); offset += length + 12; if (kind === 'IEND') break; }
  const raw = zlib.inflateSync(Buffer.concat(chunks)), stride = width * channels, pixels = Buffer.alloc(height * stride); let cursor = 0;
  for (let y = 0; y < height; y++) { const filter = raw[cursor++], row = pixels.subarray(y * stride, (y + 1) * stride), previous = y ? pixels.subarray((y - 1) * stride, y * stride) : null; for (let x = 0; x < stride; x++) { const value = raw[cursor++], left = x >= channels ? row[x - channels] : 0, up = previous ? previous[x] : 0, upLeft = previous && x >= channels ? previous[x - channels] : 0; if (filter === 0) row[x] = value; else if (filter === 1) row[x] = (value + left) & 255; else if (filter === 2) row[x] = (value + up) & 255; else if (filter === 3) row[x] = (value + Math.floor((left + up) / 2)) & 255; else { const p = left + up - upLeft, pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft); row[x] = (value + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255; } } }
  return { width, height, channels, pixels };
}
function sampleDifference(a, b) {
  if (!a?.pixels || !b?.pixels || a.width !== b.width || a.height !== b.height) return 1;
  let total = 0, count = 0;
  for (let y = 0; y < a.height; y += 8) for (let x = 0; x < a.width; x += 8) { const ai = (y * a.width + x) * a.channels, bi = (y * b.width + x) * b.channels; total += Math.abs(a.pixels[ai] - b.pixels[bi]) + Math.abs(a.pixels[ai + 1] - b.pixels[bi + 1]) + Math.abs(a.pixels[ai + 2] - b.pixels[bi + 2]); count += 3; }
  return total / count / 255;
}
for (const movement of manifest.movements) {
  const decoded = {};
  for (const phase of phases) {
    const relative = movement.phases?.[phase];
    if (!relative) { failures.push(`${movement.name}: missing ${phase} manifest path`); continue; }
    if (paths.has(relative) && paths.get(relative) !== movement.id) failures.push(`${movement.name} ${phase}: path reused by ${paths.get(relative)}`); else paths.set(relative, movement.id);
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) { warnings.push(`${movement.name}: pending ${phase} artwork`); continue; }
    try { decoded[phase] = parsePng(file); if (decoded[phase].width !== 512 || decoded[phase].height !== 512) failures.push(`${movement.name} ${phase}: expected 512x512`); const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); movement._hashes ||= {}; movement._hashes[phase] = hash; } catch (error) { failures.push(`${movement.name} ${phase}: ${error.message}`); }
  }
  if (movement._hashes && new Set(Object.values(movement._hashes)).size < Object.keys(movement._hashes).length) failures.push(`${movement.name}: byte-identical phase files`);
  if (decoded.setup && decoded.move && decoded.return) { if (sampleDifference(decoded.setup, decoded.move) < 0.035 || sampleDifference(decoded.move, decoded.return) < 0.035 || sampleDifference(decoded.setup, decoded.return) < 0.035) warnings.push(`${movement.name}: phases may be perceptually too similar`); }
  if (!movement.alt) failures.push(`${movement.name}: missing alt text`);
  if (!movement.phaseBriefs?.setup || !movement.phaseBriefs?.move || !movement.phaseBriefs?.return) warnings.push(`${movement.name}: missing authored phase briefs`);
  if (movement.visualReviewStatus !== 'approved') warnings.push(`${movement.name}: visual review pending`);
  if (movement.coachReviewStatus !== 'approved') warnings.push(`${movement.name}: coach review pending`);
}
if (failures.length) { console.error(`Bi-weekly artwork validation failed (${failures.length})`); console.error(failures.join('\n')); process.exitCode = 1; }
console.log(`Bi-weekly artwork: ${manifest.movementCount} movements / ${manifest.phaseImageCount} expected phases.`);
console.log(`Warnings: ${warnings.length} pending or quality findings.`);
if (process.argv.includes('--strict') && warnings.length) process.exitCode = 2;
