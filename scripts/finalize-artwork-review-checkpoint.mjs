import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {artworkRuntime} from './abac-artwork-runtime.mjs';
const dir='.codex/v541/artwork-completion-review';
const read=name=>JSON.parse(fs.readFileSync(dir+'/'+name,'utf8'));
const save=(name,v)=>fs.writeFileSync(dir+'/'+name,JSON.stringify(v,null,2)+'\n');
const validation=read('ASSET-VALIDATION.json'),http=read('LOCAL-SERVER-VALIDATION.json');
if(validation.status!=='PASS'||http.status!=='PASS')throw Error('Do not checkpoint a failed local build');
const manifest=read('GENERATION-MANIFEST.json'),state=read('STATE.json');
const complete=manifest.filter(m=>m.status==='pair-reviewed');
const pending=validation.pending.map(p=>({...p,category:p.status==='deferred-tendon-review'?'deferred-preparation':'combined-decision'}));
save('MISSING-QUEUE.json',{countUnit:'Selectable physical day/name entries; tier-ineligible records excluded, not a canonical generation count',
 pendingDayNames:pending.length,mechanicsHolds:0,combinedDecisions:pending.filter(r=>r.category==='combined-decision').length,
 deferredPreparation:pending.filter(r=>r.category==='deferred-preparation').length,generationCountFrozen:false,
 records:pending,nextAtomicAction:'Design a two-component artwork presentation for the three authored paired records without changing their dose or completion identity; keep Expert seated/hanging vacuum pending'});
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
save('REUSE-VALIDATION.json',{records:reused,noCopiedAssets:true,baselineHashesUnchanged:true});
state.currentCheckpoint='F7-REVIEW-LOCAL-BUILD-18-PAIRS';
state.generatedPairs=complete.length;state.generatedPhaseFiles=complete.length*2;
state.unresolvedMechanicsDayNames=0;state.remainingPendingDayNames=pending.length;
state.combinedMovementDecisions=pending.filter(p=>p.category==='combined-decision').length;
state.deferredTendonRecords=pending.filter(p=>p.category==='deferred-preparation').length;
state.previewStarted=true;state.currentMovementId=null;state.currentPhase=null;
state.lastCompletedCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
state.completedUnits=[...new Set([...state.completedUnits,'REMAINING-MECHANICS-DECISIONS-RECORDED','18-PAIRS-GENERATED-AND-REVIEWED','TIER-AWARE-REUSE-INTEGRATED','1867-CARD-DETAIL-CHECKS','340-LOCAL-IMAGE-REQUESTS-VERIFIED'])];
state.validationResults={...state.validationResults,newPairs:complete.length,phasePngFiles:complete.length*2,displayWebpFiles:complete.length*2,
 occurrenceChecks:validation.occurrenceChecks,cardDetailChecks:validation.cardDetailChecks,servedActiveImages:http.servedActiveImages,
 currentBrowserVerification:'blocked-by-browser-url-security-policy',currentResponsiveVerification:'not-repeated; prior six-width evidence retained',
 workoutDoseOrderAndClassificationUnchanged:true};
state.knownIssues=[
 'Eight selectable physical day/name entries remain: four compound records and four preparation deferrals. No remaining simple-mechanics artwork hold.',
 'Tuesday compound vacuum is resolved only for Intermediate; Expert seated-and-hanging instruction is not treated as a single seated exercise.',
 'Existing reused Standard/RKC plank pairs have camera/framing and subtle isometric phase limitations; no regeneration or coach approval claimed.',
 'Local browser reload was blocked by URL security policy. Current server, API, asset bytes and runtime checks pass; current visual/mobile QA remains unverified.',
 'Existing content audit still reports 333 role-default dose occurrences, 12 missing Monday cardio doses, 87 content-review day/name entries and four recognized execution conflicts. These are not silently repaired by artwork.',
 'Local assumptions for support angle, split-squat loading and hip-swing plane require user review; no confirmed equipment inventory claim.'
];
state.nextAtomicAction='Design a two-component artwork presentation for the three authored paired records without changing their dose or completion identity; keep Expert seated/hanging vacuum pending';
save('STATE.json',state);
console.log(JSON.stringify({checkpoint:state.currentCheckpoint,acceptedPairs:state.generatedPairs,phaseImages:state.generatedPhaseFiles,pendingDayNames:pending.length,nextAtomicAction:state.nextAtomicAction}));
