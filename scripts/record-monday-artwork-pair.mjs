#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const statePath = path.join(root, '.codex/v541/artwork-v3/monday/STATE.json');
const manifestPath = path.join(root, '.codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json');
const validationPath = path.join(root, '.codex/v541/artwork-v3/monday/VALIDATION.md');

const idArg = process.argv.find((arg) => arg.startsWith('--id='))?.slice(5);
if (!idArg) throw new Error('Usage: node scripts/record-monday-artwork-pair.mjs --id=<canonicalMovementId>');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pngSize = (file) => {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47 || b.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`Not a PNG: ${file}`);
  }
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

const manifest = readJson(manifestPath);
const state = readJson(statePath);
const record = manifest.movements.find((m) => m.canonicalMovementId === idArg);
if (!record) throw new Error(`Movement not found in Monday manifest: ${idArg}`);

const files = {};
for (const phase of ['start', 'movement']) {
  const rel = record.outputPaths[phase];
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) throw new Error(`Missing ${phase} file: ${rel}`);
  const dimensions = pngSize(abs);
  if (dimensions.width !== 512 || dimensions.height !== 512) {
    throw new Error(`${phase} must be exactly 512x512, got ${dimensions.width}x${dimensions.height}`);
  }
  files[phase] = { path: rel, hash: sha256(abs), ...dimensions };
}
if (files.start.hash === files.movement.hash) throw new Error('Start and Movement files are byte-identical');

record.generationStatus = 'technical-pass';
record.technicalReviewStatus = 'technical-pass';
record.semanticReviewStatus = 'ai-review-pending';
record.humanCoachReviewStatus = 'pending';
record.output = files;
record.generatedAt = new Date().toISOString();
record.failureReasons = [];

const completed = manifest.movements.filter((m) => m.generationStatus === 'technical-pass').length;
const next = manifest.movements.find((m) => m.generationStatus !== 'technical-pass');
const batch = next
  ? (manifest.batches.find((b) => b.movementIds.includes(next.canonicalMovementId))?.batchId ?? null)
  : null;
state.completedSets = completed;
state.completedFiles = completed * 2;
state.remainingSets = state.totalCanonicalSets - completed;
state.remainingFiles = state.remainingSets * 2;
state.currentBatch = batch;
state.currentMovementId = null;
state.currentPhase = null;
state.nextAtomicAction = next
  ? `Generate Start for ${next.displayName}`
  : 'Run final Monday technical validation';

writeJson(manifestPath, manifest);
writeJson(statePath, state);
const entry = `\n- ${new Date().toISOString()} — ${record.displayName}: Start and Movement technical pass (512×512 PNG, distinct SHA-256 hashes). Semantic review remains pending; no coach approval claimed.`;
let validation = fs.readFileSync(validationPath, 'utf8').trimEnd();
if (!validation.includes(record.canonicalMovementId)) validation += `${entry}\n`;
fs.writeFileSync(validationPath, `${validation}\n`);
console.log(JSON.stringify({ id: idArg, completedSets: completed, remainingSets: state.remainingSets, nextAtomicAction: state.nextAtomicAction, files }, null, 2));
