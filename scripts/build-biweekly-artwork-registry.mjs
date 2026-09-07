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
const aliasToCanonical = new Map([
  ['flat-dumbbell-bench', 'flat-dumbbell-bench-press'],
  ['incline-db-press', 'incline-dumbbell-bench-press-30'],
  ['incline-dumbbell-press', 'incline-dumbbell-bench-press-30'],
  ['dumbbell-rrl', 'dumbbell-romanian-deadlift-rdl'],
  ['dumbbell-rdl', 'dumbbell-romanian-deadlift-rdl']
]);
const records = new Map();
const movementId = name => aliasToCanonical.get(slugify(name)) || slugify(name);
const expectedImageSet = name => Object.fromEntries(phases.map(phase => [phase, `assets/exercises/biweekly/biweekly-${slugify(name)}-phase-${phase}.png`]));
const hasImageSet = imageSet => Object.values(imageSet || {}).some(Boolean);
const add = (name, sourceItem, role, day) => {
  const id = movementId(name);
  const providedImageSet = hasImageSet(sourceItem?.imageSet) ? sourceItem.imageSet : null;
  const current = records.get(id) || { stableMovementId: id, name, aliases: [], roles: new Set(), compatibleDays: new Set(), targetGroups: sourceItem?.targetGroups || [], equipment: sourceItem?.equipment || '', equipmentStatus: sourceItem?.equipmentStatus || 'Approved', imageSet: providedImageSet || expectedImageSet(name), alt: sourceItem?.alt_text || `Fitness 7 illustration: ${name}`, sourceSheetRows: new Set(), phaseBriefs: sourceItem?.detailContent?.phaseBriefs || sourceItem?.phaseBriefs || null, detailContent: sourceItem?.detailContent || null, visualReviewStatus: 'pending', coachReviewStatus: 'pending', assetVersion: 'biweekly-v1' };
  if (name !== current.name && !current.aliases.includes(name)) current.aliases.push(name);
  current.roles.add(role); current.compatibleDays.add(`${day.weekKey}-${day.dayName}`);
  // An alternative may not erase a canonical movement's known phase images.
  if (providedImageSet) current.imageSet = providedImageSet;
  if (!current.phaseBriefs && sourceItem?.detailContent?.phaseBriefs) current.phaseBriefs = sourceItem.detailContent.phaseBriefs;
  if (!current.detailContent && sourceItem?.detailContent) current.detailContent = sourceItem.detailContent;
  for (const row of sourceItem?.sourceSheetRows || [sourceItem?.sourceSheetRow]) if (row) current.sourceSheetRows.add(row);
  records.set(id, current);
};
for (const day of source.days || []) {
  for (const [role, items] of Object.entries({ warmup: day.warmup, core: day.coreSlots, optional: day.optionalSlots, cardio: day.cardio, recovery: day.recovery })) for (const item of items || []) {
    add(item.name, item, role, day);
    for (const alternative of item.alternatives || []) add(alternative, { ...item, name: alternative, imageSet: {} }, 'alternative', day);
  }
}
const output = { registryVersion: 'biweekly-artwork-registry-v2', sourceVersion: source.planVersion, generatedAt: new Date().toISOString(), movements: [...records.values()].map(record => ({ ...record, artworkStatus: phases.every(phase => record.imageSet?.[phase] && fs.existsSync(path.join(root, record.imageSet[phase]))) ? 'complete' : 'pending', roles: [...record.roles], compatibleDays: [...record.compatibleDays], sourceSheetRows: [...record.sourceSheetRows], requiredPhases: phases })) };
fs.writeFileSync(path.join(root, 'data/biweekly-artwork-registry.js'), `window.GYM_COMPANION_BIWEEKLY_REGISTRY = ${JSON.stringify(output, null, 2)};\n`);
console.log(`Built bi-weekly artwork registry: ${output.movements.length} canonical movement records.`);
