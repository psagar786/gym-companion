import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-artwork-registry.js'), 'utf8'), context);
const registry = context.window.GYM_COMPANION_BIWEEKLY_REGISTRY || { movements: [] };
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayKeys = ['A', 'B'].flatMap(week => days.map(day => `${week}-${day}`));
const byDay = new Map(dayKeys.map(day => [day, new Map()]));

for (const movement of registry.movements || []) {
  for (const reference of movement.compatibleDays || []) {
    if (byDay.has(reference)) byDay.get(reference).set(movement.stableMovementId, movement);
  }
}

const summary = movements => ({
  total: movements.length,
  complete: movements.filter(item => item.artworkStatus === 'complete').length,
  pending: movements.filter(item => item.artworkStatus !== 'complete').length
});
const all = registry.movements || [];
const lines = [
  '# Bi-Weekly Artwork Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `- Canonical movements: ${summary(all).total}`,
  `- Complete three-frame sets: ${summary(all).complete}`,
  `- Pending three-frame sets: ${summary(all).pending}`,
  '- Activation rule: every active movement requires three approved frames; pending records remain review-only.',
  ''
];

for (const key of dayKeys) {
  const movements = [...byDay.get(key).values()].sort((a, b) => a.name.localeCompare(b.name));
  const totals = summary(movements);
  lines.push(`## Week ${key[0]} · ${key.slice(2)} — ${totals.complete}/${totals.total} complete`, '');
  lines.push('| Movement | Roles | Equipment | Status | Source rows |', '| --- | --- | --- | --- | --- |');
  for (const item of movements) lines.push(`| ${item.name} | ${(item.roles || []).join(', ')} | ${item.equipment || '—'} | ${item.artworkStatus} | ${(item.sourceSheetRows || []).join(', ')} |`);
  lines.push('');
}
fs.mkdirSync(path.join(root, 'output/reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'output/reports/biweekly-artwork-audit.md'), `${lines.join('\n')}\n`);
console.log(`Wrote detailed day-by-day audit for ${all.length} canonical movements.`);
