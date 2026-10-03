import fs from 'node:fs';
import crypto from 'node:crypto';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
// Traverse actual selectable runtime, not all completed registry records.
const root=fileURLToPath(new URL('../',import.meta.url));
// Release builds must not depend on excluded local audit/baseline reports.
const runtime=inventory(artworkRuntime()), assets=new Map();
for(const row of runtime.rows.filter(r=>r.eligible&&!r.nonExercise&&!r.reviewOnly&&r.filePairPresent))for(const phase of ['start','movement']) {
 const assetPath=row.imageSet[phase], bytes=fs.readFileSync(path.join(root,assetPath));
 const entry=assets.get(assetPath)||{path:assetPath,phase,movementIds:[],days:[],bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
 if(!entry.movementIds.includes(row.canonicalId))entry.movementIds.push(row.canonicalId);
 if(!entry.days.includes(row.day))entry.days.push(row.day);
 assets.set(assetPath,entry);
}
const entries=[...assets.values()].sort((a,b)=>a.path.localeCompare(b.path));
const output={version:'v541-active-assets-v2',source:'resolved eligible ABAC runtime, all days and tiers',entries,stats:{files:entries.length,bytes:entries.reduce((sum,e)=>sum+e.bytes,0),resolvedRuntimeCases:runtime.cases.length},exclusions:['non-exercises','unavailable optional choices','excluded equipment','pending/rejected pairs','historical snapshots','local reports and original PNG masters']};
if(process.argv.includes('--json'))console.log(JSON.stringify(output));
else {
 fs.writeFileSync(path.join(root,'.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json'),JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(output.stats,null,2));
}
