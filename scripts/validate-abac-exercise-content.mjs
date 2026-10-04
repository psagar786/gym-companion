import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const c=artworkRuntime({review:process.argv.includes('--review')}),source=fs.readFileSync('member-app.js','utf8');
for(const name of ['prescriptionTierKey','parsePrescriptionText','authoredPrescription','rolePrescriptionDefault','tierPrescription','prescribeExercise','approvedVideoUrl','doseMetricLabel','detailRecord']) {
 const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);vm.runInContext(source.slice(start,end),c);
}
c.tierDefaults={beginner:{label:'Beginner'},intermediate:{label:'Intermediate'},expert:{label:'Expert'}};
c.URL=URL;
for(const videoUrl of [null,'javascript:alert(1)','http://youtube.com/watch?v=demo','https://evil.youtube.com/watch?v=demo','https://user@youtube.com/watch?v=demo','not a URL'])assert.equal(c.approvedVideoUrl({videoUrl,videoReviewStatus:'approved'}),null);
assert.equal(c.approvedVideoUrl({videoUrl:'https://youtu.be/demo'}),null);
assert.equal(c.approvedVideoUrl({videoUrl:'https://youtu.be/demo',videoReviewStatus:'approved'}),'https://youtu.be/demo');
assert.equal(c.doseMetricLabel({duration:'15 min'}),'Duration');assert.equal(c.doseMetricLabel({duration:'30 sec',trainingMethod:'Isometric hold'}),'Hold');
const fixtures=[
 ['3 Sets x 12 Reps | Rest: 60 sec',{sets:'3',reps:'12',duration:null,rest:'60 sec'}],
 ['3 sets × 12–15 reps',{sets:'3',reps:'12–15',duration:null}],
 ['4 X 8',{sets:'4',reps:'8'}],['30 sec × 3 sets',{sets:'3',duration:'30 sec',reps:null}],
 ['3 × 30 sec',{sets:'3',duration:'30 sec'}],['3 × 30s Hold | Rest: 45s',{duration:'30 sec',rest:'45 sec',trainingMethod:'Isometric hold'}],
 ['8 each side',{reps:'8 each side'}],['10 each direction',{reps:'10 each direction'}],
 ['15–20 min',{duration:'15–20 min'}],['3 sets × 12 reps/side (Hold 3s) | Rest: 90–120 sec',{reps:'12 per side',duration:null,rest:'90–120 sec',trainingMethod:null}],
 ['15m Incline Intervals',{duration:'15 min',trainingMethod:'Interval'}],
 ['2 rounds · 6 slow reps · 20s rest',{sets:'2',reps:'6',duration:null,rest:'20 sec'}],
 ['2 sets · 20–30s/side · 20s rest',{sets:'2',duration:'20–30 sec per side',rest:'20 sec'}],
 ['3 sets × 10 steps/leg | Rest: 60s',{reps:'10 per leg',repUnit:'steps'}],
 ['4 sets x 25 reps total | Rest: 45s | Focus: 1s isometric squeeze',{reps:'25 total',duration:null,trainingMethod:null}],
 ['3 sets · 10–15/side · 60s rest',{sets:'3',reps:'10–15 per side'}],
 ['Superset: 3 sets x 10 reps',{trainingMethod:'Superset'}],['Circuit: 3 rounds x 8 reps',{trainingMethod:'Circuit'}],
 ['Drop set: 3 x 12',{trainingMethod:'Drop set'}],['Tempo set: 3 x 8',{trainingMethod:'Tempo set'}],
 ['Unilateral alternating set: 3 sets x 8 reps',{trainingMethod:'Unilateral alternating set'}],
 ['18 min (4 min hard + 2 min easy × 3 rounds)',{sets:null,duration:'18 min'}]
];
for(const [input,expected]of fixtures){const result=c.parsePrescriptionText(input);for(const [key,value]of Object.entries(expected))assert.equal(result?.[key],value,`${input}: ${key}`);}
for(const input of ['Rest: 45 sec','Rest: 90–120 sec','Focus: hold for 3 sec','Tempo: 3 sec','3 sets','Move with control'])assert.equal(c.parsePrescriptionText(input),null,input);
assert.equal(c.authoredPrescription({prescriptions:{advanced:'4 x 8',expert:'3 x 12'}},'expert').reps,'8');
assert.equal(c.authoredPrescription({prescriptions:{intermediate:{sets:3,reps:'10–12',restSeconds:60}}},'intermediate').source,'structured');
assert.equal(c.tierPrescription({name:'No Cardio',duration:'No Cardio'}).displayDose,'No cardio scheduled');
assert.equal(c.tierPrescription({name:'NO CARDIO (Safeguard Knee & CNS Recovery)',scheme:'-'}).displayDose,'No cardio scheduled');
assert.equal(c.tierPrescription({name:'Incline Walk',scheme:'-'}).status,'missing-cardio-prescription');
assert.equal(c.tierPrescription({name:'Floor Crunch',scheme:'[Locked / Skipped for Intermediate]'}).status,'unavailable');
let cases=0,records=0,sourceBacked=0,defaults=0,missingPrescriptions=0;const resolved=new Set(),review=new Map(),conflicts=new Map(),excludedStatus=new Set();
for(const day of c.periodized.days.filter(d=>d.dayIndex<6))for(const tier of ['beginner','intermediate','expert']) {
 c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;
 const plan=c.periodizedPlan(day.dayIndex),items=[...plan.member_plan_slots.flatMap(s=>[s.exercise,s.alternative,s.third].filter(Boolean)),...plan.warmup,...plan.recovery,...plan.tendon,...plan.extras];
 for(const item of items) {
  const before=JSON.stringify(item),result=c.prescribeExercise(item,tier),p=result.tierPrescription,key=day.dayName+'|'+item.name;
  assert.ok(p.displayDose);assert.equal(JSON.stringify(item),before,'Input snapshot mutation');
  assert.equal(JSON.stringify(result.prescriptions),JSON.stringify(item.prescriptions));
  assert.equal(JSON.stringify(result.imageSet),JSON.stringify(item.imageSet));
  if(['authored','structured'].includes(p.source))sourceBacked++;else if(p.source==='needs-review')missingPrescriptions++;else defaults++;
  if(item.contentReviewStatus==='source-backed-ai-reviewed'){
   resolved.add(key);assert.ok(item.contentSource);assert.ok(!/stable starting position|clear working position|mark unknown/.test(item.startInstruction));
  }else if(p.status!=='non-exercise') {
   const row=review.get(key)||{day:day.dayName,name:item.name,status:item.contentReviewStatus,mappingStatus:item.mappingStatus,cases:[]};row.cases.push({week:day.weekKey,tier,scheme:item.scheme});review.set(key,row);
   if(item.contentReviewStatus==='tier-execution-conflict')conflicts.set(key,row);
  }else excludedStatus.add(key);
  const detail=c.detailRecord(result);assert.equal(detail.detailSteps[0].instruction,item.startInstruction);assert.equal(detail.detailSteps[1].instruction,item.movementInstruction);
  records++;
 }
 cases++;
}
const initial=JSON.parse(fs.readFileSync('.codex/v541/audit-repairs/details/INSTRUCTION-REVIEW-QUEUE.json')).labels;
const remainingInitial=initial.filter(name=>[...review.values()].some(row=>row.name===name));
const content=c.window.GYM_COMPANION_ABAC_CONTENT;
const check=(name,day)=>{const raw={name,__alternative:true};const art=c.window.GYM_COMPANION_ABAC_ARTWORK.resolve(raw,day),item=content.enrich({...raw,imageSet:art.imageSet},day);assert.equal(JSON.stringify(item.imageSet),JSON.stringify(art.imageSet));return item;};
assert.match(check('Dumbbell RDL',2).equipment,/dumbbell/i);
assert.match(check('Side Plank Clamshells',5).equipment,/mat/i);
assert.match(check('Cable Upright Row (Wide)',5).equipment,/low cable/i);
assert.equal(content.resolve({name:'Cable Standing Abduction'},5),null);
assert.equal(content.resolve({name:'Ez-Bar Curl & Skullcrushers'},3),null);
console.log(JSON.stringify({status:'PASS',prescriptionFixtures:fixtures.length+12,videoAndMetricChecks:10,cases,records,authoredOrStructuredPrescriptionOccurrences:sourceBacked,roleDefaultOccurrences:defaults,missingCardioPrescriptionOccurrences:missingPrescriptions,excludedNonExerciseDayNames:excludedStatus.size,contentRegistryRecords:Object.keys(content.records).length,sourceBackedDayNames:resolved.size,reviewDayNames:review.size,initialAlternativeLabels:initial.length,repairedAlternativeLabels:initial.length-remainingInitial.length,remainingAlternativeLabels:remainingInitial,executionConflictDayNames:conflicts.size,reviewQueue:[...review.values()]},null,2));
