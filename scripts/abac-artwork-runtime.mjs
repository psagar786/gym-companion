import fs from 'node:fs';
import vm from 'node:vm';
export function artworkRuntime({baseline=false,review=false}={}) {
 const c={window:{},state:{dayIndex:0,preferences:{tier:'intermediate'}},location:{search:''},URLSearchParams, effectiveTemplateKey:()=> 'periodized-abc',slugify:v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')};
 vm.createContext(c);
 for(const file of ['routine','v5-routine','biweekly-routine','biweekly-artwork-registry','tiered-library','v5-exercise-guides','v53-content','v53-threeweek','abac-classification','periodized-abc','periodized-artwork','periodized-v3-monday-artwork','periodized-v3-tuesday-artwork','periodized-v3-day-artwork','periodized-v2-pilot',...(!baseline&&fs.existsSync('data/abac-artwork-resolver.js')?['abac-artwork-resolver']:[]),...(!baseline&&fs.existsSync('data/abac-exercise-content.js')?['abac-exercise-content']:[])]) vm.runInContext(fs.readFileSync('data/'+file+'.js','utf8'),c,{filename:file});
 for(const [key,global] of Object.entries({biweekly:'BIWEEKLY_ROUTINE',biweeklyArtwork:'BIWEEKLY_REGISTRY',training:'TRAINING',v53Content:'V53_CONTENT',v53Plan:'V53_THREEWEEK',periodized:'PERIODIZED_ABC',periodizedArtwork:'PERIODIZED_ARTWORK',periodizedV3MondayArtwork:'PERIODIZED_V3_MONDAY_ARTWORK',periodizedV3TuesdayArtwork:'PERIODIZED_V3_TUESDAY_ARTWORK',periodizedV3DayArtwork:'PERIODIZED_V3_DAY_ARTWORK',periodizedV2Pilot:'PERIODIZED_V2_PILOT'})) c[key]=c.window['GYM_COMPANION_'+global]||{};
 if(review)vm.runInContext(fs.readFileSync('data/abac-artwork-review.js','utf8'),c,{filename:'local-review'});
 const app=baseline ? fs.readFileSync('.codex/v541/audit-repairs/artwork/BASELINE-MEMBER-APP.txt','utf8') : fs.readFileSync('member-app.js','utf8');
 if(app.includes('const periodizedV4Overrides')) vm.runInContext(app.slice(app.indexOf('const periodizedV4Overrides'),app.indexOf('const periodizedV2Pilot')),c);
 for(const name of ['previewImage','activeArtworkDisplay','phaseAsset','approvedVideoUrl','detailRecord','biweeklyReadiness','biweeklyPreviewMode','v2ArtworkRecord','rawBiweeklyRegistryRecord','biweeklyRegistryRecord','biweeklyItem','periodizedResolvedItem','inferredGroups','movementClass','progressionFor','coachingFor','normalizeExercise','isStretchOrMobility','periodizedPlan']) {
  const start=app.indexOf('function '+name+'('); if(start<0)continue;
  const end=app.indexOf('\nfunction ',start+1);vm.runInContext(app.slice(start,end<0?undefined:end),c);
 }
 c.scheduledDate=()=>new Date();c.periodizedDay=()=>c.currentDay;
 return c;
}
export function inventory(c) {
 const rows=new Map(),cases=[],occurrences=[];
 for(const day of c.periodized.days.filter(d=>d.dayIndex<6)) for(const tier of ['beginner','intermediate','expert']) {
  c.currentDay=day;c.state.dayIndex=day.dayIndex;c.state.preferences.tier=tier;
  const plan=c.periodizedPlan(day.dayIndex,new Date());
  const allowed=new Set(plan.member_plan_slots.flatMap(s=>s.exercise.targetGroups||[]).filter(g=>!['mobility','cardio','status'].includes(g)));
  const add=(item,role,slot,eligible=true)=> {
   if(!item)return;
   eligible=eligible&&item.levelEligibility?.[tier]!==false;
   const name=item.name||item.title, key=day.dayName+'|'+name;
   const row=rows.get(key)||{day:day.dayName,name,runtimeIds:[],stableIds:[],roles:[],cases:[],eligible:false,equipment:item.equipment||null,imageSet:item.imageSet||{},artworkStatus:item.artworkStatus,canonicalId:item.canonicalMovementId||item.stableMovementId,mappingStatus:item.mappingStatus,reviewOnly:!!item.reviewOnly,classificationStatus:item.classificationStatus,nonExercise:/NO CARDIO|^hydration$|^nutritional adherence\.?$/i.test(name)};
   for(const [field,value] of [['runtimeIds',item.id],['stableIds',item.stableMovementId],['roles',role]])if(value&&!row[field].includes(value))row[field].push(value);
   row.cases.push([day.weekKey,tier,role,slot,eligible]);row.eligible ||= eligible;
   const pair=item.imageSet||{},components=item.artworkComponents||[];
   const present=components.length?components.every(c=>c.imageSet?.start&&c.imageSet?.movement&&[c.imageSet.start,c.imageSet.movement].every(p=>fs.existsSync(p))):!!pair.start&&!!pair.movement&&[pair.start,pair.movement].every(p=>fs.existsSync(p));
   occurrences.push({day:day.dayName,week:day.weekKey,cycleDayId:day.id,tier,role,slot,eligible,name,
    runtimeId:item.id,stableMovementId:item.stableMovementId,canonicalMovementId:item.canonicalMovementId,
    imageSet:pair,artworkComponents:components,artworkStatus:item.artworkStatus,mappingStatus:item.mappingStatus,
    filePairPresent:present,
    nonExercise:row.nonExercise});
   row.filePairPresent=!!row.imageSet.start&&!!row.imageSet.movement&&[row.imageSet.start,row.imageSet.movement].every(p=>fs.existsSync(p));
   rows.set(key,row);
  };
  plan.member_plan_slots.forEach((s,index)=>{add(s.exercise,'main',index);add(s.alternative,'alternative',index);add(s.third,'option2',index)});
  for(const role of ['warmup','recovery','tendon']) (plan[role]||[]).forEach((i,index)=>add(i,role,index));
  (plan.extras||[]).forEach((i,index)=>add(i,'optional',index,!c.isStretchOrMobility(i)&&i.targetGroups?.length>0&&i.targetGroups.every(g=>allowed.has(g))));
  // Source entries not selectable are retained as evidence, not image demand.
  const exclusions=[];
  for(const raw of [...day.coreSlots,...day.optionalSlots||[]])for(const name of [raw.name,...raw.alternatives||[]]) {
   if(/captain|band(?:ed|s)?|trap[- ]bar|cable (?:standing )?(?:hip )?abduction|pec[- ]deck|ab wheel/i.test(name))exclusions.push(name);
  }
  cases.push({day:day.dayName,week:day.weekKey,tier,mainSlots:plan.member_plan_slots.length,excludedNames:[...new Set(exclusions)]});
 }
 // A complete Beginner occurrence cannot hide a missing Expert occurrence.
 for(const row of rows.values()){
  const active=occurrences.filter(o=>o.day===row.day&&o.name===row.name&&o.eligible);
  const pending=active.filter(o=>!o.filePairPresent||o.artworkStatus!=='complete');
  row.pendingCases=pending.map(o=>({week:o.week,tier:o.tier,role:o.role,slot:o.slot,status:o.mappingStatus}));
  row.filePairPresent=active.length>0&&pending.length===0;
  if(row.filePairPresent)row.artworkStatus='complete';
 }
 return {cases,occurrences,rows:[...rows.values()],stats:{cases:cases.length,dayNames:rows.size,eligibleDayNames:[...rows.values()].filter(r=>r.eligible).length,resolvedDayNames:[...rows.values()].filter(r=>r.eligible&&r.filePairPresent&&r.artworkStatus==='complete').length}};
}
