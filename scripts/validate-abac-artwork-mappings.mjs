import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const c=artworkRuntime(), result=inventory(c), api=c.window.GYM_COMPANION_ABAC_ARTWORK;
const baseline=JSON.parse(fs.readFileSync('.codex/v541/audit-repairs/artwork/BASELINE-INVENTORY.json','utf8'));
assert.equal(result.cases.length,72);for(const entry of result.cases)assert.equal(entry.mainSlots,6);
const old=new Map(baseline.rows.map(r=>[r.day+'|'+r.name,r]));
const repaired=result.rows.filter(r=>r.eligible&&r.filePairPresent&&!old.get(r.day+'|'+r.name)?.filePairPresent);
assert.equal(repaired.length,12);
function dimensions(b) {
 assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
 const type=b.toString('ascii',12,16);
 if(type==='VP8X')return [1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];
 if(type==='VP8L'){const bits=b.readUIntLE(21,4);return [1+(bits&0x3fff),1+((bits>>14)&0x3fff)];}
 if(type==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];
 throw new Error('Unsupported WebP chunk');
}
const files=new Map();
for(const row of result.rows.filter(r=>r.eligible&&r.filePairPresent&&!r.nonExercise)) {
 assert.notEqual(row.imageSet.start,row.imageSet.movement);
 const hashes=[];
 for(const path of [row.imageSet.start,row.imageSet.movement]) {
  const b=fs.readFileSync(path),hash=crypto.createHash('sha256').update(b).digest('hex');
  assert.deepEqual(dimensions(b),[512,512],path);files.set(path,hash);hashes.push(hash);
 }
 assert.notEqual(hashes[0],hashes[1],row.name);
 assert.equal(c.previewImage({imageSet:row.imageSet}),row.imageSet.movement);
}
for(const [path,hash]of Object.entries(JSON.parse(fs.readFileSync('.codex/v541/audit-repairs/artwork/ORIGINAL-ASSET-HASHES.json','utf8'))))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),hash,path);
for(let day=0;day<6;day++) for(const name of ['Cable Standing Abduction','Ab Wheel Rollout','Captain\'s Chair Leg Raise','Band Pull-Apart']) {
 const r=api.resolve({name,id:'irrelevant'},day);assert.equal(r.reviewOnly,true);assert.equal(Object.keys(r.imageSet).length,0);
}
for(const name of api.combined){const r=api.resolve({name},0);assert.equal(r.mappingStatus,'combined-needs-content-decision');assert.equal(Object.keys(r.imageSet).length,0);}
assert.equal(api.resolve({name:'Incline Smith Machine Press 45°',stableMovementId:'periodized-incline-smith-machine-press-45'},3).artworkStatus,'pending');
assert.equal(api.resolve({name:'New unreviewed exercise'},0).artworkStatus,'pending');
assert.equal(api.resolve({name:'Intervals'},1).artworkStatus,'pending');
assert.ok(api.resolve({name:'Lying Pelvic-Tilt Leg Raise',stableMovementId:'biweekly-lying-pelvic-tilt-leg-raise'},1).imageSet.start.includes('periodized-v4'));
assert.ok(api.resolve({name:'Hanging Knee Tuck'},5).imageSet.start.includes('periodized-v4'));
const app=fs.readFileSync('member-app.js','utf8');
for(const name of ['phaseAsset','detailRecord']){const start=app.indexOf('function '+name+'(');vm.runInContext(app.slice(start,app.indexOf('\nfunction ',start+1)),c);}
assert.ok(c.detailRecord({name:'Pending movement',artworkStatus:'pending',imageSet:{}}).detailSteps.every(s=>!s.image));
assert.equal(c.previewImage({imageSet:{start:'unapproved-start.png'},image_path:'unrelated.png'}),'');
console.log(JSON.stringify({status:'PASS',runtimeCases:72,repairedDayNames:12,uniqueActiveFiles:files.size,assetHashesUnchanged:true,exclusions:true,pendingDoesNotFallback:true}));

