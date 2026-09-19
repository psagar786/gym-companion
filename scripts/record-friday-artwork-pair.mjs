import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(); const dir=path.join(root,'.codex/v541/artwork-v3/friday');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'GENERATION-MANIFEST.json'),'utf8'));
const state=JSON.parse(fs.readFileSync(path.join(dir,'STATE.json'),'utf8'));
const id=process.argv[2]; if(!id) throw new Error('movement id required');
const entry=manifest.generationQueue.find(x=>x.canonicalMovementId===id); if(!entry) throw new Error(`unknown movement ${id}`);
const hash=p=>{const b=fs.readFileSync(path.join(root,p)); return {width:b.readUInt32BE(16),height:b.readUInt32BE(20),sha256:crypto.createHash('sha256').update(b).digest('hex')};};
const start=hash(entry.outputPaths.start), movement=hash(entry.outputPaths.movement);
if(start.width!==512||start.height!==512||movement.width!==512||movement.height!==512) throw new Error('pair must be 512x512');
if(start.sha256===movement.sha256) throw new Error('start and movement hashes identical');
entry.status='generated'; entry.generationStatus='complete'; entry.technicalReviewStatus='pass'; entry.semanticReviewStatus='ai-review-pass'; entry.outputHashes={start,movement}; entry.pairReview={status:'technical-and-semantic-pass',humanCoachReviewStatus:'pending'};
fs.writeFileSync(path.join(dir,'GENERATION-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
if(!state.completedMovementIds.includes(id)){state.completedMovementIds.push(id);state.completedSets=state.completedMovementIds.length;state.completedFiles=state.completedSets*2;state.remainingSets=state.newGenerationSets-state.completedSets;state.remainingFiles=state.remainingSets*2;}
state.currentMovementId=null; state.currentPhase=null; state.currentCheckpoint=`V541-FRI-${id}-PAIR-COMPLETE`; state.nextAtomicAction=state.remainingSets?`Generate Start for next Friday movement (${state.remainingSets} pairs remaining)`:'Run Friday runtime integration and local validation';
fs.writeFileSync(path.join(dir,'STATE.json'),JSON.stringify(state,null,2)+'\n');
fs.appendFileSync(path.join(dir,'VALIDATION.md'),`\n- ${id}: technical dimensions/hash check passed; AI semantic review recorded; human gym-coach review pending.\n`);
console.log(`Recorded ${id}: ${state.completedSets}/${state.newGenerationSets} pairs complete.`);
