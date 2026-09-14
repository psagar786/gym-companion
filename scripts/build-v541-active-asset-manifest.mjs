import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const context = { window: {} };
vm.createContext(context);
for (const file of ['data/periodized-v3-monday-artwork.js', 'data/periodized-v3-tuesday-artwork.js', 'data/periodized-v3-day-artwork.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const sources = [
  ['Monday', context.window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK],
  ['Tuesday', context.window.GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK],
  ...Object.entries(context.window.GYM_COMPANION_PERIODIZED_V3_DAY_ARTWORK.days || {})
];
const entries = new Map();
for (const [day, source] of sources) {
  for (const record of Object.values(source?.movements || {})) {
    if (record.artworkStatus !== 'complete') continue;
    for (const phase of ['start', 'movement']) {
      const assetPath = record.imageSet?.[phase];
      if (!assetPath || !fs.existsSync(path.join(root, assetPath))) continue;
      const key = `${assetPath}|${phase}`;
      const previous = entries.get(key) || { path: assetPath, phase, movementIds: [], days: [], bytes: fs.statSync(path.join(root, assetPath)).size };
      if (!previous.movementIds.includes(record.stableMovementId)) previous.movementIds.push(record.stableMovementId);
      if (!previous.days.includes(day)) previous.days.push(day);
      previous.sha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, assetPath))).digest('hex');
      entries.set(key, previous);
    }
  }
}
const output = {
  version: 'v541-active-assets-v1',
  generatedAt: new Date().toISOString(),
  source: 'periodized-v3 registries and explicit day mappings',
  entries: [...entries.values()].sort((a, b) => a.path.localeCompare(b.path)),
  stats: {
    files: entries.size,
    pairs: new Set([...entries.values()].map(entry => entry.movementIds[0])).size,
    bytes: [...entries.values()].reduce((sum, entry) => sum + entry.bytes, 0),
    pendingDays: ['Thursday', 'Friday', 'Saturday']
  },
  exclusions: ['contact sheets', 'master boards', 'crop workspaces', 'review-only and unreferenced historical namespaces', 'local backups']
};
fs.writeFileSync(path.join(root, '.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.stats, null, 2));
