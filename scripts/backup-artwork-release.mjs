import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const root=process.cwd();
assert.equal(path.basename(root),'gym-companion-v541-artwork-review');
const parent='/Users/exxxy/Documents/Daily AI Help/fitness7-backups';
fs.mkdirSync(parent,{recursive:true});
const destination=fs.mkdtempSync(path.join(parent,'v5.4.1-artwork-completion-2026-10-05-'));
const excluded=new Set(['.git','node_modules','public','.vercel']);
function walk(dir,prefix='') {
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const relative=path.join(prefix,e.name);
  if(excluded.has(e.name)||e.name.startsWith('.env'))return [];
  if(e.isSymbolicLink())throw new Error('Unexpected source symlink: '+relative);
  return e.isDirectory()?walk(path.join(dir,e.name),relative):[relative];
 });
}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files=walk(root).sort().map(file=>({path:file,bytes:fs.statSync(path.join(root,file)).size,sha256:hash(path.join(root,file))}));
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
execFileSync('git',['bundle','create',path.join(destination,'history.bundle'),'HEAD','--branches','--tags']);
execFileSync('tar',['-czf',path.join(destination,'checkout.tar.gz'),'--exclude=.git','--exclude=node_modules','--exclude=public','--exclude=.vercel','--exclude=.env*','-C',root,'.']);
const restored=path.join(destination,'restore-test');fs.mkdirSync(restored);
execFileSync('tar',['-xzf',path.join(destination,'checkout.tar.gz'),'-C',restored]);
for(const file of files)assert.equal(hash(path.join(restored,file.path)),file.sha256,file.path+' failed backup restore');
execFileSync('git',['bundle','verify',path.join(destination,'history.bundle')],{stdio:'pipe'});
const report={date:new Date().toISOString(),sourceWorkspace:root,sourceCommit:sha,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),backupPath:destination,
 sourceFiles:files.length,sourceBytes:files.reduce((sum,f)=>sum+f.bytes,0),archiveSha256:hash(path.join(destination,'checkout.tar.gz')),gitBundleSha256:hash(path.join(destination,'history.bundle')),restoreVerification:'PASS-all-file-hashes-and-git-bundle',excluded:'rebuildable public output, node_modules, credentials and worktree pointer',files};
fs.writeFileSync(path.join(destination,'SHA256-MANIFEST.json'),JSON.stringify(report,null,2)+'\n');
const checkpoint=path.join(root,'.codex/v541/artwork-completion-review/deployment');fs.mkdirSync(checkpoint,{recursive:true});
fs.writeFileSync(path.join(checkpoint,'BACKUP-MANIFEST.json'),JSON.stringify({...report,files:undefined},null,2)+'\n');
console.log(JSON.stringify({...report,files:undefined},null,2));
