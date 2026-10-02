import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true}),page=await browser.newPage();
const key='gym-companion-v5-demo-member-data';
try {
 await page.addInitScript(()=>{const NativeDate=Date,ms=new NativeDate('2026-08-31T12:00:00+05:30').getTime();class FixtureDate extends NativeDate{constructor(...args){super(...(args.length?args:[ms]));}static now(){return ms;}}window.Date=FixtureDate;});
 await page.goto('http://localhost:4175/?v=5.4.1-artwork-mapping-repair');
 await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
 await page.evaluate(key=>{const data=JSON.parse(localStorage.getItem(key));data.personal.preferences.tier='expert';data.sessions=[];localStorage.setItem(key,JSON.stringify(data));},key);await page.reload();await page.locator('[data-day="0"]').click();
 const choice=page.locator('[data-choice="0"][data-choice-index="0"]');await choice.click();
 const before=await page.locator('.workout-list').first().locator('.image-frame').first().getAttribute('data-image-path');assert.ok(before);
 // An isolated fixture emulates an old saved snapshot. Never touch the user's browser data.
 const snapshot=await page.evaluate(key=>{const data=JSON.parse(localStorage.getItem(key)),session=data.sessions.find(s=>s.day_index===0&&s.source_version!=='v5');session.plan_snapshot.slots[0].exercise.imageSet={start:'obsolete-start.webp',movement:'obsolete-movement.webp'};localStorage.setItem(key,JSON.stringify(data));return JSON.stringify(session.plan_snapshot);},key);
 await page.reload();await page.locator('[data-day="0"]').click();
 assert.equal(await page.locator('.workout-list').first().locator('.image-frame').first().getAttribute('data-image-path'),before);
 assert.equal(await page.evaluate(key=>JSON.stringify(JSON.parse(localStorage.getItem(key)).sessions.find(s=>s.day_index===0&&s.source_version!=='v5').plan_snapshot),key),snapshot);
 let testedOptional=false;
 for(let day=0;day<6&&!testedOptional;day++) {
  await page.locator('[data-screen="home"]').click();await page.locator('[data-day="'+day+'"]').click();await page.locator('.optional-addons-panel > summary').click();
  const add=page.locator('[data-add-extra]').first();if(!await add.count())continue;
  await page.screenshot({path:'.codex/v541/audit-repairs/artwork/evidence/pending-optional.png',fullPage:true});
  await add.click();await page.reload();await page.locator('[data-day="'+day+'"]').click();assert.equal(await page.locator('[data-remove-extra]').count(),1);
  await page.locator('[data-remove-extra]').click();await page.reload();await page.locator('[data-day="'+day+'"]').click();assert.equal(await page.locator('[data-remove-extra]').count(),0);testedOptional=true;
 }
 assert.equal(testedOptional,true,'No eligible optional fixture found');
 await page.locator('[data-screen="home"]').click();await page.locator('[data-day="2"]').click();
 const repaired=page.locator('article.exercise').filter({has:page.locator('h3', {hasText:'Dumbbell Romanian Deadlift'})}).first();
 const movement=await repaired.locator('.image-frame').getAttribute('data-image-path');await repaired.locator('.detail-button').click();
 assert.equal(await page.locator('.detail-steps .image-frame').nth(1).getAttribute('data-image-path'),movement);
 await page.screenshot({path:'.codex/v541/audit-repairs/artwork/evidence/repaired-rdl-detail.png',fullPage:true});
 console.log(JSON.stringify({status:'PASS',savedSnapshotImmutable:true,staleArtworkDisplayRepaired:true,optionalAddRemoveRefresh:true}));
} finally {await browser.close();}
