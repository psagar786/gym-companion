import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const context={window:{}};vm.createContext(context);vm.runInContext(await fs.readFile(path.join(root,'data/biweekly-routine.js'),'utf8'),context);
const source=context.window.GYM_COMPANION_BIWEEKLY_ROUTINE;
const strict=process.argv.includes('--strict-assets');
const errors=[];const warnings=[];
if(source?.planVersion!=='biweekly-v1') errors.push('Unexpected planVersion.');
if(source?.rotation!=='alternate-weekly') errors.push('Rotation must be alternate-weekly.');
if(source?.days?.length!==14) errors.push(`Expected 14 day records; found ${source?.days?.length||0}.`);
const seen=new Set();
for(const day of source?.days||[]){
  const key=`${day.weekKey}-${day.dayIndex}`;if(seen.has(key))errors.push(`Duplicate day ${key}`);seen.add(key);
  if(!['A','B'].includes(day.weekKey)||day.dayIndex<0||day.dayIndex>6)errors.push(`Invalid day key ${key}`);
  if(day.dayIndex<6&&day.coreSlots?.length!==6)errors.push(`${key} must have six core slots; found ${day.coreSlots?.length||0}.`);
  if(day.optionalSlots?.length>2)errors.push(`${key} has more than two optional slots.`);
  for(const group of ['warmup','coreSlots','optionalSlots','cardio','recovery']) for(const item of day[group]||[]){
    if(!item.id||!item.name||!item.sourceSheetRow)errors.push(`${key} ${group} contains an incomplete record.`);
    for(const phase of ['setup','move','return']) if(!item.imageSet?.[phase])errors.push(`${item.name} is missing ${phase} image path.`);
    if(item.equipmentStatus==='Review before use')warnings.push(`${key}: ${item.name} requires equipment review.`);
    if(item.imageSet && !['setup','move','return'].every(phase=>existsSync(path.join(root,item.imageSet[phase])))) warnings.push(`${key}: ${item.name} has pending artwork assets.`);
  }
}
for(const week of ['A','B']) if((source.days||[]).filter(day=>day.weekKey===week).length!==7)errors.push(`Week ${week} must contain seven day records.`);
console.log(`Validated biweekly-v1: ${source.days.length} days, ${source.days.filter(day=>day.dayIndex<6).length} training-day records, ${warnings.length} review warnings.`);
if(warnings.length)console.log(`Review warnings: ${warnings.slice(0,12).join(' | ')}${warnings.length>12?' | …':''}`);
if(strict&&warnings.length)process.exitCode=2;
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
