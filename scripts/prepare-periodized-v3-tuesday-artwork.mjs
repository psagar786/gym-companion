import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = path.join(root, '.codex/v541/artwork-v3/tuesday');
fs.mkdirSync(outDir, { recursive: true });

const context = { window: {} };
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js', 'data/v53-content.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;
const tendon = context.window.GYM_COMPANION_V53_CONTENT?.tendon?.[1];
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const idFor = (item, alternative = false) => alternative ? `periodized-${slug(item.name)}` : (item.stableMovementId || `periodized-${slug(item.name)}`);

const reuseMap = {
  'periodized-lying-floor-leg-raise': { canonicalMovementId: 'periodized-floor-leg-raise', source: 'Monday V3', reason: 'Same lying floor straight-leg raise mechanics.' },
  'periodized-leg-raise': { canonicalMovementId: 'periodized-floor-leg-raise', source: 'Monday V3', reason: 'Normalized generic Leg Raise to the lying floor variation in this option list.' },
  'periodized-hanging-leg-raise': { canonicalMovementId: 'biweekly-hanging-straight-leg-raise', source: 'Monday V3', reason: 'Explicitly normalized to straight-leg hanging raise.' },
  'periodized-incline-reverse-crunch': { canonicalMovementId: 'periodized-incline-reverse-crunch', source: 'Monday V3', reason: 'Exact incline reverse-crunch mechanics.' },
  'biweekly-incline-walk': { canonicalMovementId: 'biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9', source: 'Monday V3', reason: 'Treadmill walking posture is unchanged; pace/incline remain prescription text.' }
};

const aliases = {
  'periodized-stick-russian-twists': 'biweekly-stick-seated-russian-twists',
  'periodized-light-db-side-bend': 'periodized-db-side-bend',
  'periodized-stick-side-bends': 'biweekly-stick-standing-lateral-side-bends',
  'periodized-lying-supine-vacuum': 'periodized-lying-vacuum',
  'periodized-decline-bench-weighted-crunch': 'biweekly-decline-bench-weighted-crunch',
  'periodized-kneeling-cable-rope-crunch': 'biweekly-kneeling-cable-rope-crunch',
  'biweekly-stick-standing-overhead-side-stretch': 'biweekly-stick-overhead-side-stretch',
  'biweekly-stick-spinal-twist': 'biweekly-stick-standing-torso-twists',
  'biweekly-stick-overhead-side-bends': 'biweekly-stick-overhead-side-stretch'
};

const specs = {
  'biweekly-stick-seated-russian-twists': ['Sit on a mat with knees bent, feet lightly planted, torso tall, and both hands holding a light stick across the chest.', 'Rotate the ribcage and stick toward one hip while keeping the pelvis steady; return through center without swinging.', 'Stick across chest; feet grounded for the base version; rotate from the trunk, not the arms.'],
  'biweekly-lying-pelvic-tilt-leg-raise': ['Lie supine on a mat, legs straight together, hands beside the hips, and lower back gently connected to the floor.', 'Tilt the pelvis posteriorly and raise the straight legs to a comfortable height without arching the lower back; lower with control.', 'Legs together and straight; no momentum or lumbar arch.'],
  'biweekly-cable-pallof-press-with-iso-hold': ['Stand side-on to a cable at sternum height, feet shoulder-width, handle at the chest, ribs stacked over pelvis.', 'Press the handle straight forward and hold while resisting trunk rotation; return the handle to the chest slowly.', 'Cable handle at sternum height; square hips and shoulders; press directly away from the stack.'],
  'biweekly-stick-standing-lateral-side-bends': ['Stand tall with a light stick across the upper back, feet hip-width, and ribs stacked over the pelvis.', 'Bend the trunk sideways without rotating or shifting the hips; return to upright under control.', 'Stick across traps for the base movement; keep both feet planted.'],
  'biweekly-kneeling-cable-rope-crunch': ['Kneel facing a high cable with the rope beside the ears, hips under the torso, and spine long.', 'Curl the ribs toward the pelvis by flexing the spine; pause the abdominal contraction, then re-extend slowly.', 'Rope beside ears; hips stay over knees; movement comes from the trunk.'],
  'biweekly-standing-cable-woodchopper-high-to-low': ['Stand side-on to a high cable with both hands near the outside shoulder, feet staggered, and knees softly bent.', 'Pull the handle diagonally down toward the opposite hip while rotating the trunk and pivoting the rear foot slightly; return along the same path.', 'High pulley to opposite hip; rotate as one unit without yanking with the arms.'],
  'periodized-hanging-knee-raise': ['Hang from a fixed pull-up bar with shoulders active, arms straight, knees bent about 90 degrees, and pelvis neutral.', 'Curl the pelvis and draw both knees toward the chest without swinging; lower until the legs hang quietly.', 'Shoulder-width overhand grip; bent knees; no kipping or behind-the-body swing.'],
  'biweekly-half-kneeling-cable-pallof-press-with-overhead-raise': ['Kneel with the inside knee down beside a cable at sternum height, handle at the chest, glute lightly engaged, and ribs stacked.', 'Press the handle forward, then raise the straight arms overhead while resisting rotation; lower and return to the chest.', 'Half-kneeling stance; cable pulls sideways; overhead path stays in front of the face.'],
  'biweekly-side-plank-hip-dips-with-rotation': ['Set the lower elbow under the shoulder in a side plank with feet stacked or staggered and the top arm reaching upward.', 'Lower the hip a few centimetres, lift back to a straight line, then rotate the top arm under the ribs without collapsing the shoulder.', 'Forearm vertical; hips stay lifted; rotation comes from the trunk.'],
  'biweekly-decline-bench-weighted-crunch': ['Secure the ankles on a decline bench, hold a light plate at the chest, and lie back with the pelvis neutral.', 'Curl the ribs toward the pelvis while keeping the plate against the chest; pause, then lower the spine to the bench slowly.', 'Decline bench and plate on chest; do not pull the head or throw the torso forward.'],
  'periodized-cable-russian-twist': ['Sit facing away from a low cable with knees bent, feet supported, torso slightly reclined, and both hands holding the handle at the chest.', 'Rotate the ribcage and handle toward one side while the pelvis stays quiet; return through center and alternate.', 'Low cable at chest height; rotate the trunk, not just the shoulders.'],
  'periodized-floor-bodyweight-twist': ['Sit on a mat with knees bent and feet planted, torso tall and hands together at the chest.', 'Rotate the ribcage toward one hip without collapsing the spine; return to center and alternate sides.', 'Bodyweight only; keep the feet grounded and range comfortable.'],
  'periodized-medicine-ball-twists': ['Sit with knees bent and feet grounded, holding one medicine ball at the chest with the torso slightly reclined.', 'Move the ball beside one hip by rotating the trunk while keeping the spine long; return to center and alternate.', 'Medicine ball stays close to the torso; no throwing or lumbar rounding.'],
  'periodized-bench-reverse-crunch': ['Lie on a flat bench with hands gripping the sides, hips near the edge, knees bent and shins parallel to the floor.', 'Curl the pelvis toward the ribs to lift the hips slightly from the bench; lower the pelvis slowly without swinging the legs.', 'Hands stabilize the bench; movement is a pelvic curl, not a leg swing.'],
  'periodized-side-plank-hold': ['Set the forearm under the shoulder with legs extended and body in one straight line, or use the lower knee for support.', 'Lift the hips and hold a rigid side plank while breathing normally; lower with control after the hold.', 'Elbow under shoulder; hips high; do not rotate or shrug.'],
  'periodized-db-suitcase-carry': ['Stand tall holding one dumbbell at the side, feet hip-width, shoulders level and ribs stacked.', 'Walk slowly while resisting side-bending and keeping the dumbbell close to the thigh; stop and lower it under control.', 'One dumbbell only; short even steps; no leaning toward or away from the load.'],
  'periodized-db-side-bend': ['Stand tall holding one dumbbell in one hand with feet hip-width and the free hand on the ribs.', 'Bend slightly toward the unloaded side while keeping the chest facing forward, then pull the ribs back to vertical.', 'One dumbbell; hips stay still; small pain-free lateral range.'],
  'periodized-side-plank-hip-dips': ['Set the lower elbow under the shoulder in a side plank with feet stacked or the lower knee down.', 'Lower the hip toward the floor a short distance, then drive it back to the straight-line plank position.', 'Forearm vertical; shoulders and hips remain stacked.'],
  'periodized-cable-side-crunch': ['Stand side-on to a high cable with the handle near the temple, feet stable and torso long.', 'Shorten the side of the trunk to bring the ribs toward the hip against the cable; return slowly without rotating.', 'Cable remains above and to the side; hips stay square.'],
  'periodized-lying-vacuum': ['Lie supine with knees bent, feet on the mat, arms relaxed and lower back neutral.', 'Exhale gently, draw the lower abdomen inward without lifting the ribs or pelvis, and hold the brace before releasing slowly.', 'Quiet breathing and mild abdominal draw-in; no breath-holding or forced hollowing.'],
  'periodized-incline-bench-plank-vacuum': ['Place forearms on an incline bench, step back into a straight-body plank and keep the pelvis neutral.', 'Exhale and gently draw the lower abdomen inward while maintaining the plank line; release without dropping the hips.', 'Forearms supported on the bench; brace without holding the breath.'],
  'periodized-cat-cow-vacuum': ['Start on hands and knees with wrists under shoulders, knees under hips, and spine neutral.', 'Exhale into a gentle abdominal draw-in as the spine moves through a small comfortable flexion; return to neutral without forcing the arc.', 'Small pain-free spinal range; abdomen stays active while breathing.'],
  'periodized-stability-ball-crunch': ['Sit on a stability ball and walk the feet forward until the mid-back is supported, knees bent and hands lightly behind the head.', 'Curl the ribs toward the pelvis while the ball supports the back; lower until the spine lengthens over the ball.', 'Stability ball fully visible; hands guide the head but do not pull the neck.'],
  'periodized-floor-crunch': ['Lie supine with knees bent, feet planted and fingertips behind the head without interlocking or pulling.', 'Lift the shoulder blades by curling the ribs toward the pelvis; lower until the upper back returns to the mat.', 'Feet stay grounded; small trunk curl; neck remains relaxed.'],
  'periodized-dumbbell-woodchopper': ['Stand with feet staggered holding one dumbbell near the outside shoulder, knees soft and trunk braced.', 'Rotate and guide the dumbbell diagonally down toward the opposite hip, then return along the same controlled arc.', 'Dumbbell travels diagonally; pivot the feet slightly instead of wrenching the knees.'],
  'periodized-standard-pallof-press': ['Stand side-on to a cable at sternum height with feet shoulder-width and handle held at the chest.', 'Press the handle straight forward, pause while resisting rotation, and return it to the chest without shifting the hips.', 'Cable at sternum height; square shoulders and hips; no trunk twist.'],
  'periodized-quadruped-vacuum': ['Start on hands and knees with a neutral spine, hands under shoulders and knees under hips.', 'Exhale and gently draw the abdomen upward and inward while keeping the spine still; release gradually.', 'Maintain neutral spine and normal breathing; no rib flare or pelvic tuck.'],
  'periodized-plank-vacuum': ['Set a forearm plank with elbows under shoulders, legs straight and body in one line.', 'Exhale and draw the lower abdomen inward while maintaining the plank; release without sagging the hips.', 'Brace without breath-holding; keep the pelvis neutral.'],
  'biweekly-stick-standing-torso-twists': ['Stand with feet hip-width and a light stick across the chest, elbows relaxed and pelvis facing forward.', 'Rotate the ribcage a small distance to one side while the hips stay quiet; return through center and alternate.', 'Stick across chest; controlled thoracic rotation; no forced range.'],
  'biweekly-stick-overhead-side-stretch': ['Stand tall holding a light stick overhead with hands wider than shoulders and feet grounded.', 'Reach upward and lean gently to one side without rotating the chest; return upright before switching sides.', 'Stick overhead; side bend only in a comfortable range; ribs stay controlled.'],
  'biweekly-stick-high-knee-marches': ['Stand tall holding a light stick across the shoulders or overhead, feet hip-width and posture upright.', 'March one knee toward hip height while the opposite foot stays stable, lower it quietly and alternate sides.', 'Stick remains stable; pelvis level; no hopping or leaning.'],
  'biweekly-cobra-pose': ['Lie prone with hands beside the lower ribs, legs extended and tops of the feet on the mat.', 'Press lightly through the hands to lift the chest into a comfortable spinal extension while the pelvis stays heavy; lower slowly.', 'Elbows remain soft and close; stop before lumbar pinching.']
};

function allTuesdayRows() {
  const rows = [];
  for (const day of plan.days || []) {
    if (day.dayName !== 'Tuesday' || !['A', 'B', 'C'].includes(day.weekKey)) continue;
    const add = (role, item, alternative = false, variationLabel = null) => rows.push({
      weekKey: day.weekKey, role, variationLabel, name: item.name,
      runtimeId: idFor(item, alternative), equipment: item.equipment || null,
      equipmentStatus: item.equipmentStatus || null,
      sourceRows: item.sourceSheetRows || (item.sourceSheetRow != null ? [item.sourceSheetRow] : []),
      prescriptions: item.prescriptions || null
    });
    for (const item of day.coreSlots || []) {
      add('core', item);
      (item.alternatives || []).forEach((name, i) => add('alternative', { ...item, name }, true, i === 0 ? 'Alternative' : i === 1 ? 'Option 2' : `Option ${i + 1}`));
    }
    for (const item of day.warmup || []) add('warmup', item);
    for (const item of day.cardio || []) add('cardio', item);
    for (const item of day.recovery || []) add('recovery', item);
  }
  if (tendon) rows.push({ weekKey: 'A/B/C', role: 'tendon', name: tendon.name, runtimeId: `tendon-${slug(tendon.name)}`, equipment: tendon.equipment, equipmentStatus: 'deferred-tendon-review', sourceRows: [] });
  return rows;
}

const occurrences = allTuesdayRows();
const byRuntime = new Map();
for (const row of occurrences) {
  if (!byRuntime.has(row.runtimeId)) byRuntime.set(row.runtimeId, { ...row, weekKeys: [], roles: [], mappedRuntimeIds: [] });
  const item = byRuntime.get(row.runtimeId);
  if (!item.weekKeys.includes(row.weekKey)) item.weekKeys.push(row.weekKey);
  if (!item.roles.includes(row.role)) item.roles.push(row.role);
  item.mappedRuntimeIds.push(row.runtimeId);
}

const canonical = [];
for (const row of byRuntime.values()) {
  if (row.role.includes('tendon')) continue;
  const alias = aliases[row.runtimeId];
  if (alias) continue;
  if (row.runtimeId === 'biweekly-transverse-abdominis-stomach-vacuum') continue;
  const reuse = reuseMap[row.runtimeId];
  if (reuse) continue;
  const spec = specs[row.runtimeId];
  const split = row.runtimeId === 'biweekly-standing-seated-transverse-abdominis-stomach-vacuum'
    ? [
      { id: 'periodized-standing-stomach-vacuum', name: 'Standing Stomach Vacuum', detail: ['Stand tall with feet hip-width and hands resting lightly on the thighs.', 'Exhale and draw the lower abdomen inward while keeping the ribs and pelvis stacked; release while breathing normally.', 'Upright stance; gentle abdominal draw-in; no breath-holding.'] },
      { id: 'periodized-seated-stomach-vacuum', name: 'Seated Stomach Vacuum', detail: ['Sit tall with feet grounded, hands on thighs and spine neutral.', 'Exhale and draw the lower abdomen inward without rounding the back; release gradually while breathing normally.', 'Seated neutral spine; gentle effort; stop if light-headed.'] }
    ]
    : row.runtimeId === 'biweekly-intervals'
      ? [
        { id: 'periodized-elliptical-intervals', name: 'Elliptical Intervals', detail: ['Stand on the elliptical with feet centered on the pedals, hands lightly on the moving handles and torso upright.', 'Drive the pedals and handles in a controlled interval effort while keeping the knees tracking forward; ease down smoothly.', 'Elliptical machine; light hands; upright posture and conversational recovery between efforts.'] },
        { id: 'periodized-bike-sprint-intervals', name: 'Stationary Bike Sprint Intervals', detail: ['Sit on a stationary bike with the saddle set so the knee remains softly bent at the bottom and hands relaxed on the bars.', 'Accelerate the pedals for the work interval while keeping the torso stable, then reduce resistance and cadence for recovery.', 'Stationary bike; seated posture; never sprint out of the saddle for this record.'] }
      ]
      : [{ id: row.runtimeId, name: row.name, detail: spec }];
  for (const part of split) {
    const detail = part.detail;
    canonical.push({
      canonicalMovementId: part.id,
      name: part.name,
      roles: row.roles,
      weekKeys: row.weekKeys,
      sourceRows: row.sourceRows,
      equipment: part.id === 'periodized-standing-stomach-vacuum' || part.id === 'periodized-seated-stomach-vacuum' ? 'Bodyweight / floor' : row.equipment,
      equipmentStatus: row.equipmentStatus,
      startPose: detail?.[0] || null,
      movementPose: detail?.[1] || null,
      gripStance: detail?.[2] || null,
      mappedRuntimeIds: [row.runtimeId],
      outputPaths: {
        start: `assets/exercises/periodized-v3/${part.id}-v3-start.png`,
        movement: `assets/exercises/periodized-v3/${part.id}-v3-movement.png`
      },
      generationStatus: detail ? 'not-started' : 'needs-content-clarification',
      athlete: 'adult male; fixed identity across Start and Movement',
      promptVersion: 'fitness7-scientific-v3-male-tuesday'
    });
  }
}

const aliasEntries = Object.entries(aliases).map(([runtimeId, canonicalMovementId]) => ({ runtimeId, canonicalMovementId, status: 'share-exact-mechanics' }));
const reuseEntries = Object.entries(reuseMap).map(([runtimeId, value]) => ({ runtimeId, ...value, status: 'reuse-approved-monday-v3' }));
const audit = {
  schemaVersion: 'fitness7-tuesday-v3-audit-v1', generatedAt: new Date().toISOString(), plan: 'periodized-abc', day: 'Tuesday', weekKeys: ['A', 'B', 'C'],
  counts: { rawRuntimeIdentities: byRuntime.size, occurrenceRows: occurrences.length, canonicalSets: canonical.length + new Set(reuseEntries.map(entry => entry.canonicalMovementId)).size + 1, mondayReuseRuntimeMappings: reuseEntries.length, mondayReuseSets: new Set(reuseEntries.map(entry => entry.canonicalMovementId)).size, newGenerationSets: canonical.length, newGenerationFiles: canonical.length * 2, deferredTendonSets: 1, authoredOptionalSets: 0 },
  roleCounts: Object.fromEntries([...new Set(occurrences.map(r => r.role))].map(role => [role, new Set(occurrences.filter(r => r.role === role).map(r => r.runtimeId)).size])),
  occurrences,
  aliases: aliasEntries,
  mondayReuse: reuseEntries,
  generationQueue: canonical,
  deferred: [{ runtimeId: 'tendon-wrist-flexor-isometric', reason: 'User will provide tendon research before artwork/content changes.' }]
};

const manifest = { schemaVersion: 'fitness7-tuesday-v3-generation-v1', generatedAt: audit.generatedAt, plan: 'periodized-abc', day: 'Tuesday', weekKeys: ['A', 'B', 'C'], assetModel: 'male-only Start + Movement pair', promptVersion: 'fitness7-scientific-v3-male-tuesday', totalSets: canonical.length, totalFiles: canonical.length * 2, movements: canonical };
const state = { project: 'Fitness 7 V5.4.1 Tuesday V3 Artwork', branch: 'codex/v541-v2-art-integration', day: 'Tuesday', weekKeys: ['A', 'B', 'C'], rawRuntimeIdentities: byRuntime.size, canonicalSets: audit.counts.canonicalSets, mondayReuseSets: audit.counts.mondayReuseSets, mondayReuseRuntimeMappings: audit.counts.mondayReuseRuntimeMappings, newGenerationSets: canonical.length, newGenerationFiles: canonical.length * 2, deferredTendonSets: 1, completedSets: 0, completedFiles: 0, currentBatch: 'B01', currentMovementId: null, currentPhase: null, failedMovementIds: [], completedMovementIds: [], lastCompletedCommit: '', currentCheckpoint: 'V541-TUE-00-AUDIT-FROZEN', nextAtomicAction: 'Review and approve the first six locked Tuesday movement specifications' };
fs.writeFileSync(path.join(outDir, 'AUDIT.json'), `${JSON.stringify(audit, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'GENERATION-MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'REUSE-MAP.json'), `${JSON.stringify({ aliases: aliasEntries, mondayReuse: reuseEntries }, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'STATE.json'), `${JSON.stringify(state, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'VALIDATION.md'), '# Tuesday V3 artwork validation\n\nAudit frozen. No Tuesday assets have been generated or integrated.\n\n- Technical review: pending\n- Semantic review: pending\n- Human gym-coach approval: pending\n- Tendon artwork: deferred pending user research\n');
fs.writeFileSync(path.join(outDir, 'REPAIR-QUEUE.md'), '# Tuesday V3 repair queue\n\nNo failed pairs yet.\n');
console.log(JSON.stringify(audit.counts, null, 2));
