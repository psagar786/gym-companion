#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dir = path.join(root, '.codex/v541/artwork-v3/tuesday');
const id = process.argv.find(arg => arg.startsWith('--id='))?.slice(5);
if (!id) throw new Error('Usage: node scripts/record-tuesday-artwork-pair.mjs --id=<canonicalMovementId>');
const read = file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(dir, file), `${JSON.stringify(value, null, 2)}\n`);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pngSize = file => {
  const bytes = fs.readFileSync(file);
  if (bytes.length < 24 || bytes.readUInt32BE(0) !== 0x89504e47 || bytes.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${file}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};
const manifest = read('GENERATION-MANIFEST.json');
const state = read('STATE.json');
const record = manifest.movements.find(item => item.canonicalMovementId === id);
if (!record) throw new Error(`Movement not found: ${id}`);
const output = {};
for (const phase of ['start', 'movement']) {
  const rel = record.outputPaths[phase];
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing ${phase}: ${rel}`);
  const dimensions = pngSize(file);
  if (dimensions.width !== 512 || dimensions.height !== 512) throw new Error(`${phase} must be 512x512`);
  output[phase] = { path: rel, hash: hash(file), ...dimensions };
}
if (output.start.hash === output.movement.hash) throw new Error('Start and Movement are byte-identical');
record.generationStatus = 'technical-pass';
record.technicalReviewStatus = 'technical-pass';
record.semanticReviewStatus = 'ai-review-pending';
record.humanCoachReviewStatus = 'pending';
record.output = output;
record.generatedAt = new Date().toISOString();
const completed = manifest.movements.filter(item => item.generationStatus === 'technical-pass').length;
const next = manifest.movements.find(item => item.generationStatus !== 'technical-pass');
state.completedSets = completed;
state.completedFiles = completed * 2;
state.remainingSets = manifest.totalSets - completed;
state.remainingFiles = state.remainingSets * 2;
state.currentMovementId = null;
state.currentPhase = null;
state.completedMovementIds = [...new Set([...(state.completedMovementIds || []), id])];
state.currentCheckpoint = `V541-TUE-${id}-PAIR-COMPLETE`;
state.nextAtomicAction = next ? `Generate Start for ${next.name}` : 'Run Tuesday technical validation';
write('GENERATION-MANIFEST.json', manifest);
write('STATE.json', state);
let validation = fs.readFileSync(path.join(dir, 'VALIDATION.md'), 'utf8').trimEnd();
validation += `\n- ${new Date().toISOString()} — ${record.name}: Start and Movement technical pass (512×512 PNG, distinct SHA-256 hashes). AI semantic review and human gym-coach review remain pending.\n`;
fs.writeFileSync(path.join(dir, 'VALIDATION.md'), `${validation}`);
console.log(JSON.stringify({ id, completedSets: completed, remainingSets: state.remainingSets, output, nextAtomicAction: state.nextAtomicAction }, null, 2));
