import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
for (const file of ['../data/routine.js','../data/v5-routine.js','../data/tiered-library.js']) vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), context);
const routine = context.window.GYM_COMPANION_V5_ROUTINE || [];
const failures = [];
const excluded = /hack squat|pec deck|captain.?s chair|trap bar|ab wheel|machine chest press|dip machine|barbell hip thrust/i;
const pngSize = file => { const header=fs.readFileSync(file); return header.length>=24 && header.readUInt32BE(0)===0x89504e47 ? [header.readUInt32BE(16),header.readUInt32BE(20)] : null; };
const phasePath = (image, phase) => image.replace(/\.png$/i, `-phase-${phase}.png`);
const validate = (label, item) => {
  const name=item?.name||item?.title;
  if (!name || !item?.image) return failures.push(`${label}: movement metadata incomplete`);
  if (excluded.test(name)) failures.push(`${label}: excluded equipment movement is active`);
  for (const phase of ['setup','move','return']) {
    const file=new URL(`../${phasePath(item.image,phase)}`, import.meta.url);
    if (!fs.existsSync(file)) failures.push(`${label}: missing ${phase} art`);
    else { const size=pngSize(file); if (!size || size[0]!==512 || size[1]!==512) failures.push(`${label}: ${phase} art must be 512×512`); }
  }
};
if (routine.length!==6) failures.push(`Expected six V5 days, found ${routine.length}`);
for (const day of routine) {
  if (day.slots.length!==6) failures.push(`${day.day}: expected six core slots`);
  if ((day.optional||[]).length>5) failures.push(`${day.day}: optional bank is unexpectedly large`);
  for (const [index, slot] of day.slots.entries()) {
    if (!slot.primary || !slot.alternative) failures.push(`${day.day} slot ${index+1}: primary and alternative are required`);
    [slot.primary,slot.alternative,slot.third].filter(Boolean).forEach(item=>validate(`${day.day} slot ${index+1} ${item.name}`,item));
  }
  for (const guide of [...day.warmup.steps,...day.finish.steps]) {
    validate(`${day.day} ${guide.title}`, guide);
    (guide.choices||[]).forEach(item=>validate(`${day.day} ${guide.title} option`,item));
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated V5: ${routine.length} days, ${routine.reduce((sum, day)=>sum+day.slots.length,0)} core slots, verified equipment only, and three-phase art for every active movement.`);
