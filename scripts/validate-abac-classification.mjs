import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), context={window:{}};
for(const file of ['biweekly-routine','abac-classification','periodized-abc','v53-content']) vm.runInNewContext(fs.readFileSync('data/'+file+'.js','utf8'),context);
const registry=context.window.GYM_COMPANION_ABAC_CLASSIFICATION, plan=context.window.GYM_COMPANION_PERIODIZED_ABC;
let occurrences=0;
for(const day of plan.days) for(const role of ['coreSlots','optionalSlots','warmup','recovery','cardio']) for(const item of day[role]||[]) {
  for(const name of [item.name,...item.alternatives||[]]) {
    assert.equal(registry.resolve({...item,name}).classificationStatus,'reviewed',name);
    occurrences++;
  }
}
for(const item of context.window.GYM_COMPANION_V53_CONTENT.tendon) assert.equal(registry.resolve(item).classificationStatus,'reviewed',item.name);
for(const [name,group] of Object.entries({'Leg Press':'legs','Lying Leg Curl':'legs','Flat Dumbbell Bench Press':'chest','Incline Dumbbell Reverse Fly':'shoulders','Forearm Plank':'core','Dumbbell Walking Lunges':'legs','Dead Bug':'core','Hanging Windshield Wipers':'core','Dumbbell Shrugs':'back'})) assert.deepEqual([...registry.resolve(name).targetGroups],[group],name);
assert.deepEqual([...registry.resolve({stableMovementId:'parent',name:'Lying Leg Curl'}).targetGroups],['legs']);
registry.register({id:'parent',name:'Flat Dumbbell Bench Press'});
assert.deepEqual([...registry.resolve({id:'parent',name:'Lying Leg Curl'}).targetGroups],['legs'],'parent identity must not leak');
assert.equal(registry.resolve('Unreviewed New Movement').classificationStatus,'needs-review');
assert.equal(registry.resolve('Unreviewed New Movement').targetGroups.length,0);
const baseline={window:{}};
vm.runInNewContext(fs.readFileSync('data/biweekly-routine.js','utf8'),baseline);
vm.runInNewContext(execFileSync('git',['show','498c565:data/periodized-abc.js'],{encoding:'utf8'}),baseline);
function withoutGroups(value) {
 return JSON.parse(JSON.stringify(value,(key,item)=>['targetGroups','primaryTargets','secondaryTargets','activityType','classificationStatus'].includes(key)?undefined:item));
}
assert.deepEqual(withoutGroups(plan),withoutGroups(baseline.window.GYM_COMPANION_PERIODIZED_ABC),'non-classification routine data changed');
const app=fs.readFileSync('member-app.js','utf8');
function extract(name) { const start=app.indexOf('function '+name+'('); const end=app.indexOf('\nfunction ',start+1); return app.slice(start,end); }
const labels=['Chest + back','Core','Legs + glutes','Upper body','Core','Glutes + hamstrings + back'];
const c={memberDayFocusLabels:labels,displayPlan:()=>null,planSlots:p=>p?.member_plan_slots||[]};
vm.createContext(c);vm.runInContext(extract('memberDayPresentation')+'\n'+extract('memberSnapshotPresentation'),c);
for(const day of plan.days.filter(d=>d.dayIndex<6)) for(const tier of ['beginner','intermediate','expert']) {
 const result=c.memberDayPresentation(day.dayIndex,{weekKey:day.weekKey,member_plan_slots:day.coreSlots});
 assert.equal(result.focusLabel,labels[day.dayIndex]);assert.equal(result.exerciseCount,6);
 assert.equal(result.progressionLabel,{A:'Progression 1 of 3',B:'Progression 2 of 3',C:'Progression 3 of 3'}[day.weekKey]);
}
const historical={day_index:1,source_version:'v5',plan_snapshot:{focus:'Historic chest workout',week_key:'A'}}, before=JSON.stringify(historical);
assert.equal(c.memberSnapshotPresentation(historical).focusLabel,'Historic chest workout');assert.equal(JSON.stringify(historical),before);
assert.equal(c.memberSnapshotPresentation({...historical,source_version:'periodized-abc-v1'}).focusLabel,'Core');
console.log('PASS: '+occurrences+' named occurrences, tendon records, 54 day/week/level presentations; classifications, parent isolation, unknown gate, historical immutability, and unchanged prescriptions/artwork/order.');

