import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const context = { window: {} };
vm.createContext(context);
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js', 'data/periodized-v3-day-artwork.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const runtime = context.window.GYM_COMPANION_PERIODIZED_ABC;
const registry = context.window.GYM_COMPANION_PERIODIZED_V3_DAY_ARTWORK;
const report = { days: {}, failures: [] };
for (const [dayName, dayIndex] of [['Wednesday', 2], ['Thursday', 3]]) {
  const artwork = registry.days[dayName];
  const rows = new Map();
  for (const day of runtime.days.filter(item => item.dayIndex === dayIndex)) {
    for (const role of ['coreSlots', 'warmup', 'cardio', 'recovery', 'optionalSlots']) {
      for (const item of day[role] || []) {
        rows.set(`${item.id}|primary`, { item, role, runtimeId: item.id });
        for (const alternative of item.alternatives || []) rows.set(`${item.id}|${alternative}`, { item: { ...item, name: alternative }, role: 'alternative', runtimeId: `periodized-${slug(alternative)}` });
      }
    }
  }
  let complete = 0; let pending = 0;
  for (const row of rows.values()) {
    const mapping = artwork.runtimeMap[row.runtimeId] || artwork.runtimeMap[`periodized-${slug(row.item.name)}`];
    const record = mapping && artwork.movements[mapping.canonicalMovementId];
    if (!record) { report.failures.push(`${dayName}: unmapped ${row.runtimeId} (${row.item.name})`); continue; }
    const start = record.imageSet?.start || ''; const movement = record.imageSet?.movement || '';
    const filesExist = start && movement && fs.existsSync(path.join(root, start)) && fs.existsSync(path.join(root, movement));
    if (record.artworkStatus === 'complete' && !filesExist) report.failures.push(`${dayName}: complete record missing files ${record.stableMovementId}`);
    if (record.artworkStatus === 'complete') complete += 1; else pending += 1;
  }
  report.days[dayName] = { runtimeRecords: rows.size, complete, pending, mapped: rows.size - report.failures.filter(item => item.startsWith(`${dayName}: unmapped`)).length };
}
console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
