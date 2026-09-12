import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const registrySource = await readFile(join(root, 'data/periodized-v2-pilot.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(registrySource, context);
const registry = context.window.GYM_COMPANION_PERIODIZED_V2_PILOT;
const paths = Object.values(registry.movements || {}).flatMap(item => [item.imageSet?.start, item.imageSet?.movement].filter(Boolean));
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
const report = { registeredSets: Object.keys(registry.movements || {}).length, registeredFiles: paths.length, uniquePaths: unique.size, missingFiles: missing.length, uniqueHashes: hashes.size, files: results };
console.log(JSON.stringify(report, null, 2));
if (report.registeredSets !== 43 || paths.length !== 86 || missing.length || unique.size !== paths.length || hashes.size !== paths.length) process.exitCode = 1;
