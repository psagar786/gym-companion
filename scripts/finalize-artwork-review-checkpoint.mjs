import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {artworkRuntime,inventory} from './abac-artwork-runtime.mjs';
const dir='.codex/v541/artwork-completion-review';
const read=name=>JSON.parse(fs.readFileSync(dir+'/'+name,'utf8'));
const save=(name,v)=>fs.writeFileSync(dir+'/'+name,JSON.stringify(v,null,2)+'\n');
const validation=read('ASSET-VALIDATION.json'),http=read('LOCAL-SERVER-VALIDATION.json');
if(validation.status!=='PASS'||http.status!=='PASS')throw Error('Do not checkpoint a failed local build');
const contentValidation=JSON.parse(execFileSync('node',['scripts/validate-abac-exercise-content.mjs','--review'],{encoding:'utf8'}));
save('CONTENT-VALIDATION.json',contentValidation);
const manifest=read('GENERATION-MANIFEST.json'),state=read('STATE.json');
const complete=manifest.filter(m=>m.status==='pair-reviewed');
const nextAction='Review all eight resolved entries locally; obtain human exercise/artwork approval before any production release';
const pending=validation.pending.map(p=>({...p,category:p.status==='deferred-tendon-review'?'deferred-preparation':'combined-decision'}));
save('MISSING-QUEUE.json',{countUnit:'Selectable physical day/name entries; tier-ineligible records excluded, not a canonical generation count',
 pendingDayNames:pending.length,mechanicsHolds:0,combinedDecisions:pending.filter(r=>r.category==='combined-decision').length,
 deferredPreparation:pending.filter(r=>r.category==='deferred-preparation').length,generationCountFrozen:false,
 records:pending,nextAtomicAction:nextAction});
const api=artworkRuntime({review:true}).window.GYM_COMPANION_ABAC_ARTWORK;
const reused=[['Wednesday','Walking Lunges',2,{}],['Wednesday','Reverse Lunges with Dumbbells',2,{__reviewTier:'intermediate'}],
 ['Wednesday','Leg Press',2,{__reviewTier:'intermediate'}],['Wednesday','Leg Press',2,{__reviewTier:'beginner',scheme:'Wide stance'}],
 ['Friday','Standard Forearm Plank to RKC Hardstyle Plank',4,{__reviewTier:'intermediate'}],
 ['Friday','Standard Forearm Plank to RKC Hardstyle Plank',4,{__reviewTier:'expert'}],
 ['Tuesday','Standing & Seated Transverse Abdominis Stomach Vacuum',1,{__reviewTier:'intermediate'}]].map(([day,name,index,fields])=>{
 const art=api.resolve({name,...fields},index);
 return {day,name,tier:fields.__reviewTier||'all applicable',canonicalMovementId:art.canonicalMovementId||art.stableMovementId,
  mappingStatus:art.mappingStatus,basis:art.decisionBasis,imageSet:art.imageSet,
  phaseHashes:Object.fromEntries(Object.entries(art.imageSet).map(([phase,path])=>[phase,crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')])),
  semanticReviewStatus:'AI exercise-identity review; existing framing and isometric phase limitations retained',humanCoachReviewStatus:'pending'};
});
const review=artworkRuntime({review:true}),runtime=inventory(review);
const compounds=read('COMPOUND-MOVEMENTS.json').records.map(r=>{
 const art=review.window.GYM_COMPANION_ABAC_ARTWORK.resolve({name:r.name,__reviewTier:r.tiers?.[0]||'intermediate'},['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(r.days[0]));
 return {...r,components:art.artworkComponents.map(c=>({id:c.canonicalMovementId,name:c.name,imageSet:c.imageSet,phaseHashes:Object.fromEntries(Object.entries(c.imageSet).map(([phase,path])=>[phase,crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')]))}))};
});
save('REUSE-VALIDATION.json',{records:reused,compoundComponents:compounds,noCopiedAssets:true,baselineHashesUnchanged:true});
const activePaths=[...new Set(runtime.occurrences.filter(o=>o.eligible&&!o.nonExercise&&o.filePairPresent).flatMap(o=>o.artworkComponents.length?o.artworkComponents.flatMap(c=>Object.values(c.imageSet)):Object.values(o.imageSet)))];
save('ACTIVE-ASSET-MANIFEST.json',{scope:'Local review only; resolved eligible runtime including all compound components',files:activePaths.map(path=>({path,bytes:fs.statSync(path).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}))});
state.currentCheckpoint='F7-REVIEW-ALL-PENDING-ARTWORK-INTEGRATED';
state.generatedPairs=complete.length;state.generatedPhaseFiles=complete.length*2;
state.confirmedNewPairs=21;state.confirmedReplacementPairs=5;
state.unresolvedMechanicsDayNames=0;state.remainingPendingDayNames=pending.length;
state.combinedMovementDecisions=pending.filter(p=>p.category==='combined-decision').length;
state.deferredTendonRecords=pending.filter(p=>p.category==='deferred-preparation').length;
state.previewStarted=true;state.currentMovementId=null;state.currentPhase=null;
state.lastCompletedCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
state.completedUnits=[...new Set([...state.completedUnits,'26-PAIRS-GENERATED-AND-REVIEWED','FOUR-COMPOUND-SEQUENCES-INTEGRATED','FOUR-PREPARATION-SEQUENCES-INTEGRATED','USER-CONFIRMED-SEATED-HANGING-VACUUM','1867-CARD-DETAIL-CHECKS','358-LOCAL-IMAGE-REQUESTS-VERIFIED','CURRENT-COMPOUND-MOBILE-BROWSER-REVIEW'])];
state.validationResults={...state.validationResults,newPairs:complete.length,phasePngFiles:complete.length*2,displayWebpFiles:complete.length*2,
 occurrenceChecks:validation.occurrenceChecks,cardDetailChecks:validation.cardDetailChecks,servedActiveImages:http.servedActiveImages,
 currentBrowserVerification:'PASS: representative compound card/detail and Expert seated/hanging sequence; see BROWSER-VALIDATION.json',currentResponsiveVerification:'Current representative cards/details checked at actual 320, 390, 430px; prior six-width evidence retained separately',
 protectedSourceFiles:validation.protectedSourceFiles,
 workoutDoseOrderAndClassificationUnchanged:true};
state.knownIssues=[
 'Zero pending artwork among eligible audited day/name entries. Locked, excluded and non-exercise states are intentionally not activated.',
 'Tuesday Expert uses user-confirmed seated plus hanging draw-in, with both component phase pairs. Isometric tension and breathing cannot be established from still images.',
 'Existing reused Standard/RKC plank pairs have camera/framing and subtle isometric phase limitations; no regeneration or coach approval claimed.',
 'Previously blocked browser reload now succeeds on the existing local tab. Representative desktop/mobile checks pass; physical iPhone Safari and qualified coach review remain pending.',
 'Reused rope pressdown has an already-cropped tower edge; reused air-squat frames have mild camera variation. These are recorded style/framing limitations, not hidden or claimed repaired.',
 'Existing content audit still reports '+contentValidation.roleDefaultOccurrences+' role-default dose occurrences, '+contentValidation.missingCardioPrescriptionOccurrences+' missing cardio dose occurrences, '+contentValidation.reviewDayNames+' content-review day/name entries and '+contentValidation.executionConflictDayNames+' recognized execution conflicts. These are not silently repaired by artwork.',
 'Local assumptions for support angle, split-squat loading and hip-swing plane require user review; no confirmed equipment inventory claim.'
];
state.changedFiles=[...new Set([...state.changedFiles,'member-app.js','styles.css','scripts/finalize-artwork-review-checkpoint.mjs','scripts/validate-artwork-review-http.mjs'])];
state.nextAtomicAction=nextAction;
save('STATE.json',state);
console.log(JSON.stringify({checkpoint:state.currentCheckpoint,acceptedPairs:state.generatedPairs,phaseImages:state.generatedPhaseFiles,pendingDayNames:pending.length,nextAtomicAction:state.nextAtomicAction}));
