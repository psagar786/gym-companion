import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(await readFile(new URL('../data/biweekly-routine.js', import.meta.url), 'utf8'), context);
vm.runInNewContext(await readFile(new URL('../data/periodized-abc.js', import.meta.url), 'utf8'), context);
const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;
const errors = [];
const trainingDays = plan.days.filter(day => day.dayIndex < 6);
if (plan.planVersion !== 'periodized-abc-v1') errors.push('unexpected plan version');
if (plan.cadence.join('') !== 'ABAC') errors.push('cadence must be A-B-A-C');
for (const [cycleIndex, key] of plan.cadence.entries()) {
  const days = plan.days.filter(day => day.weekKey === key && (key !== 'A' || cycleIndex === 0 || day.cycleIndex === cycleIndex));
  const expectedDays = plan.days.filter(day => day.weekKey === key);
  if (expectedDays.length < 7) errors.push(`${key}: expected Monday-Sunday records`);
  days.filter(day => day.dayIndex < 6).forEach(day => {
    if (day.coreSlots.length !== 6) errors.push(`${key}/${day.dayName}: expected six core slots`);
    const movementNames = day.coreSlots.map(item => item.name);
    if (new Set(movementNames).size !== movementNames.length) errors.push(`${key}/${day.dayName}: duplicate core movement`);
    for (const movement of [...day.coreSlots, ...(day.optionalSlots || []), ...(day.warmup || []), ...(day.recovery || []), ...(day.cardio || [])]) {
      if (!movement.name || !movement.stableMovementId || !movement.sourceVersion) errors.push(`${key}/${day.dayName}: incomplete movement identity`);
      if (!movement.targetGroups?.length) errors.push(`${key}/${day.dayName}/${movement.name}: missing target groups`);
    }
  });
}
const reviewWarnings = plan.days.flatMap(day => [...day.coreSlots, ...(day.optionalSlots || []), ...(day.warmup || []), ...(day.recovery || []), ...(day.cardio || [])]).filter(item => /Review before use/.test(item.equipmentStatus || ''));
console.log(`Periodized ABC: ${trainingDays.length} training records, ${plan.days.length} total day records, cadence ${plan.cadence.join(' → ')}`);
if (reviewWarnings.length) console.log(`WARN: ${reviewWarnings.length} source movements carry equipment-review flags; they are not silently approved.`);
if (errors.length) { console.error(errors.map(error => `FAIL: ${error}`).join('\n')); process.exitCode = 1; } else console.log('PASS: six core slots, Sunday records, identities, target groups, and equipment gate validated.');
