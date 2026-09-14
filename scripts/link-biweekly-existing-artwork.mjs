import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceDir = path.join(root, 'assets/exercises');
const targetDir = path.join(sourceDir, 'biweekly');
fs.mkdirSync(targetDir, { recursive: true });
const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-routine.js'), 'utf8'), context);
const days = context.window.GYM_COMPANION_BIWEEKLY_ROUTINE.days;
const items = new Map();
for (const day of days) for (const group of ['warmup','coreSlots','optionalSlots','cardio','recovery']) for (const item of day[group] || []) items.set(item.stableMovementId, item);
const slug = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
let copied = 0;
for (const item of items.values()) {
  const sourceSlug = slug(item.name);
  for (const phase of ['setup','move','return']) {
    const source = path.join(sourceDir, `${sourceSlug}-phase-${phase}.png`);
    const target = path.join(targetDir, `${item.stableMovementId}-phase-${phase}.png`);
    if (fs.existsSync(source) && !fs.existsSync(target)) { fs.copyFileSync(source, target); copied += 1; }
  }
}
console.log(`Linked ${copied} exact-match existing phase assets into the Bi-weekly namespace.`);
