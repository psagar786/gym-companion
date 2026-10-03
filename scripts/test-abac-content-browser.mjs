import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true}),errors=[],imageErrors=[],results=[];
const dir='.codex/v541/audit-repairs/content/evidence';fs.mkdirSync(dir,{recursive:true});
async function decodedDetails(page) {
 const images=page.locator('.detail-steps img');
 for(let index=0;index<await images.count();index++){const image=images.nth(index);await image.scrollIntoViewIfNeeded();await image.evaluate(async n=>{await n.decode();if(n.naturalWidth!==512||n.naturalHeight!==512)throw Error('Incorrect image dimensions');});}
 await page.evaluate(()=>scrollTo(0,0));
}
try {
 for(const width of [320,390,430]) {
  const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(/\.(webp|png)(?:\?|$)/.test(r.url())&&r.status()>=400)imageErrors.push(r.url());});
  await page.addInitScript(()=>{const D=Date,ms=new D('2026-08-31T12:00:00+05:30').getTime();window.Date=class extends D{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}};});
  await page.goto('http://localhost:4175/?v=5.4.1-content-correction');
  await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
  for(let day=0;day<6;day++) {
   await page.locator('[data-day="'+day+'"]').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const card=page.locator('.workout-list').first().locator('article.exercise').first();
   const title=await card.locator('h3').innerText(),dose=await card.locator('.exercise-dose').innerText();assert.ok(dose.trim());
   if(day===0)assert.match(dose,/4 sets × 10–12 reps/);
   await card.locator('.detail-button').click();assert.equal(await page.locator('.detail-hero h1').innerText(),title);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('.detail-step').count(),2);
   await decodedDetails(page);
   const instructions=await page.locator('.detail-step p').allTextContents();assert.ok(instructions.every(s=>s.length>15));assert.ok(instructions.every(s=>!/stable starting position for|clear working position for|mark unknown/i.test(s)));
   if(day===0){assert.match(instructions[0],/30/);assert.match(instructions[1],/press/i);assert.equal(await page.locator('.dose-card').innerText().then(t=>/75 sec/.test(t)),true);}
   await page.locator('[data-close-detail]').click();
   if(width===390&&day===2) {
    const curl=page.locator('.workout-list').first().locator('article.exercise').filter({has:page.locator('h3',{hasText:/^Lying Leg Curl$/})});
    await curl.locator('.detail-button').click();assert.match((await page.locator('.detail-step p').allTextContents()).join(' '),/under review/i);assert.ok(!/elbow flexors|curl without rocking/.test(await page.locator('main').innerText()));await decodedDetails(page);await page.screenshot({path:dir+'/lying-curl-conflict-390.png',fullPage:true});await page.locator('[data-close-detail]').click();
   }
   if(width===390&&day===5) {
    const row=page.locator('.workout-list').first().locator('article.exercise').nth(2),alt=row.locator('[data-choice-index="1"]');
    if(await alt.count()) {await alt.click();await row.locator('.detail-button').click();await decodedDetails(page);await page.screenshot({path:dir+'/alternative-detail-390.png',fullPage:true});await page.locator('[data-close-detail]').click();}
   }
   results.push({width,day,title,dose,overflow:false});await page.locator('[data-screen="home"]').click();
  }
  if(width===390)await page.screenshot({path:dir+'/home-390.png'});
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(imageErrors,[]);console.log(JSON.stringify({status:'PASS',dayWidthChecks:results.length,results,pageErrors:errors,imageRequestErrors:imageErrors}));
} finally {await browser.close();}
