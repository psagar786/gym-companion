import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { decodePng, geometry, sha256 } from './adac-png.mjs';
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url))); const args = process.argv.slice(2); const input = args.find(x => !x.startsWith('--')) || path.join(root, 'batches');
const files = fs.statSync(input).isFile() ? [input] : fs.readdirSync(input, { recursive: true }).filter(x => /(?:start|movement)-master\.png$/i.test(x)).map(x => path.join(input, x));
const failures = [], warnings = [], rows = [];
for (const file of files) { try { const png = decodePng(file); if (png.width !== png.height) throw new Error(`non-square master ${png.width}x${png.height}`); const g = geometry(png.width); if (g.cell < 1) throw new Error('invalid 5x5 geometry'); rows.push({ file: path.relative(root, file), width: png.width, height: png.height, sourceSha256: sha256(file), geometry: { outerMargin: 0.025, gutter: 0.0125, cellPixels: g.cell } });
    // Check every tile is addressable; no pixels are trimmed or inferred.
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const x = Math.round(g.outer + c * (g.cell + g.gutter)), y = Math.round(g.outer + r * (g.cell + g.gutter)); if (x + Math.round(g.cell) > png.width || y + Math.round(g.cell) > png.height) throw new Error(`tile ${r + 1},${c + 1} exceeds master`); }
  } catch (e) { failures.push(`${path.relative(root, file)}: ${e.message}`); } }
if (!files.length) failures.push(`no *-master.png files found under ${path.relative(root, input)}`);
const report = { generatedAt: new Date().toISOString(), masters: rows, failures, warnings };
console.log(JSON.stringify(report, null, 2)); if (failures.length) process.exitCode = 1;
