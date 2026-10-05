import fs from 'node:fs';
import assert from 'node:assert/strict';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const dir='.codex/v541/artwork-completion-review';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8'));
const specs=read('SPECS.json'),manifest=read('GENERATION-MANIFEST.json');
const decisions=read('MECHANICS-DECISIONS.json');
const compounds=read('COMPOUND-MOVEMENTS.json');
// Generation mechanics remain locked; member instructions omit artist-facing cues.
const displayCopy={
 'review-wrist-flexor-isometric':['Support a palm-up forearm on a table with the wrist straight and hand just beyond the edge. Position the other hand above the palm.','Press gently down with the other hand while resisting by trying to bend the supported wrist upward. Keep the wrist still and breathe normally.'],
 'review-shallow-wall-sit-isometric':['Stand with your back against a wall and feet a comfortable distance forward, heels grounded.','Slide into a comfortable shallow knee bend, keeping your back supported and heels down. Hold without sinking deeper.'],
 'review-supported-calf-isometric':['Stand beside a stable support with both feet hip-width and heels on the floor. Rest one hand lightly on the support.','Lift both heels to a comfortable mid-range height and hold. Keep ankles aligned, knees soft and breathing normal.'],
 'review-standing-core-brace-isometric':['Stand upright with feet hip-width, knees soft and ribs over the pelvis. Relax the abdomen.','Touch the lower abdomen lightly and brace as if preparing for a gentle tap. Keep breathing; do not suck the abdomen inward or bend the trunk.'],
 'review-hanging-abdominal-draw-in':['Take a secure shoulder-width overhand grip. Hang with shoulders actively supported and straight legs below the hips, without swinging.','After an easy exhale, gently draw the lower abdomen inward while keeping the same hang. Breathe comfortably; do not raise the legs, bend the elbows or force a deep hollow.'],
 'review-seated-abdominal-draw-in':['Sit upright on a stable bench, feet flat and hands resting on the thighs. Keep ribs over the pelvis.','After an easy exhale, gently draw the lower abdomen inward. Keep the supported posture and comfortable breathing; do not round the back or force a deep hollow.']
};
const safety={
 'biweekly-standing-machine-calf-raise':'Keep heels free of the block and use a comfortable ankle range; do not bounce into the stretch.',
 'periodized-deficit-barbell-rdl':'The platform does not require a deeper reach; stop before your back rounds.',
 'biweekly-stick-overhead-deep-squats':'Keep heels grounded and use only a depth and overhead grip that remain comfortable.',
 'biweekly-sissy-squat':'Use a shallow controlled range; stop if the knees become painful or balance is lost.',
 'biweekly-seated-calf-raise-machine':'Place the pad above the knees, not on the kneecaps; avoid bouncing at the bottom.',
 'biweekly-incline-smith-machine-press-45':'Set the safety stops before loading and keep the bar path over the upper chest, not the neck.',
 'biweekly-bayesian-cable-curl':'Do not force the shoulder farther behind you to increase the stretch.',
 'periodized-overhead-dual-cable-tricep-extension':'Keep ribs controlled; shorten the overhead range if the shoulders pinch.',
 'periodized-chest-supported-t-bar-row':'Keep your chest on the pad and do not lift the torso to finish the pull.',
 'periodized-incline-db-press':'Keep wrists above elbows and avoid forcing the dumbbells below a comfortable chest-level position.',
 'periodized-wide-stance-leg-press':'Keep the pelvis on the backrest and stop before the knees lock or the lower back lifts.',
 'biweekly-dumbbell-pullover-on-flat-bench':'Do not force the dumbbell below your comfortable shoulder range or arch the lower back to gain depth.',
 'biweekly-45-incline-leg-press-mid-stance':'Set the safety stops and keep the pelvis supported; do not lock the knees or copy the illustrated plate load.',
 'review-front-foot-elevated-dumbbell-reverse-lunge':'Use a stable low platform and keep the front heel supported; stop if balance or knee alignment is lost.',
 'review-dumbbell-bulgarian-split-squat':'Use a stable low rear-foot support; choose a load that lets you keep the front heel planted and knee aligned.',
 'review-stick-supported-sagittal-hip-swing':'Keep the swing controlled and comfortable; do not lean or force a high kick.',
 'review-incline-bench-dumbbell-row':'Keep your chest supported; do not lift the torso or jerk the weights to finish the pull.',
 'review-low-to-high-cable-fly':'Keep elbows gently bent and shoulders down; do not force the handles behind the torso or above the comfortable shoulder range.'
};
const records=manifest.filter(m=>m.status==='pair-reviewed').map(m=>{
 const s=specs.find(s=>s.id===m.id);assert.ok(s);
 return {...s,canonicalMovementId:s.id,stableMovementId:s.id,artworkStatus:'complete',assetVersion:'local-artwork-review-v5',
 imageSet:{start:m.phases.start.webpPath,movement:m.phases.movement.webpPath},
 startInstruction:displayCopy[s.id]?.[0]||s.start,movementInstruction:displayCopy[s.id]?.[1]||s.movement,safetyCue:s.safetyCue||safety[s.id],
 altStart:`${s.name}: stable starting position`,altMovement:`${s.name}: active working position`,
 mappingStatus:'explicit-local-review-identity',technicalReviewStatus:'files-validated',semanticReviewStatus:'ai-reviewed',humanCoachReviewStatus:'pending'};
});
// Only complete, individually reviewed pairs reach this additive boundary.
const code=`/* Local-only additive artwork review. Generated from accepted checkpoints. */
(() => {
 const records=${JSON.stringify(records,null,2)};
 const decisions=${JSON.stringify(decisions.records,null,2)};
 const compounds=${JSON.stringify(compounds,null,2)};
 const api=window.GYM_COMPANION_ABAC_ARTWORK;
 const original=api.resolve;
 const names=new Map(records.flatMap(r=>r.names.map(n=>[n,r])));
 const recordFor=(id,name,dayIndex)=>id?(records.find(r=>r.id===id)||api.byId[id]):original({name,__alternative:true},dayIndex);
 api.resolve=function(item,dayIndex){
  const prior=original(item,dayIndex),name=item?.name||item?.title;
  if(prior.reviewOnly||['excluded-equipment','non-exercise'].includes(prior.mappingStatus))return prior;
  const day=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayIndex];
  const decision=decisions.find(d=>d.name===name&&d.days.includes(day));
  const tier=item?.__reviewTier;
  const compound=compounds.records.find(r=>r.name===name&&r.days.includes(day)&&(!r.tiers||r.tiers.includes(tier)));
  if(compound){
   const components=compound.componentIds.map(id=>{
    const r=records.find(r=>r.id===id)||api.byId[id];
    return r?{...r,...compounds.reusedComponentContent[id],canonicalMovementId:id}:null;
   });
   if(components.every(r=>r?.artworkStatus==='complete'&&r.imageSet?.start&&r.imageSet?.movement&&!r.reviewOnly))
    return {name,canonicalMovementId:compound.id,stableMovementId:compound.id,imageSet:{},artworkComponents:components,
     artworkStatus:'complete',mappingStatus:'explicit-compound-components',localReviewMapping:true,
     technicalReviewStatus:'files-validated',semanticReviewStatus:'ai-reviewed',humanCoachReviewStatus:'pending',
     decisionBasis:compound.basis,__reviewTier:tier};
   return prior;
  }
  let targetId,targetName;
  if(decision){
   if(name==='Walking Lunges')targetId=decision.targetId;
   else if(name==='Leg Press'&&tier){
    const key=tier==='expert'?'advanced':tier;
    const dose=String(item.prescriptions?.[key]||item.prescriptions?.[tier]||item.scheme||'');
    targetId=/wide stance/i.test(dose)?decision.wideTargetId:decision.targetId;
   }
   else if(name==='Reverse Lunges with Dumbbells'&&tier){
    const key=tier==='expert'?'advanced':tier;
    const dose=String(item.prescriptions?.[key]||item.prescriptions?.[tier]||item.scheme||'');
    targetId=/front foot elevated/i.test(dose)?decision.expertTargetId:decision.targetId;
   }
   else if(name==='Standard Forearm Plank to RKC Hardstyle Plank'){
    targetName=tier==='expert'?decision.expertTargetName:tier==='intermediate'?decision.intermediateTargetName:null;
   }
   else if(name==='Standing & Seated Transverse Abdominis Stomach Vacuum'){
    targetName=tier==='intermediate'?decision.intermediateTargetName:null;
   }
  }
  if(targetId||targetName){
   const record=recordFor(targetId,targetName,dayIndex);
   if(record?.artworkStatus==='complete'&&record.imageSet?.start&&record.imageSet?.movement&&!record.reviewOnly)
    return {...record,canonicalMovementId:record.canonicalMovementId||record.stableMovementId,name,
     mappedRuntimeIds:[item.id,item.stableMovementId].filter(Boolean),mappingStatus:'explicit-local-review-decision',
     localReviewMapping:true,decisionBasis:decision.basis,__reviewTier:tier};
   return prior;
  }
  if(['combined-needs-content-decision','tier-resolution-required'].includes(prior.mappingStatus))return prior;
  const record=names.get(name);if(!record)return prior;
  return {...record,name,mappedRuntimeIds:[item.id,item.stableMovementId].filter(Boolean),localReviewMapping:true,__reviewTier:tier};
 };
 const content=window.GYM_COMPANION_ABAC_CONTENT;
 for(const r of records)content.records[r.canonicalMovementId]={
  ...(content.records[r.canonicalMovementId]||{}),canonicalMovementId:r.canonicalMovementId,name:r.name,
  equipment:r.equipment,startInstruction:r.startInstruction,movementInstruction:r.movementInstruction,safetyCue:r.safetyCue,
  source:'.codex/v541/artwork-completion-review/SPECS.json',contentReviewStatus:'source-backed-ai-reviewed',humanCoachReviewStatus:'pending',
  progressionType:r.progressionType||(r.id.includes('stick-')?'mobility':r.id.includes('sissy-')?'bodyweight':r.id.includes('cable-')?'stack':'weighted')
 };
 const originalEnrich=content.enrich;
 content.enrich=function(item,dayIndex,tier){
  // Tier is supplied by the existing normalizer, never inferred from a name.
  const prepared={...item,__reviewTier:tier};
  const out=originalEnrich(prepared,dayIndex,tier),art=api.resolve(prepared,dayIndex);
  if(art.artworkComponents)return {...out,...art,id:item.id,name:item.name||item.title,
   artworkComponents:art.artworkComponents,contentReviewStatus:'source-backed-ai-reviewed',
   contentSource:'.codex/v541/artwork-completion-review/COMPOUND-MOVEMENTS.json',
   startInstruction:'Each component has its own setup below.',movementInstruction:'Follow each component using the existing combined prescription.',
   equipment:art.artworkComponents.map(r=>r.equipment).join('; '),
   safetyCue:art.artworkComponents.map(r=>r.name+': '+r.safetyCue).join(' '),
   progressionType:art.artworkComponents.every(r=>r.progressionType==='vacuum')?'vacuum':'combined-components'};
  // The existing card renderer reads alt_text, whereas phases use their own labels.
  return art.localReviewMapping?{...out,imageSet:{...art.imageSet},artworkStatus:art.artworkStatus,
   canonicalMovementId:art.canonicalMovementId||art.stableMovementId,stableMovementId:art.stableMovementId,
   assetVersion:art.assetVersion,mappingStatus:art.mappingStatus,decisionBasis:art.decisionBasis,
   alt_text:art.altMovement||art.alt_text||((item.name||item.title)+': working position')}:out;
 };
 window.GYM_COMPANION_LOCAL_ARTWORK_REVIEW={records,decisions,compounds,localOnly:true};
})();
`;
fs.writeFileSync('data/abac-artwork-review.js',code);
const reviewRuntime=artworkRuntime({review:true}),runtime=inventory(reviewRuntime);
const galleryCompounds=compounds.records.map(r=>({...r,...reviewRuntime.window.GYM_COMPANION_ABAC_ARTWORK.resolve({name:r.name,__reviewTier:r.tiers?.[0]||'intermediate'},['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(r.days[0]))}));
const gallery={records,decisions:{...decisions,records:[...decisions.records,...compounds.records.map(r=>({...r,status:'explicit-compound-components',basis:r.basis}))]},queue:manifest.map(m=>({id:m.id,name:m.name,status:m.status,reason:m.reason||null})),
 compounds:galleryCompounds,
 unresolved:runtime.rows.filter(r=>r.eligible&&!r.nonExercise&&!r.filePairPresent).map(r=>({day:r.day,name:r.name,status:r.mappingStatus||'pending',pendingCases:r.pendingCases}))};
fs.writeFileSync('data/artwork-review-gallery.json',JSON.stringify(gallery,null,2)+'\n');
console.log(JSON.stringify({acceptedPairs:records.length,phaseFiles:records.length*2,heldPairs:manifest.filter(m=>m.status==='held-for-repair').length}));
