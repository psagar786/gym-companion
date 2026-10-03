/* Shared exact artwork lookup for the active ABAC runtime. No fuzzy fallback. */
(() => {
 const sources = {
  Monday:window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK,
  Tuesday:window.GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK,
  ...window.GYM_COMPANION_PERIODIZED_V3_DAY_ARTWORK?.days
 };
 const rejected = {
  'periodized-chest-supported-t-bar-row':'Start is not chest-supported and uses a different machine from Movement.',
  'periodized-incline-db-press':'Illustration appears to use a nearly upright bench rather than the named incline chest-press angle.',
  'periodized-wide-stance-leg-press':'Machine frame and seating arrangement change between phases; needs pair review.'
 };
 // Re-reviewed from the existing two phase files. This does not imply coach
 // approval or authorize sharing with a standard/non-deficit split squat.
 const reviewedExisting = {
  'periodized-deficit-bulgarian-split-squat':{
   semanticReviewStatus:'ai-reviewed-mechanics-pass',
   reviewDate:'2026-10-03',
   equipment:'Dumbbells, low front-foot platform and rear-foot support bench',
   evidence:'Same athlete, dumbbells, elevated front foot and rear-foot bench support; extended setup and lowered working position.'
  }
 };
 const complete = record => record?.artworkStatus==='complete' && !!record.imageSet?.start && !!record.imageSet?.movement && !rejected[record.stableMovementId];
 const byId=Object.create(null), byName=Object.create(null);
 for(const [day,source] of Object.entries(sources)) for(const [id,record] of Object.entries(source?.movements||{})) if(complete(record)&&!record.reviewOnly) {
  byId[id] ||= {...record,sourceDay:day};
  // Exact authored name, not a normalized similarity search.
  byName[record.name] ||= id;
 }
 const aliases = {
  'Seated Cable Row (Sternum)':['Monday','biweekly-seated-cable-row-to-sternum-neutral-grip'],
  'Incline DB Hex Press':['Monday','biweekly-incline-dumbbell-hex-press'],
  'Incline Dumbbell Press':['Monday','biweekly-incline-dumbbell-bench-press-30'],
  'Lying Leg Curl':['Wednesday','biweekly-lying-leg-curl-machine'],
  'Deficit Bulgarian Split Squats':['Wednesday','periodized-deficit-bulgarian-split-squat'],
  'Wide-Stance Sumo Leg Press':['Saturday','periodized-wide-stance-leg-press'],
  'Romanian Deadlift':['Wednesday','periodized-barbell-rdl'],
  'Dumbbell RDL':['Wednesday','biweekly-dumbbell-romanian-deadlift-rdl'],
  'Seated DB Shoulder Press':['Thursday','biweekly-seated-dumbbell-overhead-shoulder-press'],
  'Neutral-Grip Lat Pulldown (Close-Grip V-Bar)':['Thursday','biweekly-close-grip-v-bar-lat-pulldown'],
  'Assisted Pull-Up':['Monday','periodized-assisted-pull-ups'],
  'Incline Prone Dumbbell Reverse Fly':['Thursday','periodized-incline-prone-db-reverse-fly'],
  'Barbell Shrugs':['Saturday','periodized-barbell-shrug'],
  'Dumbbell Shrugs':['Saturday','periodized-dumbbell-shrug'],
  'Single-Arm DB Row':['Saturday','periodized-single-arm-dumbbell-row'],
  'Side Plank Clamshells':['Saturday','periodized-side-plank-clamshell'],
  'Single-Leg DB RDL':['Saturday','periodized-single-leg-dumbbell-rdl'],
  'Cable Upright Row (Wide)':['Saturday','periodized-cable-upright-row-wide-grip'],
  'Incline Treadmill Intervals':['Monday','biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9'],
  'Wrist extensor isometric':['Monday','tendon-wrist-extensor-isometric']
 };
 const combined = new Set(['Cable Hammer Curl & Dips','Ez-Bar Curl & Skullcrushers','Ez-Bar Preacher Curl & Skullcrushers','Incline DB Curl & Rope Pressdown','Bodyweight Air Squats to Walking Lunges','Dead Bug to Dragon Flag Negatives','Standard Forearm Plank to RKC Hardstyle Plank','Standing & Seated Transverse Abdominis Stomach Vacuum']);
 const blocked = /captain|band(?:ed|s)?|trap[- ]bar|cable (?:standing )?(?:hip )?abduction|pec[- ]deck|ab wheel/i;
 const slug=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
 function pending(item,status='missing-pair') {
  return {stableMovementId:item?.stableMovementId||item?.id||'periodized-'+slug(item?.name),name:item?.name||item?.title,artworkStatus:'pending',imageSet:{},mappingStatus:status,technicalReviewStatus:'pending',semanticReviewStatus:'pending',reviewOnly:status==='excluded-equipment'};
 }
 function resolve(item,dayIndex) {
  const name=item?.name||item?.title||'', dayName=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayIndex], source=sources[dayName];
  // Exclusions and combined execution precede every alias and override.
  if(blocked.test(name))return pending(item,'excluded-equipment');
  if(combined.has(name))return pending(item,'combined-needs-content-decision');
  if(/NO CARDIO|^hydration$|^nutritional adherence\.?$/i.test(name))return pending(item,'non-exercise');
  if(name==='Intervals')return pending(item,'tier-resolution-required');
  const nameId='periodized-'+slug(name);
  const keys=item?.__alternative ? [nameId] : [item?.id,item?.stableMovementId,nameId].filter(Boolean);
  let record;
  // A stale pending local record must not mask an exact complete cross-day pair.
  for(const key of keys) {
   const mapping=source?.runtimeMap?.[key], id=mapping?.canonicalMovementId||key;
   const local=source?.movements?.[id];
   if(local?.reviewOnly)return pending(item,'excluded-equipment');
   if(rejected[id]||rejected[local?.stableMovementId])return pending(item,'existing-artwork-needs-review');
   if(complete(local)){record=local;break;}
   if(byId[id]){record=byId[id];break;}
  }
  const alias=aliases[name];
  if(!record && alias)record=sources[alias[0]]?.movements?.[alias[1]];
  if(!record && byName[name])record=byId[byName[name]];
  if(record && rejected[record.stableMovementId])return pending(item,'existing-artwork-needs-review');
  if(!complete(record))return pending(item,/isometric/i.test(name)?'deferred-tendon-review':'missing-pair');
  const imageSet=record.imageSet;
  // Approved V4 replacements remain additive and do not overwrite V3.
  const replacement=['Lying Pelvic-Tilt Leg Raise','Hanging Knee Tuck','Knee Tuck'].includes(name)
   ? (name==='Lying Pelvic-Tilt Leg Raise'?'lying-pelvic-tilt-leg-raise':'hanging-knee-tuck') : null;
  return {...record,...reviewedExisting[record.stableMovementId],canonicalMovementId:record.stableMovementId,mappedRuntimeIds:keys,mappingStatus:alias?'explicit-alias':'exact-runtime-mapping',technicalReviewStatus:'files-validated',semanticReviewStatus:reviewedExisting[record.stableMovementId]?.semanticReviewStatus||record.semanticReviewStatus||'pending',imageSet:replacement?{
   start:'assets/exercises/periodized-v4/'+replacement+'-v4-start.webp',
   movement:'assets/exercises/periodized-v4/'+replacement+'-v4-movement.webp'
  }:imageSet,...(replacement?{assetVersion:'periodized-abc-art-v4'}:{})};
 }
 window.GYM_COMPANION_ABAC_ARTWORK={resolve,sources,aliases,combined,byId,rejected,reviewedExisting};
})();
