import fs from 'node:fs';
import crypto from 'node:crypto';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const runtime=artworkRuntime(), current=inventory(runtime), baseline=JSON.parse(fs.readFileSync('.codex/v541/audit-repairs/artwork/BASELINE-INVENTORY.json','utf8'));
const old=new Map(baseline.rows.map(r=>[r.day+'|'+r.name,r]));
const ambiguous=new Set(['Leg Press','45° Incline Leg Press','Reverse Lunges with Dumbbells','Walking Lunges','Bulgarian Split Squats','Stick Hip Swings','Incline Bench Row','Low-to-High Cable Fly','Dumbbell Pullover on Flat Bench']);
const category=row=>row.nonExercise?'non-exercise':!row.eligible?'unavailable-choice':row.mappingStatus==='deferred-tendon-review'?'deferred-tendon':row.mappingStatus==='combined-needs-content-decision'?'combined-needs-decision':row.mappingStatus==='existing-artwork-needs-review'?'existing-artwork-review':row.filePairPresent?'complete':ambiguous.has(row.name)?'mechanics-clarification':'missing-approved-pair';
const rows=current.rows.map(r=>({...r,category:category(r),repaired:r.filePairPresent&&!old.get(r.day+'|'+r.name)?.filePairPresent}));
const missing=[...new Map(rows.filter(r=>r.category==='missing-approved-pair').map(r=>[r.name,{name:r.name,canonicalMovementId:'periodized-'+runtime.slugify(r.name),days:rows.filter(i=>i.name===r.name).map(i=>i.day),generationStatus:'not-authorized'}])).values()];
const paths=[...new Set(baseline.rows.flatMap(r=>Object.values(r.imageSet||{})).filter(p=>p&&fs.existsSync(p)))];
const originalHashes=Object.fromEntries(paths.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
const stats={resolvedRuntimeCases:current.cases.length,eligiblePhysicalDayNames:rows.filter(r=>r.eligible&&!r.nonExercise).length,resolvedDayNames:rows.filter(r=>r.eligible&&!r.nonExercise&&r.filePairPresent).length,repairedDayNames:rows.filter(r=>r.repaired&&r.eligible).length,categories:Object.fromEntries([...new Set(rows.map(r=>r.category))].map(k=>[k,rows.filter(r=>r.category===k).length])),confirmedMissingSets:missing.length,confirmedMissingFiles:missing.length*2};
const result={stats,rows,missing,rejected:runtime.window.GYM_COMPANION_ABAC_ARTWORK.rejected,aliases:runtime.window.GYM_COMPANION_ABAC_ARTWORK.aliases,originalHashes,cases:current.cases};
if(process.argv.includes('--summary'))console.log(JSON.stringify({stats,missing,rejected:result.rejected}));
else if(process.argv.includes('--hashes'))console.log(JSON.stringify(originalHashes));
else if(process.argv.includes('--assets')) {
 const entries=new Map();
 for(const row of rows.filter(r=>r.eligible&&!r.nonExercise&&!r.reviewOnly&&r.filePairPresent))for(const phase of ['start','movement']) {
  const path=row.imageSet[phase],entry=entries.get(path)||{path,phase,movementIds:[],days:[],bytes:fs.statSync(path).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')};
  if(!entry.movementIds.includes(row.canonicalId))entry.movementIds.push(row.canonicalId);
  if(!entry.days.includes(row.day))entry.days.push(row.day);entries.set(path,entry);
 }
 const list=[...entries.values()].sort((a,b)=>a.path.localeCompare(b.path));
 console.log(JSON.stringify({version:'v541-active-assets-v2',source:'resolved eligible ABAC runtime, all days and tiers',entries:list,stats:{files:list.length,bytes:list.reduce((sum,e)=>sum+e.bytes,0),resolvedRuntimeCases:current.cases.length},exclusions:['non-exercises','unavailable optional choices','excluded equipment','pending/rejected pairs','historical snapshots','local reports and original PNG masters']}));
} else if(process.argv.includes('--decisions'))console.log(JSON.stringify({aliases:result.aliases,rejected:result.rejected,repaired:rows.filter(r=>r.repaired&&r.eligible),reviewType:'technical and AI-assisted semantic review; not qualified gym-coach approval'}));
else {
 const offset=Number(process.argv.find(a=>a.startsWith('--offset='))?.split('=')[1]||0);
 console.log(JSON.stringify({stats,missing,rejected:result.rejected,cases:result.cases,rows:rows.slice(offset,offset+50)}));
}

