// Deterministic member-only static output. PNG masters/review assets stay local.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=process.cwd(), output=path.join(root,'public');
const manifest=JSON.parse(execFileSync(process.execPath,['scripts/build-v541-active-asset-manifest.mjs','--json'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const scriptFiles=[...fs.readFileSync('index.html','utf8').matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
const fixed=['index.html','styles.css','bootstrap.js','member-app.js','demo-mode.js','local-preview.js','assets/fitness7-hero-logo.png',...scriptFiles];
const active=new Map(manifest.entries.map(e=>[e.path,e]));
const files=[...new Set([...fixed,...active.keys()])].sort();
let bytes=0;
for(const file of files) {
 if(path.isAbsolute(file)||file.split('/').includes('..'))throw new Error('Unsafe deployment path: '+file);
 const data=fs.readFileSync(file);bytes+=data.length;
 if(active.has(file)&&crypto.createHash('sha256').update(data).digest('hex')!==active.get(file).sha256)throw new Error('Asset hash changed: '+file);
 if(/\.(?:js|html)$/.test(file)&&/SUPABASE_SERVICE_ROLE_KEY/.test(data.toString()))throw new Error('Privileged key reference: '+file);
}
if(bytes>95*1024*1024||files.length>15000)throw new Error('Member artifact exceeds deployment gate');
// Do not delete arbitrary existing files. A stale/unmanaged output fails instead.
function walk(dir) {return fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(output,path.join(dir,e.name))]):[];}
for(const file of walk(output))if(!files.includes(file))throw new Error('Unmanaged/stale public output: '+file);
for(const file of files) {
 const destination=path.join(output,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(file,destination);
}
console.log(JSON.stringify({status:'PASS',staticFiles:files.length,staticBytes:bytes,staticMiB:Number((bytes/1024/1024).toFixed(2)),artworkFiles:active.size,artworkBytes:manifest.stats.bytes,excluded:'reports, secrets, backups, historical/review-only artwork and admin screens'}));
