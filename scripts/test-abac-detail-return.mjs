import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const browser=await chromium.launch({headless:true});let checks=0;const results=[],errors=[];
const dir='.codex/v541/audit-repairs/navigation/evidence';fs.mkdirSync(dir,{recursive:true});
async function viewState(page) {
 return page.evaluate(()=>({y:scrollY,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,
  nested:[...document.querySelectorAll('.guided-scroll')].map(n=>n.scrollTop),
  disclosures:[...document.querySelectorAll('details')].map(n=>n.open),
  checks:[...document.querySelectorAll('input[data-check]')].map(n=>n.checked),
  choices:[...document.querySelectorAll('.choice')].map(n=>n.getAttribute('aria-pressed')),
  storage:localStorage.getItem('gym-companion-v5-demo-member-data')}));
}
async function roundTrip(page,button,{native=false,resize=false,label=''}={}) {
 const id='return-'+checks;await button.scrollIntoViewIfNeeded();await button.evaluate((node,id)=>node.setAttribute('data-return-probe',id),id);
 const before=await viewState(page),top=await button.evaluate(n=>n.getBoundingClientRect().top);
 await button.click();await page.locator('[data-close-detail]').waitFor();
 assert.equal(await page.evaluate(()=>scrollY),0,'Details should open at top');
 if(resize)await page.setViewportSize({width:430,height:844});
 await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
 if(native)await page.goBack();else await page.locator('[data-close-detail]').click();
 await page.locator('[data-return-probe="'+id+'"]').waitFor();await page.evaluate(()=>new Promise(requestAnimationFrame));
 const after=await viewState(page);
 if(!resize)assert.ok(Math.abs(after.y-before.y)<=2,'Page scroll not restored: '+label+' '+JSON.stringify({before:before.y,after:after.y}));
 assert.deepEqual(after.nested,before.nested);assert.deepEqual(after.disclosures,before.disclosures);assert.deepEqual(after.checks,before.checks);assert.deepEqual(after.choices,before.choices);assert.equal(after.storage,before.storage);
 assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-return-probe')),id);assert.equal(after.overflow,false);
 const restored=await page.locator('[data-return-probe="'+id+'"]').evaluate(n=>n.getBoundingClientRect().top);assert.ok(Math.abs(restored-top)<20,'Origin control moved off its prior viewport position');
 results.push({label,width:before.width,native,resize,beforeY:before.y,afterY:after.y});checks++;
}
try {
 for(const width of [320,390,430]) {
  const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const D=Date,ms=new D('2026-08-31T12:00:00+05:30').getTime();window.Date=class extends D{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}};});
  await page.goto('http://localhost:4175/?v=5.4.1-detail-return');await page.locator('input[name="username"]').fill('sagar.paperwala003.member');await page.locator('input[name="password"]').fill('1234');await page.locator('input[name="remember"]').check();await page.locator('#sign-in button').click();await page.locator('[data-day="0"]').waitFor();
  await page.evaluate(()=>{const key='gym-companion-v5-demo-member-data',d=JSON.parse(localStorage.getItem(key));d.personal.preferences.tier='expert';d.sessions=[];localStorage.setItem(key,JSON.stringify(d));});await page.reload();
  for(let day=0;day<6;day++) {
   await page.locator('[data-day="'+day+'"]').click();
   const card=page.locator('.workout-list').first().locator('article.exercise').nth(4),choice=card.locator('[data-choice-index="1"]');if(await choice.count()){await choice.click();await choice.waitFor();}
   await card.locator('label.card-done').click();await page.locator('.outlook-card > summary').click();
   await roundTrip(page,card.locator('.detail-button'),{label:'main-'+day,native:day%2===1});
   await roundTrip(page,card.locator('.visual-button'),{label:'repeat-image-'+day});
   const scroll=page.locator('.guided-required .guided-scroll').first();await scroll.evaluate(n=>n.scrollTop=n.scrollHeight);
   const guided=scroll.locator('.detail-button').last();await roundTrip(page,guided,{label:'guided-'+day,native:true});
   await page.locator('[data-screen="home"]').click();
  }
  await page.locator('[data-day="2"]').click();await page.locator('.guided-tendon > summary').click();await roundTrip(page,page.locator('.guided-tendon .detail-button').first(),{label:'tendon'});
  await page.locator('.optional-addons-panel > summary').click();const optional=page.locator('.optional-picker .detail-button').first();assert.ok(await optional.count());await roundTrip(page,optional,{label:'optional'});
  await page.locator('[data-screen="plan"]').click();const planDetail=page.locator('.extra-option .detail-button').first();await roundTrip(page,planDetail,{label:'my-plan',native:true});assert.ok(await page.locator('#training-preferences').count());
  await page.locator('[data-screen="home"]').click();await page.locator('[data-day="3"]').click();
  const last=page.locator('.workout-list').first().locator('article.exercise').last().locator('.detail-button');
  if(width===390){await roundTrip(page,last,{label:'resize',resize:true});await page.screenshot({path:dir+'/returned-to-exercise-430.png'});}
  // Navigate away from details: the old return context must not hijack a later screen.
  await last.click();await page.locator('[data-screen="plan"]').click();await page.goBack();assert.ok(await page.locator('#training-preferences').count());
  await page.reload();await page.locator('[data-day="0"]').waitFor();assert.equal(await page.locator('[data-close-detail]').count(),0);
  await context.close();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'PASS',checks,results,pageErrors:errors,storageUnchanged:true,originFocusRestored:true,disclosuresAndNestedScrollPreserved:true,refreshAndNavigationAwaySafe:true}));
}finally{await browser.close();}
