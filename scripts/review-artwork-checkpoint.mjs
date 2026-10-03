import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const require=createRequire(import.meta.url);
const sharp=require(process.env.F7_SHARP||'/Users/exxxy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir='.codex/v541/artwork-completion-review';
const specs=JSON.parse(fs.readFileSync(dir+'/SPECS.json','utf8'));
const read=f=>JSON.parse(fs.readFileSync(dir+'/'+f,'utf8'));
const save=(f,v)=>fs.writeFileSync(dir+'/'+f,JSON.stringify(v,null,2)+'\n');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const common='Use case: scientific-educational. Asset: Fitness 7 square mobile exercise guidance. Premium realistic 3D scientific illustration. One adult male athlete of realistic proportions, black training kit, off-white equipment. Minimal nearly black charcoal gym background (#181818), restrained floor contact, no clutter. Restrained orange primary muscles, muted blue secondary muscles, subtle grey-green stabilizers; anatomy emphasis must not hide joints or mechanics. Full athlete and all equipment, square 1:1, at least 10 percent clear margins on every side. No text, labels, logos, watermark, split view, collage, white background, unrelated equipment, distorted anatomy, cropped body or cropped apparatus. Final standalone PNG will be contain-resized to 512x512 without cropping/stretching.';
const prompt=(s,phase)=>`${common}\nExercise: ${s.name}. Phase: ${phase==='start'?'Start':'Movement'}.\nEquipment: ${s.equipment}.\nGrip and stance: ${s.grip}.\nCamera: ${s.camera}.\nPosition: ${s[phase]}.\nAnatomy: ${s.muscles}.\nMovement-specific exclusions: ${s.avoid}\n${phase==='start'?'Show only stable setup immediately before effort. No arrows or peak contraction.':'Use the accepted Start as identity reference; same athlete, kit, exact machine, camera, framing and lighting. Change only exercise joint/equipment positions to the specified working position. Do not repeat Start.'}`;
const [mode,id,phase,source,review]=process.argv.slice(2);
if(mode==='init'){
 if(fs.existsSync(dir+'/GENERATION-MANIFEST.json'))throw Error('Manifest already exists; do not reset accepted phases');
 const x=inventory(artworkRuntime());save('RUNTIME-INVENTORY.json',x);
 const protectedFiles=JSON.parse(fs.readFileSync('.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json')).entries.map(e=>({path:e.path,sha256:sha(fs.readFileSync(e.path))}));save('PROTECTED-ASSET-HASHES.json',protectedFiles);
 save('PROMPT-MANIFEST.json',specs.map(s=>({...s,startPrompt:prompt(s,'start'),movementPrompt:prompt(s,'movement'),reviewStatus:'specification-frozen',humanCoachReviewStatus:'pending'})));
 save('GENERATION-MANIFEST.json',specs.map(s=>({id:s.id,name:s.name,phases:{},status:'not-started'})));
 const state=read('STATE.json');state.currentCheckpoint='F7-REVIEW-01-QUEUE-FROZEN';state.completedUnits.push('RUNTIME-INVENTORY-FROZEN','PROTECTED-ASSETS-HASHED','CONFIRMED-SPECS-FROZEN');state.nextAtomicAction=`Generate Start for ${specs[0].id}`;save('STATE.json',state);console.log(JSON.stringify({runtimeCases:x.cases.length,physicalEligibleDayNames:x.rows.filter(r=>r.eligible&&!r.nonExercise).length,pairs:specs.length,phaseFiles:specs.length*2,protectedFiles:protectedFiles.length}));
}else if(mode==='prompt'){
 const s=specs.find(s=>s.id===id);if(!s||!['start','movement'].includes(phase))throw Error('Exact movement and phase required');console.log(prompt(s,phase));
}else if(mode==='record'){
 if(!['start','movement'].includes(phase)||!source||!review)throw Error('Require phase, source file and explicit AI-review observation');
 const manifest=read('GENERATION-MANIFEST.json'),e=manifest.find(e=>e.id===id);if(!e)throw Error('Unknown exact ID');
 if(e.phases[phase])throw Error('Phase already recorded; repair requires an explicit versioned decision');
 const raw=fs.readFileSync(source),meta=await sharp(raw).metadata();if(meta.width!==meta.height)throw Error('Expected square generator source; inspect before processing');
 const out=`assets/exercises/periodized-v5-review/${id}-v5-${phase}`;fs.mkdirSync(path.dirname(out),{recursive:true});
 const master=`${dir}/masters/${id}-${phase}${path.extname(source)||'.png'}`;fs.mkdirSync(path.dirname(master),{recursive:true});if(fs.existsSync(master)||fs.existsSync(out+'.png'))throw Error('Refuse overwrite');fs.copyFileSync(source,master);
 // An explicit inset guarantees at least 10% final margin without cropping
 // any source content. Never stretch or infer subject-boundary crops.
 await sharp(raw).resize(410,410,{fit:'contain',background:'#181818'}).extend({top:51,bottom:51,left:51,right:51,background:'#181818'}).png().toFile(out+'.png');await sharp(out+'.png').webp({quality:90,effort:6}).toFile(out+'.webp');
 const png=fs.readFileSync(out+'.png'),m=await sharp(png).metadata();if(m.width!==512||m.height!==512||m.format!=='png')throw Error('Bad output');
 e.phases[phase]={sourcePath:source,masterPath:master,sourceSha256:sha(raw),pngPath:out+'.png',webpPath:out+'.webp',sha256:sha(png),webpSha256:sha(fs.readFileSync(out+'.webp')),width:512,height:512,technicalStatus:'pass',semanticStatus:'ai-reviewed',reviewObservation:review,humanCoachReviewStatus:'pending'};
 if(e.phases.start&&e.phases.movement){if(e.phases.start.sha256===e.phases.movement.sha256)throw Error('Identical pair');e.status='pair-reviewed';}else e.status=phase+'-reviewed';
 save('GENERATION-MANIFEST.json',manifest);const state=read('STATE.json');state.generatedPhaseFiles=manifest.reduce((n,e)=>n+Object.keys(e.phases).length,0);state.generatedPairs=manifest.filter(e=>e.status==='pair-reviewed').length;state.completedMovementIds=manifest.filter(e=>e.status==='pair-reviewed').map(e=>e.id);state.currentMovementId=e.status==='pair-reviewed'?null:id;state.currentPhase=e.status==='pair-reviewed'?null:phase;state.currentCheckpoint=`F7-REVIEW-${id}-${e.status==='pair-reviewed'?'PAIR-ACCEPTED':phase.toUpperCase()+'-ACCEPTED'}`;
 const next=manifest.find(e=>!['pair-reviewed','held-for-repair'].includes(e.status));const held=manifest.find(e=>e.status==='held-for-repair');state.nextAtomicAction=next?`Generate ${next.phases.start?'Movement':'Start'} for ${next.id}`:held?`Repair rejected Start for ${held.id}`:'Run exact review override integration and all-day validation';save('STATE.json',state);console.log(JSON.stringify({id,phase,png:out+'.png',acceptedPairs:state.generatedPairs,acceptedFiles:state.generatedPhaseFiles,nextAtomicAction:state.nextAtomicAction}));
}else if(mode==='validate'){
 for(const e of read('GENERATION-MANIFEST.json'))for(const [p,r]of Object.entries(e.phases)){const b=fs.readFileSync(r.pngPath);if(sha(b)!==r.sha256)throw Error('Changed accepted '+e.id+'/'+p);const m=await sharp(b).metadata();if(m.width!==512||m.height!==512)throw Error('Dimensions');}
 for(const e of read('PROTECTED-ASSET-HASHES.json'))if(sha(fs.readFileSync(e.path))!==e.sha256)throw Error('Changed protected asset '+e.path);console.log('Accepted phase integrity and baseline artwork hashes PASS');
}else throw Error('Use init, prompt, record or validate');
