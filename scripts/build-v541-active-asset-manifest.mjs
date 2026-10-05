import fs from 'node:fs';
import crypto from 'node:crypto';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
// Traverse actual selectable runtime, not all completed registry records.
const root=fileURLToPath(new URL('../',import.meta.url));
// Release builds must not depend on excluded local audit/baseline reports.
const review=fs.existsSync(path.join(root,'data/abac-artwork-review.js'))&&fs.readFileSync(path.join(root,'index.html'),'utf8').includes('data/abac-artwork-review.js');
const runtime=inventory(artworkRuntime({review})), assets=new Map();
// Traverse occurrences, not deduplicated labels: tiers and compound components
// can legitimately require different phase files for the same displayed name.
for(const row of runtime.occurrences.filter(r=>r.eligible&&!r.nonExercise)) {
 if(row.artworkStatus!=='complete'||!row.filePairPresent) {
  if(review)throw new Error('Unresolved selectable artwork: '+[row.day,row.week,row.tier,row.name].join('/'));
  continue;
 }
 const components=row.artworkComponents?.length?row.artworkComponents:[row];
 for(const component of components)for(const phase of ['start','movement']) {
  const assetPath=component.imageSet[phase], bytes=fs.readFileSync(path.join(root,assetPath));
  const entry=assets.get(assetPath)||{path:assetPath,phase,movementIds:[],days:[],bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
  const movementId=component.canonicalMovementId||component.stableMovementId||row.canonicalMovementId||row.stableMovementId;
  if(movementId&&!entry.movementIds.includes(movementId))entry.movementIds.push(movementId);
  if(!entry.days.includes(row.day))entry.days.push(row.day);
  assets.set(assetPath,entry);
 }
}
const entries=[...assets.values()].sort((a,b)=>a.path.localeCompare(b.path));
const output={version:'v541-active-assets-v3',source:'resolved eligible ABAC runtime, all days, tiers and compound components',reviewOverlay:review,entries,stats:{files:entries.length,bytes:entries.reduce((sum,e)=>sum+e.bytes,0),resolvedRuntimeCases:runtime.cases.length},exclusions:['non-exercises','unavailable optional choices','excluded equipment','pending/rejected pairs','historical snapshots','local reports and original PNG masters']};
if(process.argv.includes('--json'))console.log(JSON.stringify(output));
else {
 fs.writeFileSync(path.join(root,'.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json'),JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(output.stats,null,2));
}
