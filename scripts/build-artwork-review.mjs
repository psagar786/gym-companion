import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='.codex/v541/artwork-completion-review';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8'));
const specs=read('SPECS.json'),manifest=read('GENERATION-MANIFEST.json');
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
 'biweekly-45-incline-leg-press-mid-stance':'Set the safety stops and keep the pelvis supported; do not lock the knees or copy the illustrated plate load.'
};
const records=manifest.filter(m=>m.status==='pair-reviewed').map(m=>{
 const s=specs.find(s=>s.id===m.id);assert.ok(s);
 return {...s,canonicalMovementId:s.id,stableMovementId:s.id,artworkStatus:'complete',assetVersion:'local-artwork-review-v5',
 imageSet:{start:m.phases.start.webpPath,movement:m.phases.movement.webpPath},
 startInstruction:s.start,movementInstruction:s.movement,safetyCue:safety[s.id],
 altStart:`${s.name}: stable starting position`,altMovement:`${s.name}: active working position`,
 mappingStatus:'explicit-local-review-identity',technicalReviewStatus:'files-validated',semanticReviewStatus:'ai-reviewed',humanCoachReviewStatus:'pending'};
});
// Only complete, individually reviewed pairs reach this additive boundary.
const code=`/* Local-only additive artwork review. Generated from accepted checkpoints. */
(() => {
 const records=${JSON.stringify(records,null,2)};
 const api=window.GYM_COMPANION_ABAC_ARTWORK;
 const original=api.resolve;
 const names=new Map(records.flatMap(r=>r.names.map(n=>[n,r])));
 api.resolve=function(item,dayIndex){
  const prior=original(item,dayIndex),name=item?.name||item?.title;
  if(prior.reviewOnly||['excluded-equipment','non-exercise','combined-needs-content-decision','tier-resolution-required'].includes(prior.mappingStatus))return prior;
  const record=names.get(name);if(!record)return prior;
  return {...record,name,mappedRuntimeIds:[item.id,item.stableMovementId].filter(Boolean)};
 };
 const content=window.GYM_COMPANION_ABAC_CONTENT;
 for(const r of records)content.records[r.canonicalMovementId]={
  ...(content.records[r.canonicalMovementId]||{}),canonicalMovementId:r.canonicalMovementId,name:r.name,
  equipment:r.equipment,startInstruction:r.startInstruction,movementInstruction:r.movementInstruction,safetyCue:r.safetyCue,
  source:'.codex/v541/artwork-completion-review/SPECS.json',contentReviewStatus:'source-backed-ai-reviewed',humanCoachReviewStatus:'pending',
  progressionType:r.id.includes('stick-')?'mobility':r.id.includes('sissy-')?'bodyweight':r.id.includes('cable-')?'stack':'weighted'
 };
 const originalEnrich=content.enrich;
 content.enrich=function(item,dayIndex,tier){
  const out=originalEnrich(item,dayIndex,tier),art=api.resolve(item,dayIndex);
  // The existing card renderer reads alt_text, whereas phases use their own labels.
  return art.assetVersion==='local-artwork-review-v5'?{...out,alt_text:art.altMovement}:out;
 };
 window.GYM_COMPANION_LOCAL_ARTWORK_REVIEW={records,localOnly:true};
})();
`;
fs.writeFileSync('data/abac-artwork-review.js',code);
const gallery={records,queue:manifest.map(m=>({id:m.id,name:m.name,status:m.status,reason:m.reason||null})),
 unresolved:read('RUNTIME-INVENTORY.json').rows.filter(r=>r.eligible&&!r.nonExercise&&!r.filePairPresent&&!records.some(s=>s.names.includes(r.name))).map(r=>({day:r.day,name:r.name,status:r.mappingStatus||'pending'}))};
fs.writeFileSync('data/artwork-review-gallery.json',JSON.stringify(gallery,null,2)+'\n');
console.log(JSON.stringify({acceptedPairs:records.length,phaseFiles:records.length*2,heldPairs:manifest.filter(m=>m.status==='held-for-repair').length}));
