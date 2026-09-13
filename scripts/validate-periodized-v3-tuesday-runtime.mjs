import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const context = { window: {} };
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js', 'data/periodized-v3-monday-artwork.js', 'data/periodized-v3-tuesday-artwork.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;
const tuesday = context.window.GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK;
const monday = context.window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK;
const slugify = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const failures = [];
const mapped = new Set();

function lookup(runtimeId) {
  const mapping = tuesday.runtimeMap?.[runtimeId];
  if (mapping) {
    if (tuesday.movements?.[mapping.canonicalMovementId]) return true;
    if (monday.movements?.[mapping.canonicalMovementId]) return true;
  }
  return false;
}
function check(runtimeId, label) {
  if (!lookup(runtimeId)) failures.push(label + ': ' + runtimeId);
  else mapped.add(runtimeId);
}
function resolved(item, tier) {
  const name = String(item?.name || '').toLowerCase();
  if (name === 'transverse abdominis stomach vacuum') {
    return tier === 'expert' ? 'periodized-standing-stomach-vacuum' : tier === 'intermediate' ? 'periodized-quadruped-vacuum' : 'periodized-lying-vacuum';
  }
  if (name === 'intervals') {
    return tier === 'expert' ? 'periodized-bike-sprint-intervals' : tier === 'intermediate' ? 'biweekly-incline-walk' : 'periodized-elliptical-intervals';
  }
  return item?.stableMovementId || item?.id;
}

for (const weekKey of ['A', 'B', 'C']) {
  const day = plan.days.find(item => item.weekKey === weekKey && item.dayIndex === 1);
  if (!day) { failures.push('missing Tuesday ' + weekKey + ' record'); continue; }
  for (const tier of ['beginner', 'intermediate', 'expert']) {
    for (const raw of [...(day.coreSlots || []), ...(day.cardio || []), ...(day.warmup || []), ...(day.recovery || [])]) {
      const runtimeId = resolved(raw, tier);
      if (raw.role === 'tendon') continue;
      check(runtimeId, weekKey + '/' + tier + '/' + raw.name);
    }
    for (const slot of day.coreSlots || []) {
      for (const name of slot.alternatives || []) check('periodized-' + slugify(name), weekKey + '/' + tier + '/alternative/' + name);
    }
  }
}

const statePath = path.join(root, '.codex/v541/artwork-v3/tuesday/STATE.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
state.validation = { ...(state.validation || {}), runtime: { status: failures.length ? 'fail' : 'pass', mappedRuntimeIds: mapped.size, failures } };
if (!failures.length) {
  state.currentCheckpoint = 'V541-TUE-RUNTIME-MAPPED';
  state.nextAtomicAction = 'Start the local Tuesday A/B/C browser review';
}
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
const report = '\n## Runtime mapping validation (' + new Date().toISOString() + ')\n\n- Tuesday A/B/C tiers checked: 3 weeks × 3 tiers\n- Explicit runtime mappings resolved: ' + mapped.size + '\n- Status: **' + (failures.length ? 'FAIL' : 'PASS') + '**\n' + (failures.length ? '\n### Unresolved identities\n' + failures.map(item => '- ' + item).join('\n') + '\n' : '');
fs.appendFileSync(path.join(root, '.codex/v541/artwork-v3/tuesday/VALIDATION.md'), report);
if (failures.length) { console.error(report); process.exitCode = 1; } else console.log(report);
