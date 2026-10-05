import fs from 'node:fs';
import vm from 'node:vm';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const c=artworkRuntime({review:true}),source=fs.readFileSync('member-app.js','utf8');
for(const name of ['prescriptionTierKey','parsePrescriptionText','authoredPrescription','rolePrescriptionDefault','tierPrescription']){
 const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);vm.runInContext(source.slice(start,end),c);
}
c.tierDefaults={beginner:{label:'Beginner'},intermediate:{label:'Intermediate'},expert:{label:'Expert'}};
const seen=new Set(),days=[];
const range=s=>{const m=String(s||'').match(/^(\d+)(?:[–-](\d+))?$/);return m?[+m[1],+(m[2]||m[1])]:[0,0]};
for(const day of c.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']){
 const key=`${day.weekKey}|${day.dayIndex}|${tier}`;if(seen.has(key))continue;seen.add(key);
 c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;
 const plan=c.periodizedPlan(day.dayIndex),items=plan.member_plan_slots.map((slot,index)=>{
  const i=slot.exercise,p=c.tierPrescription(i,tier),cl=c.window.GYM_COMPANION_ABAC_CLASSIFICATION.resolve(i);
  return {slot:index+1,name:i.name,id:i.id,canonicalId:i.canonicalMovementId,equipment:i.equipment,groups:cl.targetGroups,activityType:cl.activityType,sets:p.sets,reps:p.reps,duration:p.duration,rest:p.rest,status:p.status||'scheduled',source:p.source||'role-default',sourceText:p.sourceText||null,authoredTier:i.prescriptions?.[tier==='expert'?'advanced':tier]||null,contentStatus:i.contentReviewStatus,mappingStatus:i.mappingStatus};
 });
 const active=items.filter(i=>i.status!=='unavailable');
 const setRange=active.reduce((a,i)=>{const r=range(i.sets);return[a[0]+r[0],a[1]+r[1]]},[0,0]);
 const core=active.filter(i=>i.groups?.includes('core')).reduce((a,i)=>{const r=range(i.sets);return[a[0]+r[0],a[1]+r[1]]},[0,0]);
 days.push({week:day.weekKey,day:day.dayName,tier,mainSlots:items.length,availableSlots:active.length,nominalSetRange:setRange,coreClassifiedSetRange:core,items,guided:[...plan.warmup.map(i=>({...i,zone:'warmup'})),...plan.recovery.map(i=>({...i,zone:'recovery'}))].map(i=>({name:i.name,zone:i.zone,...c.tierPrescription(i,tier)}))});
}
const weeks=[];
for(const week of ['A','B','C'])for(const tier of ['beginner','intermediate','expert']){
 const rows=days.filter(d=>d.week===week&&d.tier===tier);
 weeks.push({week,tier,days:rows.length,nominalMainSetRange:rows.reduce((a,d)=>a.map((v,j)=>v+d.nominalSetRange[j]),[0,0]),coreClassifiedSetRange:rows.reduce((a,d)=>a.map((v,j)=>v+d.coreClassifiedSetRange[j]),[0,0])});
}
const output={scope:'Resolved primary/main choice only; alternatives, extras and warm-ups excluded from volume totals. Nominal authored/default sets are not measured hard sets, unique-muscle sets or personal tolerance. A repeated occurrence counted once per weekly phase.',days,weeks};
fs.writeFileSync('.codex/v541/artwork-completion-review/TRAINING-ANALYSIS.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({weeks,intermediateDaily:days.filter(d=>d.tier==='intermediate').map(({week,day,nominalSetRange,coreClassifiedSetRange,items})=>({week,day,nominalSetRange,coreClassifiedSetRange,items:items.map(i=>({name:i.name,sets:i.sets,rest:i.rest,source:i.source,status:i.status}))}))},null,2));
