import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const base='http://localhost:4175/?v=5.4.1-focus-correction';
const expected=['Chest + back','Core','Legs + glutes','Upper body','Core','Glutes + hamstrings + back'];
try {
 await page.goto(base);await page.locator('input[name="username"]').fill('sagar.paperwala003.member');
 await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();
 await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
 for(let i=0;i<6;i++) assert.ok((await page.locator('[data-day="'+i+'"]').innerText()).includes(expected[i]));
 const dir='.codex/v541/audit-repairs/evidence';fs.mkdirSync(dir,{recursive:true});
 await page.evaluate(()=>document.getAnimations().forEach(animation=>animation.finish()));
 await page.screenshot({path:dir+'/home-390.png',fullPage:true});
 const dimensions=[];
 for(const width of [320,390,430]) {
  await page.setViewportSize({width,height:844});
  for(let day=0;day<6;day++) {
   await page.locator('[data-day="'+day+'"]').click();
   assert.equal(await page.locator('.detail-head h1').innerText(),expected[day]);
   const size=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.viewport,'overflow '+width+'/'+day+': '+JSON.stringify(size));
   dimensions.push({width,day,...size});
   if(width===390&&day===0) { await page.evaluate(()=>document.getAnimations().forEach(animation=>animation.finish()));await page.screenshot({path:dir+'/monday-390.png',fullPage:true}); }
   await page.locator('[data-screen="home"]').click();
  }
 }
 await page.locator('[data-day="0"]').click();
 const done=page.locator('input[data-check="slots"]').first();await done.locator('..').click();
 const choice=page.locator('[data-choice="0"][data-choice-index="1"]');
 if(await choice.count()) await choice.click();
 await page.reload();await page.locator('[data-day="0"]').waitFor();await page.locator('[data-day="0"]').click();
 assert.equal(await page.locator('input[data-check="slots"]').first().isChecked(),true);
 if(await choice.count()) assert.equal(await choice.getAttribute('aria-pressed'),'true');
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({status:'PASS',responsive:dimensions,completionAndVariationPersistence:true,pageErrors:errors}));
} finally { await browser.close(); }
