import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const registrySource = await readFile(join(root, 'data/periodized-v2-pilot.js'), 'utf8');
const paths = [...registrySource.matchAll(/'(assets\/exercises\/periodized-v2\/[^']+\.png)'/g)].map(match => match[1]);
const unique = new Set(paths);
const results = [];
for (const path of paths) {
  const absolute = join(root, path);
  const exists = existsSync(absolute);
  const size = exists ? statSync(absolute).size : 0;
  const hash = exists ? createHash('sha256').update(await readFile(absolute)).digest('hex') : null;
  results.push({ path, exists, size, hash });
}
const missing = results.filter(item => !item.exists);
const hashes = new Set(results.filter(item => item.hash).map(item => item.hash));
const report = { registeredFiles: paths.length, uniquePaths: unique.size, missingFiles: missing.length, uniqueHashes: hashes.size, files: results };
console.log(JSON.stringify(report, null, 2));
if (missing.length || unique.size !== paths.length) process.exitCode = 1;
