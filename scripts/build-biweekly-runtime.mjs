import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const rows = JSON.parse(await fs.readFile(path.join(root, 'data/biweekly-plan-source.json'), 'utf8'));
const [headers, ...sourceRows] = rows;

const slugify = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const asset = name => `assets/exercises/${slugify(name)}.png`;
const phaseAsset = (name, phase) => `assets/exercises/${slugify(name)}-phase-${phase}.png`;
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
const eligibility = gate => ({
  beginner: !/intermediate|advanced only/i.test(gate),
  intermediate: !/advanced only/i.test(gate),
  advanced: true
});
const prescriptions = row => ({ beginner: row[4], intermediate: row[5], advanced: row[6] });
const record = (row, weekKey, dayIndex, role, phase, slot) => {
  const name = row[2];
  const baseName = name.replace(/\s*\[BASE:[^\]]+\]/g, '').trim();
  const alternatives = splitPipe(row[7]);
  const id = `biweekly-${weekKey.toLowerCase()}-${dayIndex + 1}-${slugify(baseName)}-${slugify(slot)}`;
  return {
    id,
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
    detailContent: { why: `Supports the ${targetGroups(`${focusByDay[dayIndex]} ${baseName}`).join(' and ') || 'day'} training focus.`, safetyCue: 'Use a controlled range and stop for sharp pain, dizziness, or unusual breathlessness.' },
    sourceSheetRow: row.__sourceRow
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
  if (phase === 'Pre-Workout') day.warmup.push(record(row, parsed.weekKey, parsed.dayIndex, 'warmup', 'pre-workout', `warmup-${day.warmup.length + 1}`));
  else if (phase === 'Post-Workout') day.recovery.push(record(row, parsed.weekKey, parsed.dayIndex, 'recovery', 'post-workout', `recovery-${day.recovery.length + 1}`));
  else if (/^Cardio/.test(phase)) day.cardio.push(record(row, parsed.weekKey, parsed.dayIndex, 'cardio', 'cardio', `cardio-${day.cardio.length + 1}`));
  else if (phase === 'Active Rest') day.recovery.push(record(row, parsed.weekKey, parsed.dayIndex, 'active-rest', 'active-rest', 'active-rest'));
  else if (/^Slot \d+/.test(phase)) {
    const slotNo = Number(phase.match(/\d+/)[0]);
    const item = record(row, parsed.weekKey, parsed.dayIndex, slotNo <= 6 ? 'core' : 'optional', 'main', `slot-${slotNo}`);
    (slotNo <= 6 ? day.coreSlots : day.optionalSlots).push(item);
  }
});

const days = [...grouped.values()].sort((a, b) => a.weekKey.localeCompare(b.weekKey) || a.dayIndex - b.dayIndex);
const output = `/* Generated from the read-only Fitness 7 V5 — Optimized Master Workout Plan sheet. */\n(() => {\n  window.GYM_COMPANION_BIWEEKLY_ROUTINE = ${JSON.stringify({ planVersion: 'biweekly-v1', sourceSheet: 'Fitness 7 V5 — Optimized Master Workout Plan', rotation: 'alternate-weekly', anchorDate: '2026-08-24', days }, null, 2)};\n})();\n`;
await fs.writeFile(path.join(root, 'data/biweekly-routine.js'), output);
console.log(`Generated ${days.length} day records (${days.filter(item => item.weekKey === 'A').length} Week A, ${days.filter(item => item.weekKey === 'B').length} Week B).`);
