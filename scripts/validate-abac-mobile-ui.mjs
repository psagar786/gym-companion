import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';

// Scope guard: the only application-JS edit adds semantics to a scroll region.
// All data, persistence, detail-return and artwork behavior must remain intact.
const baseline='4f9b337';
const read=p=>fs.readFileSync(p,'utf8');
const previous=p=>execFileSync('git',['show',baseline+':'+p],{encoding:'utf8'});
const app=read('member-app.js');
assert.equal(app.replace(' role="region" aria-label="${escapeHtml(title)} exercises" tabindex="0"',''),previous('member-app.js'));
let protectedFiles=0;
for(const entry of execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',baseline,'data','assets','lib','api'],{encoding:'utf8'}).trim().split('\n')) {
 const split=entry.indexOf(' '),expected=entry.slice(0,split),file=entry.slice(split+1),bytes=fs.readFileSync(file);
 const actual=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(actual,expected,'Protected file changed: '+file);protectedFiles++;
}
const html=read('index.html');
assert.ok(html.includes('viewport-fit=cover'));
assert.ok(!/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(html),'Zoom must stay available');
assert.ok(html.includes('<body class="member-app">'));
const css=read('styles.css');
for(const rule of [
 '.member-app .exercise>.exercise-copy,.member-app .guided-panel .exercise>.exercise-copy{padding-right:0}',
 '.member-app .exercise-copy>.card-done{position:static;float:right;',
 '.member-app .avatar,.member-app .icon-btn{min-width:44px;min-height:44px;',
 '.member-app .dose-card{grid-template-columns:repeat(3,minmax(0,1fr));',
 '.member-app .card-done:has(input:focus-visible)',
 'env(safe-area-inset-top,0px)', 'env(safe-area-inset-bottom,0px)',
 'scrollbar-gutter:stable', ':root{--exercise-thumb:128px}'
]) assert.ok(css.includes(rule),'Missing mobile safeguard: '+rule);
for(const file of ['coach-app.js','admin-app.js','coach.html','admin.html']) {
 if(fs.existsSync(file))assert.equal(read(file),previous(file));
}
console.log(JSON.stringify({status:'PASS',baseline,protectedFiles,onlyAppChange:'labelled keyboard-focusable guided scroll',workoutDataAndArtworkBytesUnchanged:true,persistenceAndReturnCodeUnchanged:true,zoomAllowed:true,memberScoped:true}));
