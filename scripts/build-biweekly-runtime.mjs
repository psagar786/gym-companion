import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const rows = JSON.parse(await fs.readFile(path.join(root, 'data/biweekly-plan-source.json'), 'utf8'));
const [headers, ...sourceRows] = rows;

const slugify = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const stableId = name => `biweekly-${slugify(name)}`;
const asset = name => `assets/exercises/biweekly/${stableId(name)}.png`;
const phaseAsset = (name, phase) => `assets/exercises/biweekly/${stableId(name)}-phase-${phase}.png`;
const splitPipe = value => String(value || '').split('|').map(item => item.trim()).filter(item => item && item !== '-');
const weekDay = value => { const match = String(value).match(/Week ([AB]) - Day (\d+)/); return match ? { weekKey: match[1], dayIndex: Number(match[2]) - 1 } : null; };
const focusByDay = {
  0: 'Pull A · Chest + Back + Biceps',
  1: 'Push A · Core + Cardio',
  2: 'Legs A · Glutes + Hamstrings + Calves',
  3: 'Pull B · Shoulders + Back + Chest',
  4: 'Push B · Core + Conditioning',
  5: 'Legs B · Glutes + Back + Core',
  6: 'Active Rest · Walk + Mobility'
};
const targetGroups = focus => {
  const text = String(focus).toLowerCase();
  const groups = new Set();
  if (/chest|pec|press|fly/.test(text)) groups.add('chest');
  if (/back|lat|row|pulldown|pullover|trap|shoulder/.test(text)) groups.add('back');
  if (/biceps|curl|arm/.test(text)) groups.add('biceps');
  if (/triceps/.test(text)) groups.add('triceps');
  if (/shoulder|delt|overhead/.test(text)) groups.add('shoulders');
  if (/leg|glute|hamstring|calf|squat|lunge|deadlift|hip/.test(text)) groups.add('legs');
  if (/core|abs|oblique|cardio|interval|vacuum|crunch|plank/.test(text)) groups.add('core');
  return [...groups];
};
const equipment = name => {
  const text = String(name).toLowerCase();
  if (/foam roller/.test(text)) return 'Foam roller';
  if (/band|dislocate/.test(text)) return 'Resistance band / stick';
  if (/treadmill|incline walk/.test(text)) return 'Treadmill';
  if (/bike|cycle|elliptical|cross-trainer|rower/.test(text)) return 'Cardio machine';
  if (/cable|pulldown|woodchopper|pallof|face pull|pressdown|fly/.test(text)) return 'Cable station';
  if (/machine|pec deck|hack squat|leg press|adductor|abductor|leg curl|calf raise/.test(text)) return 'Gym machine';
  if (/barbell|barbell|smith|trap bar|ez-bar/.test(text)) return 'Barbell / rack';
  if (/dumbbell|db|goblet|kettlebell|plate/.test(text)) return 'Dumbbells / load';
  if (/hanging|pull-up|chin-up|dead hang/.test(text)) return 'Pull-up bar';
  return 'Bodyweight / floor';
};
const equipmentStatus = name => {
  const text = String(name).toLowerCase();
  const unverified = ['foam roller','resistance band','band ','hack squat','pec deck','captain', 'trap bar','ab wheel','machine chest press','barbell hip thrust','smith machine'];
  return unverified.some(item => text.includes(item)) ? 'Review before use' : 'Confirmed / review source sheet';
};
const eligibility = gate => {
  const text = String(gate || '').toLowerCase();
  const advancedOnly = text.includes('advanced only') && !text.includes('intermediate');
  const intermediateOnly = text.includes('intermediate only') || text.includes('intermediate & advanced');
  return { beginner: !advancedOnly && !intermediateOnly, intermediate: !advancedOnly, advanced: true };
};
const prescriptions = row => ({ beginner: row[4], intermediate: row[5], advanced: row[6] });
const atomicNames = value => {
  const text = String(value || '').replace(/\s*\[BASE:[^\]]+\]/g, '');
  const parts = [], buffer = [];
  let depth = 0;
  for (const character of text) {
    if (character === '(') depth += 1;
    if (character === ')') depth = Math.max(0, depth - 1);
    if ((character === ',' || character === '+' || character === '/') && depth === 0) { const part = buffer.join('').trim(); if (part) parts.push(part); buffer.length = 0; }
    else buffer.push(character);
  }
  const final = buffer.join('').trim(); if (final) parts.push(final);
  return parts.map(part => part.replace(/^and\s+/i, '').trim()).filter(Boolean);
};
const authoredGuidance = (name, role, groups, equip) => {
  const target = groups.join(' and ') || 'the planned movement';
  const isCardio = role === 'cardio' || /walk|bike|interval|liss/i.test(name);
  const isMobility = role === 'warmup' || role === 'recovery' || role === 'active-rest';
  return {
    why: isCardio ? `Builds conditioning while supporting the ${target} session.` : isMobility ? `Prepares or restores ${target} without adding heavy fatigue.` : `Builds ${target} strength and control for the bi-weekly session.`,
    commonMistake: isCardio ? 'Turning the planned pace into an all-out effort.' : isMobility ? 'Forcing range instead of moving smoothly.' : 'Using momentum or losing the planned joint position.',
    safetyCue: isCardio ? 'Keep the pace conversational; stop for unusual breathlessness, dizziness, or chest symptoms.' : 'Use a pain-free range and stop for sharp pain, dizziness, or unusual breathlessness.',
    phaseBriefs: {
      setup: { instruction: `Set up ${name} with a stable base and ${equip || 'the available equipment'} positioned safely.`, directionCue: 'Find the starting position before adding movement.', gripCue: 'Use a comfortable, controlled grip or hand position.' },
      move: { instruction: `Move through the working phase of ${name} while keeping the target area controlled.`, directionCue: 'Follow the intended path; do not bounce or swing.', gripCue: 'Keep wrists and joints aligned with the equipment path.' },
      return: { instruction: `Return slowly from ${name} to the start without dropping tension.`, directionCue: 'Control the return instead of letting the load pull you.', gripCue: 'Keep the same grip and stable trunk position.' }
    }
  };
};
const record = (row, weekKey, dayIndex, role, phase, slot, baseName, inlineAlternatives = []) => {
  const alternatives = [...new Set([...inlineAlternatives, ...splitPipe(row[7])].filter(name => name && name !== baseName))];
  const id = `biweekly-${weekKey.toLowerCase()}-${dayIndex + 1}-${slugify(baseName)}-${slugify(slot)}`;
  return {
    id: `${id}-${stableId(baseName)}`,
    stableMovementId: stableId(baseName),
    weekKey,
    dayIndex,
    role,
    phase,
    slot,
    name: baseName,
    targetGroups: targetGroups(`${focusByDay[dayIndex]} ${baseName}`),
    equipment: equipment(baseName),
    equipmentStatus: equipmentStatus(baseName),
    levelEligibility: eligibility(row[3]),
    levelGate: row[3],
    prescriptions: prescriptions(row),
    alternatives,
    cue: row[6] && row[6] !== '-' ? row[6] : row[11] || '',
    triEquipmentSwaps: alternatives,
    image: asset(baseName),
    imageSet: { setup: phaseAsset(baseName, 'setup'), move: phaseAsset(baseName, 'move'), return: phaseAsset(baseName, 'return') },
    detailContent: authoredGuidance(baseName, role, targetGroups(`${focusByDay[dayIndex]} ${baseName}`), equipment(baseName)),
    sourceSheetRow: row.__sourceRow,
    sourceSheetRows: [row.__sourceRow]
  };
};

const grouped = new Map();
sourceRows.forEach((raw, index) => {
  if (!raw?.length || !raw[0]) return;
  const parsed = weekDay(raw[0]);
  if (!parsed) return;
  const row = [...raw]; row.__sourceRow = index + 2;
  const key = `${parsed.weekKey}-${parsed.dayIndex}`;
  if (!grouped.has(key)) grouped.set(key, { weekKey: parsed.weekKey, dayIndex: parsed.dayIndex, dayName: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][parsed.dayIndex], focus: focusByDay[parsed.dayIndex], targetGroups: targetGroups(focusByDay[parsed.dayIndex]), warmup: [], coreSlots: [], optionalSlots: [], cardio: [], recovery: [], activeRest: parsed.dayIndex === 6 });
  const day = grouped.get(key);
  const phase = String(raw[1]);
  const names = atomicNames(raw[2]);
  if (phase === 'Pre-Workout') names.forEach(name => day.warmup.push(record(row, parsed.weekKey, parsed.dayIndex, 'warmup', 'pre-workout', `warmup-${day.warmup.length + 1}`, name)));
  else if (phase === 'Post-Workout') names.forEach(name => day.recovery.push(record(row, parsed.weekKey, parsed.dayIndex, 'recovery', 'post-workout', `recovery-${day.recovery.length + 1}`, name)));
  else if (/^Cardio/.test(phase)) names.forEach(name => day.cardio.push(record(row, parsed.weekKey, parsed.dayIndex, 'cardio', 'cardio', `cardio-${day.cardio.length + 1}`, name)));
  else if (phase === 'Active Rest') names.forEach(name => day.recovery.push(record(row, parsed.weekKey, parsed.dayIndex, 'active-rest', 'active-rest', `active-rest-${day.recovery.length + 1}`, name)));
  else if (/^Slot \d+/.test(phase)) {
    const slotNo = Number(phase.match(/\d+/)[0]);
    const bucket = slotNo <= 6 ? day.coreSlots : day.optionalSlots;
    // Preserve six source-sheet core slots. Combined main-row names become explicit
    // alternative movements with their own canonical artwork requirements.
    bucket.push(record(row, parsed.weekKey, parsed.dayIndex, slotNo <= 6 ? 'core' : 'optional', 'main', `slot-${slotNo}`, names[0] || row[2], names.slice(1)));
  }
});

const days = [...grouped.values()].sort((a, b) => a.weekKey.localeCompare(b.weekKey) || a.dayIndex - b.dayIndex);
for (const day of days) {
  const core = day.coreSlots || [];
  const optional = day.optionalSlots || [];
  const expertCore = [...core.filter(item => item.levelEligibility?.advanced !== false).slice(0, 5), ...optional.filter(item => item.levelEligibility?.advanced !== false).slice(0, 1)];
  if (expertCore.length < 6) expertCore.push(...core.filter(item => !expertCore.includes(item)).slice(0, 6 - expertCore.length));
  const fillCore = tier => { const eligible = core.filter(item => item.levelEligibility?.[tier] !== false); return [...eligible, ...core.filter(item => !eligible.includes(item))].slice(0, 6); };
  day.tierPlans = {
    beginner: { coreSlots: fillCore('beginner'), optionalSlots: optional.filter(item => item.levelEligibility?.beginner !== false).slice(0, 1) },
    intermediate: { coreSlots: fillCore('intermediate'), optionalSlots: optional.filter(item => item.levelEligibility?.intermediate !== false).slice(0, 2) },
    expert: { coreSlots: expertCore, optionalSlots: optional.filter(item => item.levelEligibility?.advanced !== false).slice(1, 2) }
  };
}
const output = `/* Generated from the read-only Fitness 7 V5 — Optimized Master Workout Plan sheet. */\n(() => {\n  window.GYM_COMPANION_BIWEEKLY_ROUTINE = ${JSON.stringify({ planVersion: 'biweekly-v1', sourceSheet: 'Fitness 7 V5 — Optimized Master Workout Plan', rotation: 'alternate-weekly', anchorDate: '2026-08-24', days }, null, 2)};\n})();\n`;
await fs.writeFile(path.join(root, 'data/biweekly-routine.js'), output);
console.log(`Generated ${days.length} day records (${days.filter(item => item.weekKey === 'A').length} Week A, ${days.filter(item => item.weekKey === 'B').length} Week B).`);
