import { deflateSync, inflateSync } from 'node:zlib';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const phases = ['setup', 'move', 'return'];
const exercises = [
  ['Incline Dumbbell Bench Press 30°', 'incline-dumbbell-bench-press-30'],
  ['Wide-Grip Lat Pulldown', 'wide-grip-lat-pulldown'],
  ['Seated Hip Abductor Machine', 'seated-hip-abductor-machine'],
  ['Cable Pallof Press with Iso-Hold', 'cable-pallof-press-with-iso-hold'],
  ['Chest-Supported Incline Dumbbell Row', 'chest-supported-incline-dumbbell-row']
];

const decode = file => {
  const data = readFileSync(file); let offset = 8; let width; let height; let bitDepth; let colorType; const chunks = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset); const type = data.toString('ascii', offset + 4, offset + 8); const body = data.subarray(offset + 8, offset + 8 + length); offset += 12 + length;
    if (type === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); bitDepth = body[8]; colorType = body[9]; }
    if (type === 'IDAT') chunks.push(body); if (type === 'IEND') break;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) throw new Error(`${file}: unsupported PNG`);
  const channels = colorType === 6 ? 4 : 3; const rowBytes = width * channels; const raw = inflateSync(Buffer.concat(chunks)); const pixels = Buffer.alloc(width * height * 3); let inOffset = 0; let prev = Buffer.alloc(rowBytes);
  for (let y = 0; y < height; y++) {
    const filter = raw[inOffset++]; const row = raw.subarray(inOffset, inOffset + rowBytes); inOffset += rowBytes;
    for (let x = 0; x < rowBytes; x++) {
      const left = x >= channels ? row[x - channels] : 0; const up = prev[x] || 0; const upperLeft = x >= channels ? prev[x - channels] : 0; let p = 0;
      if (filter === 1) p = left; else if (filter === 2) p = up; else if (filter === 3) p = Math.floor((left + up) / 2); else if (filter === 4) { const q = left + up - upperLeft; const pa = Math.abs(q - left); const pb = Math.abs(q - up); const pc = Math.abs(q - upperLeft); p = pa <= pb && pa <= pc ? left : (pb <= pc ? up : upperLeft); }
      row[x] = (row[x] + p) & 255;
    }
    for (let x = 0; x < width; x++) { const src = x * channels; const dst = (y * width + x) * 3; pixels[dst] = row[src]; pixels[dst + 1] = row[src + 1]; pixels[dst + 2] = row[src + 2]; }
    prev = Buffer.from(row);
  }
  return { width, height, pixels };
};

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = buffer => { let c = 0xffffffff; for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, body) => { const typeBytes = Buffer.from(type); const header = Buffer.alloc(4); header.writeUInt32BE(body.length); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, body]))); return Buffer.concat([header, typeBytes, body, crc]); };

const cell = 256; const gap = 16; const columns = 3; const rows = exercises.length; const width = columns * cell + (columns - 1) * gap; const height = rows * cell + (rows - 1) * gap; const pixels = Buffer.alloc(width * height * 3, 20);
for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
  const slug = exercises[row][1]; const file = resolve(`assets/exercises/${slug}-phase-${phases[col]}.png`); if (!existsSync(file)) throw new Error(`Missing ${file}`); const image = decode(file);
  const x0 = col * (cell + gap); const y0 = row * (cell + gap);
  for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
    const sx = Math.floor(x * image.width / cell); const sy = Math.floor(y * image.height / cell); const src = (sy * image.width + sx) * 3; const dst = ((y0 + y) * width + x0 + x) * 3; pixels[dst] = image.pixels[src]; pixels[dst + 1] = image.pixels[src + 1]; pixels[dst + 2] = image.pixels[src + 2];
  }
}
const raw = Buffer.alloc((width * 3 + 1) * height); for (let y = 0; y < height; y++) { raw[y * (width * 3 + 1)] = 0; pixels.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3); }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 2; const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
const output = resolve('outputs/biweekly-artwork-showcase/five-exercises-contact-sheet.png'); mkdirSync(resolve('outputs/biweekly-artwork-showcase'), { recursive: true }); writeFileSync(output, png); console.log(output);
