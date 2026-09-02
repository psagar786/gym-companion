/*
 * Fitness 7 periodized activity source.
 *
 * The Google Sheet remains the reviewed content reference. This runtime
 * adapter deliberately keeps the source rows intact, normalises day-level
 * targets to movement-level targets, and exposes the agreed four-week cadence:
 * A -> B -> A -> C. Week C is the once-monthly foundation/strength week.
 */
(() => {
  'use strict';

  const source = window.GYM_COMPANION_BIWEEKLY_ROUTINE || { days: [] };
  const clone = value => JSON.parse(JSON.stringify(value));
  const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const excluded = /captain|band(?:ed|s)?|trap[- ]bar|hack squat|swiss ball|seated leg curl|cable (?:standing )?hip abduction|cuffed cable|pec[- ]deck|dip machine|machine chest press|barbell hip thrust|ab wheel/i;
  const targetGroups = name => {
    const text = String(name || '').toLowerCase();
    const groups = new Set();
    if (/chest|press|fly|pec|push-up/.test(text)) groups.add('chest');
    if (/lat|pulldown|pull-up|row|pullover|rear.?delt|back extension|hyperextension/.test(text)) groups.add('back');
    if (/curl|biceps|hammer|forearm|wrist|triceps|pressdown|extension/.test(text)) groups.add('arms');
    if (/shoulder|scap|lateral raise|rotator|around-the-world|thoracic/.test(text)) groups.add('shoulders');
    if (/squat|lunge|leg|rdl|deadlift|hinge|glute|hamstring|calf|tibialis|abductor|adductor|poliquin|monster/.test(text)) groups.add('legs');
    if (/abs|core|plank|crunch|knee raise|pallof|vacuum|oblique|woodchop|trunk/.test(text)) groups.add('core');
    if (/walk|bike|cardio|treadmill|interval/.test(text)) groups.add('cardio');
    if (/stretch|mobility|rotation|warm|prep|activation|drill|stick|pose|rock|circle/.test(text)) groups.add('mobility');
    if (!groups.size) groups.add('mobility');
    return [...groups];
  };
  const isExcluded = item => excluded.test(`${item?.name || ''} ${item?.equipment || ''}`);
  const normaliseMovement = (item, weekKey, dayIndex, roleOverride) => {
    const next = clone(item);
    const replacements = {
      'Seated Leg Curl Machine': 'Lying Leg Curl',
      'Pec Deck Machine': 'Cable Fly',
      'Cuffed Cable Rear-Delt Fly': 'Incline Dumbbell Reverse Fly',
      'Barbell Hip Thrust': 'Glute Bridge',
      'Seated Machine Chest Press': 'Incline Dumbbell Press',
      "Captain's Chair Knee": 'Hanging Knee Raise',
      'Trap Bar Deadlift': 'Romanian Deadlift',
      'Hack Squat Machine': 'Leg Press',
      'Ab Wheel Rollout from Knees': 'Dead Bug',
      'Conventional': 'Conventional Deadlift'
    };
    const replacedName = replacements[next.name];
    if (replacedName) next.name = replacedName;
    if (/^Stick\b/i.test(next.name)) next.equipment = 'Light stick or empty-hand range';
    if (replacedName) {
      const catalogItem = window.GYM_COMPANION_TRAINING?.catalog?.find(candidate => candidate.name === next.name);
      if (catalogItem?.image_path) {
        next.image = catalogItem.image_path;
        next.imageSet = { move: catalogItem.image_path };
      } else {
        next.image = undefined;
        next.imageSet = {};
      }
    }
    next.weekKey = weekKey;
    next.dayIndex = dayIndex;
    next.role = roleOverride || next.role;
    next.stableMovementId = replacedName ? `periodized-${slug(next.name)}` : (next.stableMovementId || `periodized-${slug(next.name)}`);
    next.targetGroups = targetGroups(next.name);
    next.primaryTargets = next.targetGroups.filter(group => group !== 'mobility' && group !== 'cardio').slice(0, 2);
    next.secondaryTargets = next.targetGroups.filter(group => !next.primaryTargets.includes(group));
    next.equipmentStatus = isExcluded(item) ? 'Review before use · source equipment excluded; approved substitute shown' : (next.equipmentStatus || 'Review source sheet');
    next.sourceSheetRows = [...new Set([...(next.sourceSheetRows || []), next.sourceSheetRow].filter(Boolean))];
    next.sourceVersion = 'periodized-abc-v1';
    return next;
  };
  const normaliseDay = (day, weekKey, dayIndex, foundation = false) => {
    const next = clone(day);
    next.weekKey = weekKey;
    next.dayIndex = dayIndex;
    next.dayName = day.dayName || ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][dayIndex];
    next.focus = foundation ? `${day.focus.split('·')[0].trim()} · Foundation strength & support` : day.focus;
    next.targetGroups = [...new Set((next.coreSlots || []).flatMap(item => targetGroups(item.name)).filter(group => !['mobility','cardio'].includes(group)))];
    next.coreSlots = (next.coreSlots || []).map(item => {
      const movement = normaliseMovement(item, weekKey, dayIndex, 'core');
      if (foundation) {
        movement.prescriptions = {
          beginner: '3 Sets x 8–10 Reps | Rest: 120s | Focus: stable technique, 3 RIR',
          intermediate: '4 Sets x 5–8 Reps | Rest: 150s | Focus: controlled strength, 1–2 RIR',
          advanced: '4 Sets x 4–6 Reps | Rest: 180s | Focus: crisp strength reps, about 1 RIR'
        };
      }
      movement.alternatives = (movement.alternatives || []).filter(name => !excluded.test(name));
      return movement;
    });
    next.optionalSlots = (next.optionalSlots || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'optional')).filter(item => !isExcluded(item));
    next.warmup = (next.warmup || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'warmup'));
    next.recovery = (next.recovery || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'recovery'));
    next.cardio = (next.cardio || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'cardio'));
    return next;
  };

  const sourceA = source.days.filter(day => day.weekKey === 'A');
  const sourceB = source.days.filter(day => day.weekKey === 'B');
  const byIndex = (list, index) => list.find(day => day.dayIndex === index) || sourceA.find(day => day.dayIndex === index);
  const weeks = ['A', 'B', 'A', 'C'];
  const days = [];
  weeks.forEach((weekKey, cycleIndex) => {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const base = byIndex(weekKey === 'B' ? sourceB : sourceA, dayIndex);
      if (!base) continue;
      const record = normaliseDay(base, weekKey, dayIndex, weekKey === 'C');
      record.cycleIndex = cycleIndex;
      days.push(record);
    }
  });

  window.GYM_COMPANION_PERIODIZED_ABC = {
    key: 'periodized-abc',
    planVersion: 'periodized-abc-v1',
    name: 'Periodized A-B-A-C Activity',
    sourceSheet: 'Fitness 7 V5 — Optimized Master Workout Plan · 3-Week Periodized Plan (A-B-C)',
    cadence: ['A', 'B', 'A', 'C'],
    anchorDate: '2026-08-31',
    defaultTier: 'intermediate',
    days,
    excludedEquipment: ['Captain’s chair', 'Banded Pallof press', 'Banded monster walks', 'Trap bar RDL', 'Cable hip abduction', 'Hack squat', 'Swiss-ball leg curl', 'Seated leg curl', 'Barbell hip thrust', 'Machine chest press', 'Ab wheel'],
    notes: 'Week C is a once-monthly foundation and strength-support week. Review-before-use equipment remains visible in the workbook but is not auto-approved for member activation.'
  };
})();
