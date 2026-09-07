import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-routine.js'), 'utf8'), context);
const source = context.window.GYM_COMPANION_BIWEEKLY_ROUTINE;
const phases = ['setup', 'move', 'return'];
const slugify = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const records = new Map();
const add = (name, role, day, item, isAlternative = false) => {
  const id = `${isAlternative ? 'alternative-' : ''}${slugify(name)}`;
  const record = records.get(id) || { id, name, roles: new Set(), days: new Set(), alternative: isAlternative, imageSet: isAlternative ? {} : (item.imageSet || {}), sourceSheetRows: new Set() };
  record.roles.add(role); record.days.add(`${day.weekKey}-${day.dayName}`);
  for (const row of item.sourceSheetRows || [item.sourceSheetRow]) if (row) record.sourceSheetRows.add(row);
  records.set(id, record);
};
for (const day of source.days || []) for (const [role, items] of Object.entries({ warmup: day.warmup, core: day.coreSlots, optional: day.optionalSlots, cardio: day.cardio, recovery: day.recovery })) for (const item of items || []) {
  add(item.name, role, day, item);
  for (const alternative of item.alternatives || []) add(alternative, 'alternative', day, item, true);
}
const report = [...records.values()].map(record => {
  const missing = phases.filter(phase => !record.imageSet?.[phase] || !fs.existsSync(path.join(root, record.imageSet[phase])));
  return { id: record.id, name: record.name, roles: [...record.roles].sort(), days: [...record.days].sort(), alternative: record.alternative, missingPhases: missing, artworkStatus: missing.length ? 'pending' : 'complete', sourceSheetRows: [...record.sourceSheetRows] };
});
const byRole = Object.fromEntries(['core', 'alternative', 'warmup', 'recovery', 'cardio', 'optional'].map(role => {
  const rows = report.filter(item => item.roles.includes(role));
  return [role, { total: rows.length, complete: rows.filter(item => item.artworkStatus === 'complete').length, pending: rows.filter(item => item.artworkStatus === 'pending').length }];
}));
console.log(JSON.stringify({ sourceVersion: source.planVersion, generatedAt: new Date().toISOString(), totalRecords: report.length, complete: report.filter(item => item.artworkStatus === 'complete').length, pending: report.filter(item => item.artworkStatus === 'pending').length, byRole, records: report }, null, 2));
