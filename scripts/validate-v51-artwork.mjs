import crypto from 'node:crypto';
import fs from 'node:fs';
import zlib from 'node:zlib';

const manifestPath = new URL('../assets/exercises/v51-active-visual-manifest.json', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const root = new URL('../', import.meta.url);
const failures = [];
const warnings = [];
const hashes = new Map();
let marginWarningCount = 0;
let pendingVisualCount = 0;
let pendingCoachCount = 0;

const parsePng = file => {
  const bytes = fs.readFileSync(file);
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const bitDepth = bytes[24];
  const colorType = bytes[25];
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 0;
  if (bitDepth !== 8 || !channels) return { width, height, pixels: null };

  const chunks = [];
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') chunks.push(bytes.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
    if (type === 'IEND') break;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  let source = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[source++];
    const row = pixels.subarray(y * stride, (y + 1) * stride);
    const previous = y ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const value = raw[source++];
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous ? previous[x] : 0;
      const upLeft = previous && x >= channels ? previous[x - channels] : 0;
      if (filter === 0) row[x] = value;
      else if (filter === 1) row[x] = (value + left) & 255;
      else if (filter === 2) row[x] = (value + up) & 255;
      else if (filter === 3) row[x] = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upLeft);
        row[x] = (value + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      } else throw new Error(`unsupported PNG filter ${filter}`);
    }
  }
  return { width, height, channels, pixels };
};

const foregroundBounds = png => {
  if (!png.pixels) return null;
  let minX = png.width, minY = png.height, maxX = -1, maxY = -1;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
    const index = (y * png.width + x) * png.channels;
    const r = png.pixels[index], g = png.pixels[index + 1], b = png.pixels[index + 2];
    const bright = Math.max(r, g, b) >= 92;
    const orange = r >= 120 && r > g * 1.25 && g > b * 1.1;
    if (bright || orange) {
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  return maxX < 0 ? null : { minX, minY, maxX, maxY };
};

for (const movement of manifest.movements) {
  const phaseHashes = [];
  for (const phase of ['setup', 'move', 'return']) {
    const path = new URL(movement.phases[phase], root);
    if (!fs.existsSync(path)) {
      failures.push(`${movement.name}: missing ${phase} image`);
      continue;
    }
    const bytes = fs.readFileSync(path);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    phaseHashes.push(hash);
    if (hashes.has(hash)) failures.push(`${movement.name} ${phase}: byte-identical to ${hashes.get(hash)}`);
    else hashes.set(hash, `${movement.name} ${phase}`);
    try {
      const png = parsePng(path);
      if (png.width !== 512 || png.height !== 512) failures.push(`${movement.name} ${phase}: expected 512×512, received ${png.width}×${png.height}`);
      const bounds = foregroundBounds(png);
      if (!bounds) warnings.push(`${movement.name} ${phase}: unable to locate visible foreground`);
      else {
        const margin = Math.min(bounds.minX, bounds.minY, 511 - bounds.maxX, 511 - bounds.maxY);
        if (margin < movement.requiredCanvas.minimumClearMarginPx) {
          marginWarningCount++;
          warnings.push(`${movement.name} ${phase}: estimated clear margin ${margin}px; requires ${movement.requiredCanvas.minimumClearMarginPx}px`);
        }
      }
    } catch (error) {
      failures.push(`${movement.name} ${phase}: ${error.message}`);
    }
  }
  if (new Set(phaseHashes).size !== phaseHashes.length) failures.push(`${movement.name}: phase images are not distinct files`);
  if (movement.visualReviewStatus !== 'approved') { pendingVisualCount++; warnings.push(`${movement.name}: visual review ${movement.visualReviewStatus}`); }
  if (movement.coachReviewStatus !== 'approved') { pendingCoachCount++; warnings.push(`${movement.name}: coach review ${movement.coachReviewStatus}`); }
}

if (failures.length) {
  console.error(`V5.1 artwork validation failed (${failures.length}):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`V5.1 artwork files: ${manifest.movementCount} movements / ${manifest.phaseImageCount} phases present and byte-distinct.`);
console.log(`Quality gate: ${marginWarningCount} phase margin warnings; ${pendingVisualCount} visual reviews pending; ${pendingCoachCount} coach reviews pending.`);
if (process.env.V51_ARTWORK_VERBOSE === '1') console.log(`Quality gate warnings (${warnings.length}):\n${warnings.join('\n')}`);
if (warnings.length) process.exitCode = 2;
