import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const sharp=createRequire(import.meta.url)('/Users/exxxy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir='.codex/v541/artwork-completion-review';
const sourceBaseline=JSON.parse(fs.readFileSync(dir+'/STATE.json')).baselineSourceCommit;
let protectedSourceFiles=0;
// The old mobile validator locks an earlier repair commit. This review must
// compare against its own frozen, accepted source, not erase that older evidence.
for(const line of execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',sourceBaseline,'data','assets','lib','api','member-app.js','styles.css'],{encoding:'utf8'}).trim().split('\n')){
 const split=line.indexOf(' '),expected=line.slice(0,split),file=line.slice(split+1),bytes=fs.readFileSync(file);
 const actual=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(actual,expected,'Frozen baseline file changed: '+file);protectedSourceFiles++;
}
const old=artworkRuntime(),next=artworkRuntime({review:true});
const baseline=inventory(old),result=inventory(next),manifest=JSON.parse(fs.readFileSync(dir+'/GENERATION-MANIFEST.json'));
assert.equal(result.cases.length,72);assert.deepEqual(result.cases,baseline.cases);
for(const day of next.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']){
 for(const c of [old,next]){c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;}
 const plans=[old,next].map(c=>c.periodizedPlan(day.dayIndex));
 const programming=p=>p.member_plan_slots.map(s=>({id:s.id,position:s.position,choices:[s.exercise,s.alternative,s.third].map(x=>x?{id:x.id,name:x.name,prescriptions:x.prescriptions,scheme:x.scheme,targetGroups:x.targetGroups}:null)}));
 assert.equal(JSON.stringify(programming(plans[1])),JSON.stringify(programming(plans[0])),`Programming changed ${day.weekKey}/${day.dayName}/${tier}`);
}
const records=next.window.GYM_COMPANION_LOCAL_ARTWORK_REVIEW.records;
let cardDetailChecks=0;
for(const day of next.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']){
 next.currentDay=day;next.state.dayIndex=day.dayIndex;next.state.preferences.tier=tier;next.state.screen='workout';
 const plan=next.periodizedPlan(day.dayIndex);
 const items=[...plan.member_plan_slots.flatMap(s=>[s.exercise,s.alternative,s.third].filter(Boolean)),...plan.warmup,...plan.recovery,...plan.tendon,...plan.extras];
 for(const item of items){
  const displayed=next.activeArtworkDisplay(item),details=next.detailRecord(displayed);
  assert.equal(displayed.id,item.id);assert.equal(displayed.name,item.name);assert.equal(displayed.scheme,item.scheme);
  assert.equal(next.previewImage(displayed),details.imageSet.movement||'');
  assert.equal(details.detailSteps[0].image,displayed.imageSet.start||'');
  assert.equal(details.detailSteps[1].image,displayed.imageSet.movement||'');
  if(displayed.artworkStatus==='complete')assert.ok(details.imageSet.start&&details.imageSet.movement);
  if(displayed.mappingStatus==='combined-needs-content-decision')assert.deepEqual(JSON.parse(JSON.stringify(displayed.imageSet)),{});
  cardDetailChecks++;
 }
}
let files=0;
for(const r of records){
 const m=manifest.find(m=>m.id===r.canonicalMovementId);assert.equal(m.status,'pair-reviewed');
 const hits=result.occurrences.filter(x=>x.artworkStatus==='complete'&&(r.names.includes(x.name)||x.canonicalMovementId===r.canonicalMovementId));assert.ok(hits.length,r.name+' unmapped');
 for(const hit of hits){assert.equal(hit.imageSet.start,r.imageSet.start);assert.equal(hit.imageSet.movement,r.imageSet.movement);}
 for(const p of ['start','movement']){
  const b=fs.readFileSync(r.imageSet[p]);const meta=await sharp(b).metadata();assert.equal(meta.width,512);assert.equal(meta.height,512);
  assert.equal(crypto.createHash('sha256').update(b).digest('hex'),m.phases[p].webpSha256);files++;
 }
 assert.notEqual(m.phases.start.sha256,m.phases.movement.sha256);
}
for(let day=0;day<6;day++)for(const name of ['Cable Standing Abduction','Ab Wheel Rollout','Band Pull-Apart'])assert.equal(next.window.GYM_COMPANION_ABAC_ARTWORK.resolve({name},day).reviewOnly,true);
for(const name of old.window.GYM_COMPANION_ABAC_ARTWORK.combined)assert.equal(next.window.GYM_COMPANION_ABAC_ARTWORK.resolve({name},0).mappingStatus,'combined-needs-content-decision');
const api=next.window.GYM_COMPANION_ABAC_ARTWORK;
assert.equal(api.resolve({name:'Standard Forearm Plank to RKC Hardstyle Plank',__reviewTier:'intermediate'},4).name,'Standard Forearm Plank to RKC Hardstyle Plank');
assert.match(api.resolve({name:'Standard Forearm Plank to RKC Hardstyle Plank',__reviewTier:'intermediate'},4).imageSet.movement,/standard-forearm-plank/);
assert.match(api.resolve({name:'Standard Forearm Plank to RKC Hardstyle Plank',__reviewTier:'expert'},4).imageSet.movement,/rkc/);
assert.equal(api.resolve({name:'Standard Forearm Plank to RKC Hardstyle Plank',__reviewTier:'beginner'},4).artworkStatus,'pending');
assert.match(api.resolve({name:'Standing & Seated Transverse Abdominis Stomach Vacuum',__reviewTier:'intermediate'},1).imageSet.movement,/standing.*vacuum/);
assert.equal(api.resolve({name:'Standing & Seated Transverse Abdominis Stomach Vacuum',__reviewTier:'expert'},1).artworkStatus,'pending');
assert.match(api.resolve({name:'Walking Lunges'},2).imageSet.movement,/dumbbell-walking/);
assert.equal(api.resolve({name:'Walking Lunges'},2).imageSet.movement,old.window.GYM_COMPANION_ABAC_ARTWORK.byId['biweekly-dumbbell-walking-lunges'].imageSet.movement);
for(const e of JSON.parse(fs.readFileSync(dir+'/PROTECTED-ASSET-HASHES.json')))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(e.path)).digest('hex'),e.sha256,e.path);
const pending=result.rows.filter(r=>r.eligible&&!r.nonExercise&&!r.filePairPresent);
fs.writeFileSync(dir+'/POST-INTEGRATION-INVENTORY.json',JSON.stringify(result,null,2)+'\n');
const report={status:'PASS',runtimeCases:72,occurrenceChecks:result.occurrences.length,cardDetailChecks,acceptedPairs:records.length,displayFiles:files,baselineResolvedDayNames:baseline.stats.resolvedDayNames,reviewResolvedDayNames:result.stats.resolvedDayNames,pendingDayNames:pending.length,unchangedProgramming:true,protectedArtworkFiles:304,protectedSourceFiles,sourceBaseline,pending:pending.map(r=>({day:r.day,name:r.name,status:r.mappingStatus,pendingCases:r.pendingCases}))};
fs.writeFileSync(dir+'/ASSET-VALIDATION.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
