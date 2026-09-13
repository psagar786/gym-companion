import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dir = path.join(root, '.codex/v541/artwork-v3/tuesday');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'GENERATION-MANIFEST.json'), 'utf8'));
const entries = manifest.entries || manifest.movements || [];
const statePath = path.join(dir, 'STATE.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const errors = [];
const validated = [];

function abs(relativePath) { return path.join(root, relativePath); }
function hash(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function dimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { width, height };
}

for (const entry of entries) {
  const startPath = abs(entry.outputPaths.start);
  const movementPath = abs(entry.outputPaths.movement);
  for (const [phase, file] of [['start', startPath], ['movement', movementPath]]) {
    if (!fs.existsSync(file)) { errors.push(`${entry.canonicalMovementId}:${phase}: missing ${entry.outputPaths[phase]}`); continue; }
    const d = dimensions(file);
    if (d.width !== 512 || d.height !== 512) errors.push(`${entry.canonicalMovementId}:${phase}: expected 512x512, got ${d.width}x${d.height}`);
  }
  if (fs.existsSync(startPath) && fs.existsSync(movementPath)) {
    const startHash = hash(startPath); const movementHash = hash(movementPath);
    if (startHash === movementHash) errors.push(`${entry.canonicalMovementId}: start and movement hashes are identical`);
    validated.push({ id: entry.canonicalMovementId, start: startHash, movement: movementHash });
  }
}

if (entries.length !== 36) errors.push(`expected 36 new Tuesday entries, found ${entries.length}`);
if (validated.length !== entries.length) errors.push(`validated ${validated.length}/${entries.length} pairs`);

state.validation = { ...(state.validation || {}), technical: { status: errors.length ? 'fail' : 'pass', validatedPairs: validated.length, validatedFiles: validated.length * 2, errors } };
if (!errors.length) {
  state.currentCheckpoint = 'V541-TUE-TECHNICAL-PASS';
  state.nextAtomicAction = 'Build the explicit Tuesday V3 runtime registry';
}
fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
const report = `\n## Technical validation (${new Date().toISOString()})\n\n- New Tuesday pairs checked: ${validated.length}/${entries.length}\n- New Tuesday files checked: ${validated.length * 2}/${entries.length * 2}\n- PNG dimensions: ${errors.length ? 'FAIL' : '512×512 for all checked files'}\n- Start/Movement hash distinction: ${errors.length ? 'FAIL' : 'PASS'}\n- Status: **${errors.length ? 'FAIL' : 'PASS'}**\n${errors.length ? `\n### Errors\n${errors.map(error => `- ${error}`).join('\\n')}\n` : ''}`;
fs.appendFileSync(path.join(dir, 'VALIDATION.md'), report);
if (errors.length) { console.error(report); process.exitCode = 1; } else console.log(report);
