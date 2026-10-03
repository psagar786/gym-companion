import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:390,height:844}});let guided=0,optional=0;
try {
 await page.addInitScript(()=>{const D=Date,ms=new D('2026-08-31T12:00:00+05:30').getTime();window.Date=class extends D{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}};});
 await page.goto('http://localhost:4175/?v=5.4.1-detail-identity');await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
 await page.evaluate(()=>{const key='gym-companion-v5-demo-member-data',d=JSON.parse(localStorage.getItem(key));d.personal.preferences.tier='expert';d.sessions=[];localStorage.setItem(key,JSON.stringify(d));});await page.reload();
 for(let day=0;day<6;day++) {
  await page.locator('[data-day="'+day+'"]').click();
  const count=await page.locator('.guided-required .guided-scroll article').count();
  for(let index=0;index<count;index++) {
   const card=page.locator('.guided-required .guided-scroll article').nth(index),title=await card.locator('h3').innerText(),path=await card.locator('.image-frame').getAttribute('data-image-path');
   await card.locator('.detail-button').click();assert.equal(await page.locator('.detail-hero h1').innerText(),title);assert.equal(await page.locator('.detail-steps .image-frame').nth(1).getAttribute('data-image-path'),path);await page.locator('[data-close-detail]').click();guided++;
  }
  await page.locator('.optional-addons-panel > summary').click();
  const candidate=page.locator('.optional-picker .extra-option').first();
  if(await candidate.count()) {
   const title=await candidate.locator('b').first().innerText(),path=await candidate.locator('.image-frame').getAttribute('data-image-path');
   await candidate.locator('.detail-button').click();assert.equal(await page.locator('.detail-hero h1').innerText(),title);assert.equal(await page.locator('.detail-steps .image-frame').nth(1).getAttribute('data-image-path'),path);await page.locator('[data-close-detail]').click();optional++;
  }
  await page.locator('[data-screen="home"]').click();
 }
 assert.ok(guided>0&&optional>0);console.log(JSON.stringify({status:'PASS',guidedDetailChecks:guided,optionalDetailChecks:optional}));
}finally{await browser.close();}
