import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../data/routine.js', import.meta.url), 'utf8'), context);
const routine = context.window.GYM_COMPANION_ROUTINE || [];
const failures = [];
for (const day of routine) {
  if (day.slots.length !== 10) failures.push(`${day.day}: expected 10 main slots, found ${day.slots.length}`);
  for (const [index, slot] of day.slots.entries()) {
    if (!slot.primary?.name || !slot.alternative?.name) failures.push(`${day.day} slot ${index + 1}: primary and alternative required`);
    for (const option of [slot.primary, slot.alternative, slot.third].filter(Boolean)) {
      if (!fs.existsSync(new URL(`../${option.image}`, import.meta.url))) failures.push(`${day.day}: missing image ${option.image}`);
    }
  }
  for (const step of [...(day.warmup?.steps || []), ...(day.finish?.steps || [])]) {
    if (!step.title || !step.image || !step.alt) failures.push(`${day.day}: guided step metadata incomplete`);
    if (!fs.existsSync(new URL(`../${step.image}`, import.meta.url))) failures.push(`${day.day}: missing guided image ${step.image}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated V4 routine: ${routine.length} days, ${routine.reduce((sum, day) => sum + day.slots.length, 0)} ordered slots.`);
