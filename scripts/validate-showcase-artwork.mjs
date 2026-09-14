import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const phases = ['setup', 'move', 'return'];
const exercises = [
  ['Incline Dumbbell Bench Press 30°', 'incline-dumbbell-bench-press-30'],
  ['Wide-Grip Lat Pulldown', 'wide-grip-lat-pulldown'],
  ['Seated Hip Abductor Machine', 'seated-hip-abductor-machine'],
  ['Cable Pallof Press with Iso-Hold', 'cable-pallof-press-with-iso-hold'],
  ['Chest-Supported Incline Dumbbell Row', 'chest-supported-incline-dumbbell-row']
];

const readPng = file => {
  const data = readFileSync(file);
  if (data.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file}: not a PNG`);
  let offset = 8;
  let width; let height; let bitDepth; let colorType; let interlace;
  const idat = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.toString('ascii', offset + 4, offset + 8);
    const body = data.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0); height = body.readUInt32BE(4); bitDepth = body[8]; colorType = body[9]; interlace = body[12];
    } else if (type === 'IDAT') idat.push(body);
    offset += 12 + length;
    if (type === 'IEND') break;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) throw new Error(`${file}: unsupported PNG encoding`);
  const channels = colorType === 6 ? 4 : 3;
  const rowBytes = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * channels);
  let inOffset = 0;
  let previous = Buffer.alloc(rowBytes);
  for (let y = 0; y < height; y++) {
    const filter = raw[inOffset++];
    const row = raw.subarray(inOffset, inOffset + rowBytes);
    inOffset += rowBytes;
    for (let x = 0; x < rowBytes; x++) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous[x] || 0;
      const upperLeft = x >= channels ? previous[x - channels] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upperLeft;
        const pa = Math.abs(p - left); const pb = Math.abs(p - up); const pc = Math.abs(p - upperLeft);
        predictor = pa <= pb && pa <= pc ? left : (pb <= pc ? up : upperLeft);
      } else if (filter !== 0) throw new Error(`${file}: unsupported PNG filter ${filter}`);
      row[x] = (row[x] + predictor) & 255;
    }
    row.copy(pixels, y * rowBytes);
    previous = Buffer.from(row);
  }
  return { width, height, channels, pixels };
};

const sample = decoded => {
  const side = 32;
  const result = new Float32Array(side * side);
  const active = new Uint8Array(side * side);
  for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) {
    const sx = Math.min(decoded.width - 1, Math.floor(x * decoded.width / side));
    const sy = Math.min(decoded.height - 1, Math.floor(y * decoded.height / side));
    const i = (sy * decoded.width + sx) * decoded.channels;
    const red = decoded.pixels[i] / 255;
    const green = decoded.pixels[i + 1] / 255;
    const blue = decoded.pixels[i + 2] / 255;
    result[y * side + x] = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    active[y * side + x] = result[y * side + x] > 0.14 || red - green > 0.06 ? 1 : 0;
  }
  return { values: result, active };
};

const distance = (a, b) => {
  let total = 0; let count = 0;
  for (let i = 0; i < a.values.length; i++) if (a.active[i] || b.active[i]) {
    total += Math.abs(a.values[i] - b.values[i]);
    count++;
  }
  return count ? total / count : 0;
};
const failures = [];
const report = [];
for (const [name, slug] of exercises) {
  const images = phases.map(phase => resolve(`assets/exercises/${slug}-phase-${phase}.png`));
  const decoded = [];
  const hashes = new Set();
  for (const file of images) {
    if (!existsSync(file)) { failures.push(`${name}: missing ${file}`); continue; }
    const bytes = readFileSync(file);
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (hashes.has(hash)) failures.push(`${name}: byte-identical phase asset`);
    hashes.add(hash);
    const image = readPng(file);
    if (image.width !== 512 || image.height !== 512) failures.push(`${name}: ${file} must be 512×512`);
    decoded.push(sample(image));
  }
  if (decoded.length === 3) {
    const distances = [distance(decoded[0], decoded[1]), distance(decoded[1], decoded[2]), distance(decoded[0], decoded[2])];
    if (distances.some(value => value < 0.04)) failures.push(`${name}: phases are perceptually too similar (${distances.map(value => value.toFixed(3)).join(', ')})`);
    report.push(`${name}: ${distances.map(value => value.toFixed(3)).join(' / ')}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${exercises.length} showcase exercises / ${exercises.length * 3} phase images.`);
console.log(`Perceptual distances (setup→move / move→return / setup→return):\n${report.join('\n')}`);
