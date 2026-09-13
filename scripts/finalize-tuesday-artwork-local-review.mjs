import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const statePath = path.join(root, '.codex/v541/artwork-v3/tuesday/STATE.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
state.currentBatch = 'B06';
state.completedSets = 36;
state.completedFiles = 72;
state.remainingSets = 0;
state.remainingFiles = 0;
state.currentCheckpoint = 'V541-TUE-ART-LOCAL-REVIEW';
state.nextAtomicAction = 'Review Tuesday Week C in the browser, then collect any requested repair notes';
state.lastCompletedCommit = '';
state.validation = { ...(state.validation || {}), localReview: { status: 'ready-for-user-review', browserUrl: 'http://localhost:4190/?qa=tuesday-v3&week=A', weeks: ['A', 'B', 'C'], note: 'Technical and runtime checks passed; human gym-coach approval remains pending.' } };
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
fs.appendFileSync(path.join(root, '.codex/v541/artwork-v3/tuesday/VALIDATION.md'), '\n## Local review checkpoint\n\n- Status: V541-TUE-ART-LOCAL-REVIEW\n- Preview: http://localhost:4190/?qa=tuesday-v3&week=A (switch the week query to B or C for the other QA views)\n- Monday V3 assets remain unchanged.\n- Tendon artwork remains deferred as requested.\n- Human gym-coach approval remains a separate pending step.\n');
console.log('Saved V541-TUE-ART-LOCAL-REVIEW.');
