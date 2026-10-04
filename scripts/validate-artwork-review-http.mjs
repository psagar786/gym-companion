import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const origin='http://127.0.0.1:4176';
const config=await fetch(origin+'/api/config').then(r=>{assert.equal(r.status,200);return r.json();});
assert.equal(config.appMode,'member');assert.equal(config.demoMode,true);
assert.equal(config.supabaseUrl,'');assert.equal(config.supabaseAnonKey,'');
// Server/API and byte-integrity checks only; this is not browser/visual QA.
for(const path of ['/','/artwork-review.html','/data/abac-artwork-review.js','/data/artwork-review-gallery.json']){
 const r=await fetch(origin+path);assert.equal(r.status,200,path);assert.ok((await r.arrayBuffer()).byteLength>0);
}
const runtime=inventory(artworkRuntime({review:true}));
const paths=[...new Set(runtime.occurrences.filter(o=>o.eligible&&!o.nonExercise&&o.filePairPresent).flatMap(o=>Object.values(o.imageSet)))];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(let i=0;i<paths.length;i+=8)await Promise.all(paths.slice(i,i+8).map(async path=>{
 const r=await fetch(origin+'/'+path);assert.equal(r.status,200,path);
 assert.equal(sha(Buffer.from(await r.arrayBuffer())),sha(fs.readFileSync(path)),path+' served different bytes');
}));
const report={status:'PASS',origin,appMode:'member',demoMode:true,servedActiveImages:paths.length,
 allImageBytesMatchSource:true,browserVisualVerification:'blocked-by-browser-url-security-policy',productionChanged:false};
fs.writeFileSync('.codex/v541/artwork-completion-review/LOCAL-SERVER-VALIDATION.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
