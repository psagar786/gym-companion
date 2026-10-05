// Portable release gate: no local image libraries or checkpoint files required.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';

const current=artworkRuntime({review:true}), baseline=artworkRuntime();
const result=inventory(current), before=inventory(baseline);
assert.equal(result.cases.length,72);
assert.deepEqual(result.cases,before.cases,'Selectable programming changed');
for(const day of current.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']) {
 const plans=[baseline,current].map(c=>{c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;return c.periodizedPlan(day.dayIndex);});
 const programming=p=>p.member_plan_slots.map(s=>({id:s.id,choices:[s.exercise,s.alternative,s.third].map(x=>x?{id:x.id,name:x.name,scheme:x.scheme,prescriptions:x.prescriptions,targetGroups:x.targetGroups}:null)}));
 assert.equal(JSON.stringify(programming(plans[0])),JSON.stringify(programming(plans[1])),`${day.id}/${tier}: workout programming changed`);
}
const active=result.occurrences.filter(r=>r.eligible&&!r.nonExercise);
const expected=new Set();let compoundOccurrences=0;
for(const row of active) {
 assert.equal(row.artworkStatus,'complete',`${row.day}/${row.name}/${row.tier}: pending artwork`);
 assert.ok(row.filePairPresent,`${row.name}: missing pair`);
 const components=row.artworkComponents?.length?row.artworkComponents:[row];
 if(row.artworkComponents?.length)compoundOccurrences++;
 for(const component of components) {
  const pair=component.imageSet;
  assert.notEqual(pair.start,pair.movement);
  const hashes=['start','movement'].map(phase=>{const file=pair[phase];assert.match(file,/\.webp$/);expected.add(file);return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');});
  assert.notEqual(hashes[0],hashes[1],`${row.name}: identical phase images`);
 }
}
const manifest=JSON.parse(execFileSync(process.execPath,['scripts/build-v541-active-asset-manifest.mjs','--json'],{encoding:'utf8',maxBuffer:8*1024*1024}));
assert.deepEqual([...expected].sort(),manifest.entries.map(e=>e.path).sort(),'Deployment omits tier or compound phase files');
const built=fs.existsSync('public/index.html');
if(built)for(const e of manifest.entries)assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/'+e.path)).digest('hex'),e.sha256,e.path+' differs in public output');
for(let day=0;day<6;day++)for(const name of ['Cable Standing Abduction','Ab Wheel Rollout','Band Pull-Apart'])assert.equal(current.window.GYM_COMPANION_ABAC_ARTWORK.resolve({name},day).reviewOnly,true);
assert.ok(fs.readFileSync('index.html','utf8').includes('data/abac-artwork-review.js'));
console.log(JSON.stringify({status:'PASS',runtimeCases:result.cases.length,activeOccurrences:active.length,compoundOccurrences,activeImages:expected.size,builtOutputVerified:built,programmingUnchanged:true,excludedEquipmentUnavailable:true}));
