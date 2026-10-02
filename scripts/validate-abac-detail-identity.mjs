import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const c=artworkRuntime(),source=fs.readFileSync('member-app.js','utf8');
for(const name of ['activeArtworkDisplay','detailLinkKey','detailItem','detailRecord']) {
 const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);
 vm.runInContext(source.slice(start,end),c);
}
c.state.screen='workout';let cases=0,records=0;
for(const day of c.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']) {
 c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;c.state.detailTargets=new Map();
 const plan=c.periodizedPlan(day.dayIndex),items=[...plan.member_plan_slots.flatMap(s=>[s.exercise,s.alternative,s.third].filter(Boolean)),...plan.warmup,...plan.recovery,...plan.tendon,...plan.extras];
 for(const item of items) {
  const before=JSON.stringify(item),key=c.detailLinkKey(item),selected=c.detailItem(key),detail=c.detailRecord(selected);
  assert.equal(detail.name,item.name||item.title);assert.equal(detail.scheme,item.scheme||item.duration||'');
  assert.equal(JSON.stringify(detail.prescriptions),JSON.stringify(item.prescriptions));
  assert.equal(detail.imageSet.movement,item.imageSet?.movement||'');assert.equal(detail.imageSet.start,item.imageSet?.start||'');
  assert.equal(JSON.stringify(item),before,'Input mutation');
  if(item.__alternative){const own=c.window.GYM_COMPANION_ABAC_ARTWORK.resolve({...item,__alternative:true},day.dayIndex);assert.equal(selected.equipment,own.equipment,JSON.stringify({name:item.name,day:day.dayIndex,stateDay:c.state.dayIndex,selected,own}));}
  records++;
 }
 assert.equal(c.detailItem('unknown-exercise-slug'),null);cases++;
}
// Same-name occurrences keep distinct authored dose and exact clicked identity.
c.state.detailTargets=new Map();
const a={id:'saved-a',name:'Floor Crunch',scheme:'2 × 8'},b={id:'saved-b',name:'Floor Crunch',scheme:'4 × 12'};
const ka=c.detailLinkKey(a),kb=c.detailLinkKey(b);assert.notEqual(ka,kb);assert.equal(c.detailItem(ka).scheme,a.scheme);assert.equal(c.detailItem(kb).scheme,b.scheme);
// A pending alternative must not retain its parent's machine/cue.
const alt=c.biweeklyItem({id:'test-alt-1',name:'Unknown Exact Alternative',__alternative:true,equipment:'PARENT MACHINE',cue:'PARENT CUE',startInstruction:'PARENT SETUP',movementInstruction:'PARENT MOVE',scheme:'3 × 12'});
assert.equal(alt.equipment,undefined);assert.ok(!alt.startInstruction.includes('PARENT'));assert.ok(!alt.movementInstruction.includes('PARENT'));
console.log(JSON.stringify({status:'PASS',cases,detailRecords:records,sameNameIsolation:true,unknownDetailBlocked:true,alternativeMetadataIsolation:true,inputSnapshotsImmutable:true}));
