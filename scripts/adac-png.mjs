import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

export function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }

export function decodePng(file) {
  const b = Buffer.isBuffer(file) ? file : fs.readFileSync(file);
  if (b.length < 33 || b.subarray(0, 8).compare(Buffer.from([137,80,78,71,13,10,26,10])) !== 0) throw new Error('not a PNG');
  let pos = 8, idat = [], width, height, depth, color;
  while (pos + 12 <= b.length) {
    const len = b.readUInt32BE(pos), kind = b.toString('ascii', pos + 4, pos + 8), data = b.subarray(pos + 8, pos + 8 + len);
    if (kind === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); depth = data[8]; color = data[9]; }
    if (kind === 'IDAT') idat.push(data);
    pos += len + 12; if (kind === 'IEND') break;
  }
  if (!width || !height || depth !== 8 || ![2, 6].includes(color)) throw new Error('requires 8-bit RGB/RGBA PNG');
  const channels = color === 6 ? 4 : 3, stride = width * channels, raw = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * stride); let at = 0;
  for (let y = 0; y < height; y++) { const filter = raw[at++], row = pixels.subarray(y * stride, (y + 1) * stride), prev = y ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) { const v = raw[at++], left = x >= channels ? row[x - channels] : 0, up = prev ? prev[x] : 0, ul = prev && x >= channels ? prev[x - channels] : 0;
      if (filter === 0) row[x] = v; else if (filter === 1) row[x] = (v + left) & 255; else if (filter === 2) row[x] = (v + up) & 255; else if (filter === 3) row[x] = (v + Math.floor((left + up) / 2)) & 255; else if (filter === 4) { const p = left + up - ul, pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - ul); row[x] = (v + (pa <= pb && pa <= pc ? left : pb <= pc ? up : ul)) & 255; } else throw new Error(`unsupported PNG filter ${filter}`);
    }
  }
  return { width, height, channels, pixels };
}

function chunk(type, data) { const t = Buffer.from(type), body = Buffer.concat([t, data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(body) >>> 0); const n = Buffer.alloc(4); n.writeUInt32BE(data.length); return Buffer.concat([n, body, c]); }
function crc32(buf) { let c = 0xffffffff; for (const x of buf) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return (c ^ 0xffffffff) >>> 0; }
export function encodePng({ width, height, pixels, channels = 4 }) { const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = channels === 4 ? 6 : 2; const rows = Buffer.alloc(height * (width * channels + 1)); for (let y = 0; y < height; y++) { rows[y * (width * channels + 1)] = 0; pixels.copy(rows, y * (width * channels + 1) + 1, y * width * channels, (y + 1) * width * channels); } return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]); }

export function cropNearest(src, x, y, width, height, outSize = 512, bg = [35, 35, 35, 255]) { const out = Buffer.alloc(outSize * outSize * 4); for (let i = 0; i < out.length; i += 4) out.set(bg, i); const scale = Math.min(outSize / width, outSize / height), dw = Math.max(1, Math.round(width * scale)), dh = Math.max(1, Math.round(height * scale)), ox = Math.floor((outSize - dw) / 2), oy = Math.floor((outSize - dh) / 2); for (let dy = 0; dy < dh; dy++) for (let dx = 0; dx < dw; dx++) { const sx = Math.min(src.width - 1, x + Math.floor(dx / scale)), sy = Math.min(src.height - 1, y + Math.floor(dy / scale)), si = (sy * src.width + sx) * src.channels, di = ((oy + dy) * outSize + ox + dx) * 4; out[di] = src.pixels[si]; out[di + 1] = src.pixels[si + 1]; out[di + 2] = src.pixels[si + 2]; out[di + 3] = src.channels === 4 ? src.pixels[si + 3] : 255; } return encodePng({ width: outSize, height: outSize, pixels: out }); }

export function geometry(size) { const outer = size * 0.025, gutter = size * 0.0125, cell = (size - (2 * outer) - (4 * gutter)) / 5; return { outer, gutter, cell }; }
