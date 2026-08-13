import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
for (const file of ['../data/routine.js','../data/v5-routine.js','../data/tiered-library.js','../data/v5-exercise-guides.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), context);
}
const routine = context.window.GYM_COMPANION_V5_ROUTINE || [];
const guides = context.window.GYM_COMPANION_V5_EXERCISE_GUIDES || {};
const active = new Set();
for (const day of routine) {
  for (const slot of day.slots) for (const item of [slot.primary, slot.alternative, slot.third].filter(Boolean)) active.add(item.name);
  for (const name of day.optional || []) active.add(name);
  for (const panel of [day.warmup, day.finish]) for (const item of panel.steps) {
    active.add(item.title);
    for (const choice of item.choices || []) active.add(choice.name);
  }
}
const required = ['primaryTargets','secondaryTargets','equipment','why','setupInstruction','executionInstruction','returnInstruction','formCue','commonMistake','safetyCue','coachReviewStatus','visualReviewStatus','assetVersion'];
const generic = /build control and prepare|set up .*available|stop for sharp pain, dizziness, or unusual breathlessness/i;
const failures = [];
for (const name of [...active].sort()) {
  const guide = guides[name];
  if (!guide) { failures.push(`${name}: missing canonical guide`); continue; }
  for (const field of required) if (!String(guide[field] || '').trim()) failures.push(`${name}: missing ${field}`);
  if (!guide.phaseBriefs || !['setup','move','return'].every(phase => String(guide.phaseBriefs[phase] || '').trim())) failures.push(`${name}: incomplete phase briefs`);
  if (!guide.imageSet || new Set(Object.values(guide.imageSet)).size !== 3) failures.push(`${name}: phase image paths must be distinct`);
  if (generic.test([guide.why,guide.setupInstruction,guide.executionInstruction,guide.returnInstruction,guide.safetyCue].join(' '))) failures.push(`${name}: generic active copy detected`);
  if (!['mobility','stretch','cardio'].some(type => guide.tierPrescriptions === null) && !guide.tierPrescriptions) failures.push(`${name}: missing tier prescriptions`);
}
for (const name of Object.keys(guides)) if (!active.has(name)) failures.push(`${name}: guide is not active in V5`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${active.size} canonical V5.1 guides with complete coaching copy and distinct phase metadata.`);
