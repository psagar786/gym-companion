// Read-only HTTP verification of the exact published member artifact.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const origin=process.argv[2];
assert.ok(origin&&new URL(origin).protocol==='https:','Specify the verified HTTPS deployment URL');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const get=async file=>{const response=await fetch(new URL(file,origin),{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,file+' HTTP '+response.status);return Buffer.from(await response.arrayBuffer());};
const config=JSON.parse((await get('/api/config')).toString());
assert.equal(config.appMode,'member');assert.equal(config.demoMode,true);
assert.ok(!('serviceRoleKey' in config)&&!('SUPABASE_SERVICE_ROLE_KEY' in config));
const manifest=JSON.parse(execFileSync(process.execPath,['scripts/build-v541-active-asset-manifest.mjs','--json'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const index=(await get('/')).toString();
const acceptedIndex=fs.readFileSync('index.html','utf8');
// Vercel appends its known preview-feedback script outside the accepted HTML.
// Require exact source bytes plus only this narrowly identified platform suffix.
assert.ok(index.startsWith(acceptedIndex),'Published index differs from accepted build');
const platformSuffix=index.slice(acceptedIndex.length);
assert.ok(!platformSuffix||/^<script async data-explicit-opt-in="true" data-deployment-id="dpl_[A-Za-z0-9]+" src="https:\/\/vercel\.live\/_next-live\/feedback\/feedback\.js"><\/script>$/.test(platformSuffix),'Unexpected modification to accepted HTML');
const scripts=[...acceptedIndex.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
const appFiles=[...new Set(['member-app.js','styles.css','bootstrap.js','demo-mode.js',...scripts])];
for(const file of appFiles)assert.equal(sha(await get('/'+file)),sha(fs.readFileSync(file)),file+' differs from accepted source');
for(let i=0;i<manifest.entries.length;i+=8)await Promise.all(manifest.entries.slice(i,i+8).map(async entry=>assert.equal(sha(await get('/'+entry.path)),entry.sha256,entry.path+' deployed hash mismatch')));
for(const file of ['admin.html','.env','.codex/v541/artwork-completion-review/STATE.json']){
 const response=await fetch(new URL('/'+file,origin),{signal:AbortSignal.timeout(30000)});
 assert.ok([403,404].includes(response.status),'Private/member-inappropriate file publicly reachable: '+file);
}
const privileged=await fetch(new URL('/api/admin',origin),{signal:AbortSignal.timeout(30000)});
assert.ok([403,404,405].includes(privileged.status),'Privileged API accessible');
const report={status:'PASS',date:new Date().toISOString(),origin,appMode:config.appMode,demoMode:config.demoMode,activeImages:manifest.entries.length,allActiveImageHashesMatch:true,applicationFiles:appFiles.length,applicationHashesMatch:true,vercelPreviewToolbarAppended:!!platformSuffix,memberBoundaryPass:true,supabaseConfigured:!!config.supabaseUrl,qualifiedCoachReview:'pending',physicalIphoneSafari:'not-tested'};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
