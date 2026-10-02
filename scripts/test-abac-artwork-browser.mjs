import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true}), runtime=artworkRuntime();
const errors=[],imageErrors=[],measurements=[];let cases=0,variationChecks=0,detailChecks=0;
const base='http://localhost:4175/?v=5.4.1-artwork-mapping-repair', evidence='.codex/v541/audit-repairs/artwork/evidence';
fs.mkdirSync(evidence,{recursive:true});
const phases=[['A','2026-10-05'],['B','2026-09-28'],['A','2026-09-21'],['C','2026-09-14']];
try {
 for(const [cycle,[week,anchor]]of phases.entries())for(const tier of ['beginner','intermediate','expert']) {
  const context=await browser.newContext({viewport:{width:390,height:844}}), page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/assets\/exercises/.test(r.url()))imageErrors.push(r.url());});
  const clockDate=new Date(runtime.periodized.anchorDate+'T12:00:00+05:30');clockDate.setDate(clockDate.getDate()+cycle*7);
  await page.addInitScript(ms=>{const NativeDate=Date;class FixtureDate extends NativeDate{constructor(...args){super(...(args.length?args:[ms]));}static now(){return ms;}}window.Date=FixtureDate;},clockDate.getTime());
  await page.goto(base);await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
  await page.evaluate(({anchor,tier})=>{const key='gym-companion-v5-demo-member-data', data=JSON.parse(localStorage.getItem(key));data.personal.preferences.rotation_anchor_date=anchor;data.personal.preferences.tier=tier;data.sessions=[];localStorage.setItem(key,JSON.stringify(data));},{anchor,tier});
  await page.reload();await page.locator('[data-day="0"]').waitFor();
  if(cycle===0&&tier==='intermediate'){await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));await page.screenshot({path:evidence+'/home-390.png',fullPage:true});}
  for(let day=0;day<6;day++) {
   runtime.currentDay=runtime.periodized.days.find(d=>d.dayIndex===day&&d.weekKey===week);runtime.state.dayIndex=day;runtime.state.preferences.tier=tier;
   const browserPhase=await page.evaluate(()=>{const p=window.GYM_COMPANION_PERIODIZED_ABC,a=new Date(p.anchorDate+'T00:00:00'),m=new Date();m.setHours(0,0,0,0);m.setDate(m.getDate()-((m.getDay()+6)%7));return p.cadence[((Math.floor((m-a)/86400000/7)%p.cadence.length)+p.cadence.length)%p.cadence.length];});
   runtime.currentDay=runtime.periodized.days.find(d=>d.dayIndex===day&&d.weekKey===browserPhase);
   const expected=runtime.periodizedPlan(day,new Date());
   await page.locator('[data-day="'+day+'"]').click();
   const cards=page.locator('.workout-list').first().locator('article.exercise');
   assert.equal(await cards.count(),6);
   for(let slot=0;slot<6;slot++)for(let choice=0;choice<3;choice++) {
    const item=[expected.member_plan_slots[slot].exercise,expected.member_plan_slots[slot].alternative,expected.member_plan_slots[slot].third][choice];if(!item)continue;
    const control=page.locator('[data-choice="'+slot+'"][data-choice-index="'+choice+'"]');if(await control.count())await control.click();
    const card=cards.nth(slot);
    await page.waitForFunction(({slot,name})=>document.querySelectorAll('.workout-list')[0]?.querySelectorAll('article.exercise')[slot]?.querySelector('h3')?.textContent===name,{slot,name:item.name},{timeout:5000}).catch(async error=>{throw new Error(JSON.stringify({week,browserPhase,tier,day,slot,choice,expected:item.name,actual:await card.locator('h3').innerText(),meta:await page.evaluate(()=>({date:new Date().toISOString(),prefs:JSON.parse(localStorage.getItem('gym-companion-v5-demo-member-data')).personal.preferences,sessions:JSON.parse(localStorage.getItem('gym-companion-v5-demo-member-data')).sessions.map(s=>({date:s.session_date,name:s.plan_snapshot?.slots?.[0]?.exercise?.name}))})),error:error.message}));});
    assert.equal(await card.locator('h3').innerText(),item.name);
    assert.equal(await card.locator('.image-frame').first().getAttribute('data-image-path'),item.imageSet?.movement||'',week+'/'+tier+'/'+day+'/'+item.name);
    variationChecks++;
    if(cycle===0&&tier==='intermediate'&&slot===0&&choice===0) {
     await card.locator('.detail-button').click();
     const images=page.locator('.detail-steps .image-frame');
     assert.equal(await images.count(),2);
     assert.equal(await images.nth(0).getAttribute('data-image-path'),item.imageSet?.start||'');
     assert.equal(await images.nth(1).getAttribute('data-image-path'),item.imageSet?.movement||'');
     if(day===2)await page.screenshot({path:evidence+'/wednesday-detail-390.png',fullPage:true});
     await page.locator('[data-close-detail]').click();detailChecks++;
    }
   }
   if(cycle===0&&tier==='intermediate') {
    // Return each slot to Main before capturing the workout.
    for(let slot=0;slot<6;slot++){const control=page.locator('[data-choice="'+slot+'"][data-choice-index="0"]');if(await control.count())await control.click();}
    for(const width of [320,390,430]) {
     await page.setViewportSize({width,height:844});
     const size=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
     assert.ok(size.scroll<=width);measurements.push({day,width,...size});
    }
    await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
    await page.screenshot({path:evidence+'/day-'+day+'-390.png',fullPage:true});
   }
   await page.locator('[data-screen="home"]').click();cases++;
  }
  await context.close();
 }
 // Verify delivery and decode of every active file, not only lazy-loaded visible cards.
 const page=await browser.newPage();await page.goto(base);
 const entries=JSON.parse(fs.readFileSync('.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json','utf8')).entries;
 const decoded=await page.evaluate(async paths=>{for(const path of paths){const img=new Image();img.src='/'+path;await img.decode();if(img.naturalWidth!==512||img.naturalHeight!==512)throw new Error('Bad dimensions: '+path);}return paths.length;},entries.map(e=>e.path));
 await page.close();
 assert.deepEqual(errors,[]);assert.deepEqual(imageErrors,[]);
 console.log(JSON.stringify({status:'PASS',cases,variationChecks,detailChecks,decodedActiveFiles:decoded,pageErrors:errors,imageErrors,measurements}));
} finally {await browser.close();}
