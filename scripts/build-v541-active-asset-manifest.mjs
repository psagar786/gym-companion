import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
// Traverse actual selectable runtime, not all completed registry records.
const root=fileURLToPath(new URL('../',import.meta.url));
const output=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-abac-artwork-mappings.mjs'),'--assets'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
if(process.argv.includes('--json'))console.log(JSON.stringify(output));
else {
 fs.writeFileSync(path.join(root,'.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json'),JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify(output.stats,null,2));
}
