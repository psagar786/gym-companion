// Prints deterministic content data for review. Never edits runtime or artwork.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const c=artworkRuntime(), sources=new Map(), sourceHashes={};
const concrete=value=>typeof value==='string' && value.length>15 && !/stable starting position|clear working position|exercise-specific position|peak or clearly active|mark unknown|under review|proper form/i.test(value);
const extract=prompt=>prompt?.match(/Body position:\s*([\s\S]+?)(?:\n\s*Grip and stance:|\n\s*Movement mechanics:)/i)?.[1]?.trim()||prompt?.match(/Phase position:\s*(.+?)\s*Movement mechanics:/i)?.[1]?.trim();
for(const day of ['monday','tuesday','wednesday','thursday','friday','saturday']) {
 const path=`.codex/v541/artwork-v3/${day}/GENERATION-MANIFEST.json`,text=fs.readFileSync(path,'utf8'),json=JSON.parse(text);
 sourceHashes[path]=crypto.createHash('sha256').update(text).digest('hex');
 for(const row of json.movements||json.generationQueue||json.canonicalMovements||[]) {
  const start=row.startPose||extract(row.startPrompt),movement=row.movementPose||extract(row.movementPrompt);
  if(!concrete(start)||!concrete(movement)||row.reviewOnly)continue;
  sources.set(row.canonicalMovementId,{startInstruction:start,movementInstruction:movement,equipment:row.equipment,source:path});
 }
}
const path='.codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json',text=fs.readFileSync(path,'utf8');
sourceHashes[path]=crypto.createHash('sha256').update(text).digest('hex');
for(const row of JSON.parse(text).movements) {
 if(sources.has(row.canonicalMovementId)||!concrete(row.startPose)||!concrete(row.movementPose)||row.promptStatus==='draft-needs-content-review')continue;
 sources.set(row.canonicalMovementId,{startInstruction:row.startPose,movementInstruction:row.movementPose,equipment:row.equipment,source:path});
}
const records={},unresolved=[];
// Concrete, authored current-runtime phase briefs take precedence over old
// prompt prose, but only through an approved canonical artwork identity.
for(const day of c.periodized.days.filter(day=>day.dayIndex<6))for(const row of [...day.coreSlots,...day.warmup,...day.recovery,...day.optionalSlots||[]]) {
 const start=row.phaseBriefs?.start?.instruction,movement=row.phaseBriefs?.movement?.instruction;
 if(!concrete(start)||!concrete(movement))continue;
 const art=c.window.GYM_COMPANION_ABAC_ARTWORK.resolve(row,day.dayIndex);
 if(art.artworkStatus!=='complete'||art.reviewOnly)continue;
 const id=art.canonicalMovementId||art.stableMovementId,existing=sources.get(id);
 sources.set(id,{startInstruction:start,movementInstruction:movement,equipment:existing?.equipment||art.equipment,source:'data/periodized-abc.js',safetyCue:row.safetyCue});
}
// Explicit review decisions: do not approve contradictory or ambiguous source prose.
const held={
 'biweekly-seated-cable-row-to-sternum-neutral-grip':'Source says lower abdomen although identity specifies sternum',
 'biweekly-incline-barbell-bench-press-30':'Source permits 30–45 degrees although identity specifies 30 degrees',
 'biweekly-standing-low-to-high-cable-crossover':'Source says low or mid pulley without a definite upward path',
 'periodized-db-side-bend':'Source describes bending toward unloaded side; resistance direction needs review',
 'biweekly-stick-high-knee-marches':'Source allows two different stick positions; needs one exact setup',
 'periodized-hanging-windshield-wipers':'Source does not specify supported hip position or safe working arc',
 'periodized-single-arm-cable-pulldown':'Source allows kneeling or sitting; execution needs confirmation',
 'periodized-cable-side-crunch-on-mat':'Source effort direction toward cable requires clarification'
};
// Corrections are stated by the same concrete phase text, not inferred from a parent.
const equipment={
 'periodized-cable-russian-twist':'Low cable station with handle',
 'periodized-floor-bodyweight-twist':'Bodyweight on exercise mat',
 'periodized-medicine-ball-twists':'Medicine ball and exercise mat',
 'periodized-bench-reverse-crunch':'Flat bench; bodyweight',
 'periodized-side-plank-hold':'Exercise mat; bodyweight',
 'periodized-db-suitcase-carry':'One dumbbell and clear walking space',
 'periodized-side-plank-hip-dips':'Exercise mat; bodyweight',
 'periodized-cable-side-crunch':'High cable station with handle',
 'periodized-incline-bench-plank-vacuum':'Incline bench; bodyweight',
 'periodized-stability-ball-crunch':'Stability ball',
 'periodized-floor-crunch':'Exercise mat; bodyweight',
 'periodized-elliptical-intervals':'Elliptical trainer',
 'periodized-bike-sprint-intervals':'Stationary bike',
 'periodized-dumbbell-woodchopper':'One dumbbell',
 'periodized-hanging-knee-raise':'Fixed pull-up bar; bodyweight',
 'biweekly-decline-bench-weighted-crunch':'Decline bench and weight plate',
 'biweekly-dumbbell-romanian-deadlift-rdl':'Pair of dumbbells',
 'biweekly-seated-hip-adductor-machine':'Seated hip-adductor machine',
 'biweekly-seated-hip-abductor-machine':'Seated hip-abductor machine',
 'periodized-incline-reverse-crunch':'Incline bench; bodyweight',
 'periodized-t-bar-row':'T-bar or anchored landmine with row handle'
};
const bodyweight=new Set(['biweekly-hanging-straight-leg-raise','biweekly-lying-pelvic-tilt-leg-raise','periodized-bench-reverse-crunch','periodized-side-plank-hip-dips','periodized-floor-crunch','periodized-hanging-knee-raise','biweekly-side-plank-hip-dips-with-rotation','periodized-floor-reverse-crunch-with-pelvic-tilt','periodized-dragon-flag-negatives','periodized-decline-leg-raise','periodized-dead-bug','periodized-bicycle-kicks','periodized-decline-bench-russian-twists','periodized-glute-bridge','periodized-single-leg-hip-thrust','periodized-side-plank-clamshell','periodized-nordic-curl-negatives','periodized-nordic-hamstring-curl','periodized-bodyweight-air-squat','periodized-bodyweight-walking-lunge','periodized-jump-squat','periodized-floor-bodyweight-twist','periodized-incline-reverse-crunch','periodized-stability-ball-crunch']);
const holds=new Set(['periodized-side-plank-hold','periodized-standard-forearm-plank','periodized-rkc-hardstyle-plank','periodized-extended-plank','periodized-hollow-body-hold']);
for(const [id,art] of Object.entries(c.window.GYM_COMPANION_ABAC_ARTWORK.byId)) {
 const source=sources.get(id);
 if(!source||held[id]||/tendon|isometric-hold/.test(id)){unresolved.push({id,name:art.name,reason:held[id]||'No concrete, non-deferred exact-identity phase specification'});continue;}
 const eq=equipment[id]||source.equipment;
 const progressionType=/vacuum/.test(id)?'vacuum':/elliptical|bike-sprint/.test(id)?'cardio':holds.has(id)?'bodyweight-hold':bodyweight.has(id)?'bodyweight':/stick|pose|stretch|cat-cow-mobility/.test(id)?'mobility':/cable|machine/i.test(eq)?'stack':'weighted';
 records[id]={canonicalMovementId:id,name:art.name,...source,equipment:eq,progressionType,contentReviewStatus:'source-backed-ai-reviewed',humanCoachReviewStatus:'pending'};
}
const pairKey=set=>[set?.start,set?.movement].map(path=>String(path||'').replace(/\.png$/,'.webp')).join('|'),byPair={};
for(const [id,art] of Object.entries(c.window.GYM_COMPANION_ABAC_ARTWORK.byId))if(records[id])byPair[pairKey(art.imageSet)] ||= id;
sourceHashes['data/periodized-abc.js']=crypto.createHash('sha256').update(fs.readFileSync('data/periodized-abc.js')).digest('hex');
console.log(JSON.stringify({version:'f7-content-v1',records,byPair,unresolved,sourceHashes},null,2));
