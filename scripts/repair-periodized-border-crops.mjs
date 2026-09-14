import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, cropNearest, sha256 } from './adac-png.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dir = path.join(root, 'assets/exercises/periodized');
const files = fs.readdirSync(dir).filter(file => file.endsWith('.png')).sort();
const report = { directory: path.relative(root, dir), scanned: files.length, repaired: [], skipped: [], failures: [] };

function nearWhite(png, x, y) {
  const i = (y * png.width + x) * png.channels;
  return png.pixels[i] > 220 && png.pixels[i + 1] > 220 && png.pixels[i + 2] > 220;
}

function edgeStrip(png, axis, offset) {
  const length = axis === 'x' ? png.height : png.width;
  let near = 0;
  for (let index = 0; index < length; index += 1) {
    const x = axis === 'x' ? offset : index;
    const y = axis === 'x' ? index : offset;
    if (nearWhite(png, x, y)) near += 1;
  }
  return near / length > 0.92;
}

for (const file of files) {
  const full = path.join(dir, file);
  try {
    const png = decodePng(full);
    if (png.width !== 512 || png.height !== 512) { report.skipped.push({ file, reason: 'non-512 source' }); continue; }
    let left = 0, right = 0, top = 0, bottom = 0;
    while (left < 8 && edgeStrip(png, 'x', left)) left += 1;
    while (right < 8 && edgeStrip(png, 'x', png.width - 1 - right)) right += 1;
    while (top < 8 && edgeStrip(png, 'y', top)) top += 1;
    while (bottom < 8 && edgeStrip(png, 'y', png.height - 1 - bottom)) bottom += 1;
    if (!(left || right || top || bottom)) { report.skipped.push({ file, reason: 'no border strip' }); continue; }
    const x = left, y = top, width = png.width - left - right, height = png.height - top - bottom;
    if (width < 480 || height < 480) { report.skipped.push({ file, reason: 'strip exceeds safe repair', strips: { left, right, top, bottom } }); continue; }
    const before = sha256(full);
    const output = cropNearest(png, x, y, width, height, 512, [24, 24, 24, 255]);
    fs.writeFileSync(full, output);
    report.repaired.push({ file, before, after: sha256(full), strips: { left, right, top, bottom }, cropBox: [x, y, x + width, y + height] });
  } catch (error) { report.failures.push({ file, error: error.message }); }
}

console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
