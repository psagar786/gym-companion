// Isolated demo-only verification. Auth headers never leave the Vercel origin.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {artworkRuntime}=await import(pathToFileURL(process.cwd()+'/scripts/abac-artwork-runtime.mjs'));
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const url=process.env.F7_LIVE_URL,host=new URL(url).host;
const cli=process.env.F7_VERCEL_CLI||'/Users/exxxy/.npm/_npx/4b692b59300d311f/node_modules/vercel/dist/vc.js';
const project=JSON.parse(execFileSync(process.execPath,[cli,'api','/v9/projects/fitness7-gym-companion-member','--scope','sagar-pm'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));
assert.equal(project.id,'prj_qbY8V7wbd6Ml53sBKmfwfBGI5buQ');
const bypass=Object.entries(project.protectionBypass||{}).find(([,v])=>v.scope==='automation-bypass')?.[0];
const auth=bypass?{'x-vercel-protection-bypass':bypass}:{};
const browser=await chromium.launch({headless:true}),errors=[],failures=[],weeks=new Set();
let cases=0,variations=0,details=0;
const runtime=artworkRuntime(),manifest=JSON.parse(fs.readFileSync('.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json'));
const context=await browser.newContext({viewport:{width:390,height:844}});
const authorize=ctx=>ctx.route('https://'+host+'/**',r=>r.continue({headers:{...r.request().headers(),...auth}}));
await authorize(context);
const get=p=>context.request.get(url+'/'+p,{headers:auth});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
try {
 const conf=await get('api/config');assert.equal(conf.status(),200);const config=await conf.json();assert.equal(config.appMode,'member');assert.equal(config.demoMode,true);
 const sourceFiles=['index.html','styles.css','bootstrap.js','member-app.js','demo-mode.js',...new Set([...fs.readFileSync('index.html','utf8').matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1].split('?')[0]))];
 for(const p of sourceFiles){const r=await get(p);assert.equal(r.status(),200,p);assert.equal(hash(await r.body()),hash(fs.readFileSync(p)),p+' differs from accepted local source');}
 for(let i=0;i<manifest.entries.length;i+=12)await Promise.all(manifest.entries.slice(i,i+12).map(async e=>{const r=await get(e.path);assert.equal(r.status(),200,e.path);assert.equal(hash(await r.body()),e.sha256,e.path+' bytes differ');}));
 for(const p of ['admin.html','admin-app.js','.codex/v541/audit-repairs/STATE.json','.env.local'])assert.equal((await get(p)).status(),404,p+' must not be publicly served');
 // The existing admin handler deliberately returns 404 in member mode.
 assert.equal((await get('api/admin')).status(),404,'Member mode must hide the admin API');
 for(let cycle=0;cycle<4;cycle++)for(const tier of ['beginner','intermediate','expert']) {
  const ctx=await browser.newContext({viewport:{width:390,height:844}});await authorize(ctx);const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/exercises/'))failures.push({path:new URL(r.url()).pathname,status:r.status()});});
  const fixed=new Date(runtime.periodized.anchorDate+'T12:00:00+05:30');fixed.setDate(fixed.getDate()+cycle*7);
  await page.addInitScript(ms=>{const N=Date;class D extends N{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}}window.Date=D;},fixed.getTime());
  await page.goto(url);await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
  await page.evaluate(tier=>{const k='gym-companion-v5-demo-member-data',d=JSON.parse(localStorage.getItem(k));d.personal.preferences.tier=tier;d.sessions=[];localStorage.setItem(k,JSON.stringify(d));},tier);
  await page.reload();await page.locator('[data-day="0"]').waitFor();
  for(let day=0;day<6;day++) {
   const week=await page.evaluate(()=>{const p=window.GYM_COMPANION_PERIODIZED_ABC,a=new Date(p.anchorDate+'T00:00:00'),m=new Date();m.setHours(0,0,0,0);m.setDate(m.getDate()-((m.getDay()+6)%7));return p.cadence[((Math.floor((m-a)/86400000/7)%p.cadence.length)+p.cadence.length)%p.cadence.length];});
   assert.equal(week,runtime.periodized.cadence[cycle]);weeks.add(week);
   runtime.currentDay=runtime.periodized.days.find(d=>d.dayIndex===day&&d.weekKey===week);runtime.state.dayIndex=day;runtime.state.preferences.tier=tier;const plan=runtime.periodizedPlan(day,new Date());
   await page.locator('[data-day="'+day+'"]').click();const cards=page.locator('.workout-list').first().locator('article.exercise');assert.equal(await cards.count(),6);
   for(let slot=0;slot<6;slot++)for(let choice=0;choice<3;choice++) {
    const item=[plan.member_plan_slots[slot].exercise,plan.member_plan_slots[slot].alternative,plan.member_plan_slots[slot].third][choice];if(!item)continue;
    const button=page.locator('[data-choice="'+slot+'"][data-choice-index="'+choice+'"]');if(await button.count())await button.click();const card=cards.nth(slot);
    assert.equal(await card.locator('h3').innerText(),item.name);assert.equal(await card.locator('.image-frame').first().getAttribute('data-image-path'),item.imageSet?.movement||'');variations++;
    if(item.name==='Deficit Bulgarian Split Squat'&&tier==='intermediate') {
     const before=await page.evaluate(()=>scrollY);await card.locator('.detail-button').click();const images=page.locator('.detail-steps .image-frame');assert.equal(await images.nth(0).getAttribute('data-image-path'),item.imageSet.start);assert.equal(await images.nth(1).getAttribute('data-image-path'),item.imageSet.movement);
     await page.locator('[data-close-detail]').click();assert.equal(await page.evaluate(()=>scrollY),before);details++;
    }
   }
   if(cycle===0&&tier==='intermediate')for(const width of [320,390,430]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await page.setViewportSize({width:390,height:844});await page.locator('[data-screen="home"]').click();cases++;
  }
  if(cycle===0&&tier==='intermediate') {
   await page.locator('[data-day="0"]').click();await page.locator('.workout-list').first().locator('.card-done').first().click();assert.equal(await page.locator('.workout-list').first().locator('input[type="checkbox"]').first().isChecked(),true);await page.reload();await page.locator('[data-day="0"]').click();assert.equal(await page.locator('.workout-list').first().locator('input[type="checkbox"]').first().isChecked(),true);
  }
  await ctx.close();
 }
 assert.deepEqual([...weeks].sort(),['A','B','C']);assert.ok(details>0);
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 console.log(JSON.stringify({status:'PASS',target:process.env.F7_LIVE_LABEL,url,cases,phases:[...weeks],variationChecks:variations,restoredDetailReturnChecks:details,sourceFilesByteMatched:sourceFiles.length,assetFilesByteMatched:manifest.entries.length,memberConfig:true,adminScreensAbsent:true,adminApiHidden:true,privateFilesAbsent:true,mobileWidths:[320,390,430],rememberedDemoAndCompletionRefresh:true,pageErrors:errors,imageErrors:failures}));
} finally {await browser.close();}
