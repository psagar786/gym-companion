#!/usr/bin/env node
/**
 * Read-only V5.3 contract check. No files, sessions, or cloud records are written.
 * Default: fail on incomplete activation requirements. --audit: report without a
 * failing exit code. --json: machine-readable findings. --data-only: skip runtime
 * integration checks. --self-test: exercise the validator with in-memory fixtures.
 *
 * Canonical input: window.GYM_COMPANION_V53_THREEWEEK (legacy draft key
 * GYM_COMPANION_V53_PLAN is also diagnosed) in data/v53-threeweek.js.
 * Supports days: {1: [...], 2: [...], 3: [...]}, weeks: [{weekIndex, days}],
 * or six shared day definitions whose slots hold all three variants.
 * Slots may contain inline primary/alternative/third records or variants.week1,
 * variants.week2, variants.week3 IDs resolved from plan.movements.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = new Set(process.argv.slice(2));
const TIERS = ['beginner', 'intermediate', 'expert'];
const DAY_FOCUSES = ['pull', 'push', 'legs', 'pull', 'push', 'legs'];
const BANNED = /captain.?s.?chair|banded pallof|banded monster|trap.?bar|cable (?:standing )?hip abduction|hack squat|swiss.?ball leg curl|seated leg curl|cuffed cable rear.?delt|banded rotation|machine chest press|dip machine|pec.?deck|landmine press|barbell hip thrust/i;
const GENERIC = /set up.*stable base|follow the intended path|build control|forcing range instead of moving smoothly|increase weight gradually|move through the working phase|keep the target area controlled/i;
const asArray = value => Array.isArray(value) ? value : value ? [value] : [];
const text = value => typeof value === 'string' && value.trim().length > 0;
const idOf = item => item?.stableMovementId || item?.id || item?.slug;
const content = (item, key, aliases = []) => item?.[key] || aliases.map(alias => item?.[alias]).find(Boolean) || item?.detailContent?.[key];

function dimensions(buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return {format:'png', width:buffer.readUInt32BE(16), height:buffer.readUInt32BE(20)};
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const type = buffer.toString('ascii', offset, offset + 4), length = buffer.readUInt32LE(offset + 4), start = offset + 8;
    if (start + length > buffer.length) return null;
    if (type === 'VP8X' && length >= 10) return {format:'webp', width:buffer.readUIntLE(start + 4, 3) + 1, height:buffer.readUIntLE(start + 7, 3) + 1};
    if (type === 'VP8L' && length >= 5 && buffer[start] === 0x2f) {
      const bits = buffer.readUInt32LE(start + 1);
      return {format:'webp', width:(bits & 0x3fff) + 1, height:((bits >>> 14) & 0x3fff) + 1};
    }
    if (type === 'VP8 ' && length >= 10 && buffer[start + 3] === 0x9d && buffer[start + 4] === 0x01 && buffer[start + 5] === 0x2a) return {format:'webp', width:buffer.readUInt16LE(start + 6) & 0x3fff, height:buffer.readUInt16LE(start + 8) & 0x3fff};
    offset = start + length + (length % 2);
  }
  return null;
}

export function validateRoutine(plan, options = {}) {
  const findings = [], visited = new Map(), imageOwners = new Map();
  const add = (code, location, message, severity = 'error') => findings.push({severity, code, location, message});
  const registry = new Map((Array.isArray(plan?.movements) ? plan.movements : Object.values(plan?.movements || {})).map(item => [idOf(item), item]));
  const resolve = value => typeof value === 'string' ? registry.get(value) : value;
  const sharedDays = Array.isArray(plan?.days) && plan.days.length === 6 ? plan.days : null;
  const weeks = sharedDays ? {1:sharedDays,2:sharedDays,3:sharedDays} : Array.isArray(plan?.weeks) ? Object.fromEntries(plan.weeks.map(week => [week.weekIndex ?? week.week, week.days])) : plan?.days || {};
  const stats = {weeks:0, trainingDays:0, coreSlots:0, uniqueMovements:0, imageFilesChecked:0};
  if (plan?.planVersion !== 'threeweek-ppl-v1') add('PLAN_VERSION', 'plan.planVersion', 'Expected threeweek-ppl-v1.');
  if ((plan?.templateKey || plan?.key) !== 'threeweek-ppl') add('TEMPLATE_KEY', 'plan', 'Expected threeweek-ppl template key.');
  if (plan?.rotationLength !== 3 && plan?.rotation?.length !== 3 && plan?.rotation?.weeks !== 3) add('ROTATION_LENGTH', 'plan', 'Three explicit rotation weeks are required.');
  if (Object.keys(weeks).length !== 3) add('WEEK_DATA', 'plan.days', 'Provide three complete day collections, not only rotation labels/dayOrder.');

  function movement(value, location, role) {
    const item = resolve(value);
    if (!item || !idOf(item) || !text(item.name || item.title)) { add('MOVEMENT_RECORD', location, 'Movement needs a stable ID and name; references must resolve independently.'); return null; }
    const id = idOf(item), name = item.name || item.title;
    if (BANNED.test(`${name} ${item.equipment || ''}`)) add('EXCLUDED_EQUIPMENT', location, `Excluded movement/equipment: ${name}.`);
    if (visited.has(id)) return item;
    visited.set(id, item);
    for (const key of ['targetGroups', 'primaryTargets', 'secondaryTargets']) if (!Array.isArray(item[key])) add('TARGET_METADATA', `${location}.${key}`, `${name} needs explicit ${key}.`);
    if (!asArray(item.primaryTargets).length) add('PRIMARY_TARGETS', location, `${name} needs at least one exact primary target.`);
    for (const [key, aliases] of [['equipment',[]],['cardDescription',['description']],['whyItMatters',['why']],['formCue',['cue']],['commonMistake',[]],['safetyCue',[]],['progression',[]],['tendonNote',[]]]) {
      const value = content(item, key, aliases);
      if (!text(value)) add('AUTHORED_CONTENT', `${location}.${key}`, `${name} is missing ${key}.`);
      else if (GENERIC.test(value)) add('GENERIC_CONTENT', `${location}.${key}`, `${name} still uses generic fallback coaching.`);
    }
    if (item.equipmentStatus && !['confirmed', 'approved', 'Confirmed'].includes(item.equipmentStatus)) add('EQUIPMENT_REVIEW', location, `${name} is not equipment-approved (${item.equipmentStatus}).`);
    if (['core','optional'].includes(role)) {
      for (const tier of TIERS) {
        const dose = item.prescriptions?.[tier] || item.tierPrescriptions?.[tier];
        if (!dose || typeof dose !== 'object') { add('TIER_PRESCRIPTION', `${location}.${tier}`, `${name} requires structured ${tier} sets/reps/rest/RIR/tempo/progression.`); continue; }
        for (const key of ['sets','reps','rest','rir','tempo','progression']) {
          const value = key === 'rest' ? (dose.rest ?? dose.restSeconds) : dose[key];
          if (value === undefined || value === '') add('TIER_FIELD', `${location}.${tier}.${key}`, `${name}: missing ${tier} ${key}.`);
        }
        const intensity = dose.intensity || dose.intensityNotes || '';
        if (/forced reps|training to failure|to failure by default/i.test(intensity) && !/\b(?:no|never|not|without)\b/i.test(intensity)) add('UNSAFE_DEFAULT', location, `${name}: forced reps/failure must not be a default.`);
      }
    }
    const hashes = [], phasePaths = [];
    for (const phase of ['start','move']) {
      const sourcePhase = phase === 'move' ? (item.imageSet?.move ? 'move' : 'movement') : phase;
      const image = item.imageSet?.[sourcePhase], brief = item.phaseBriefs?.[sourcePhase] || item.detailContent?.phaseBriefs?.[sourcePhase];
      if (!text(brief?.instruction) || GENERIC.test(brief.instruction)) add('PHASE_INSTRUCTION', `${location}.${phase}`, `${name} needs authored ${phase} guidance.`);
      if (!text(brief?.alt || item.imageAlt?.[phase] || item.alt)) add('PHASE_ALT', `${location}.${phase}`, `${name} needs descriptive ${phase} alt text.`);
      if (!text(image)) { add('PHASE_IMAGE', `${location}.${phase}`, `${name} is missing an explicit ${phase} path.`); continue; }
      phasePaths.push(image);
      if (imageOwners.has(image) && imageOwners.get(image) !== id) add('SHARED_MOVEMENT_IMAGE', location, `${name} shares artwork with ${imageOwners.get(image)}: ${image}`);
      imageOwners.set(image, id);
      if (!image.startsWith('assets/exercises/threeweek/') || !image.endsWith('.webp')) add('IMAGE_NAMESPACE', location, `${name}: V5.3 pairs must use assets/exercises/threeweek/*.webp.`);
      const fullPath = path.resolve(root, image);
      if (!fullPath.startsWith(`${root}${path.sep}`)) { add('UNSAFE_IMAGE_PATH', location, `Image path leaves the project: ${image}`); continue; }
      if (options.skipAssets) continue;
      if (!fs.existsSync(fullPath)) { add('MISSING_IMAGE', location, `Missing ${image}`); continue; }
      const buffer = fs.readFileSync(fullPath), size = dimensions(buffer);
      stats.imageFilesChecked += 1;
      if (!size || size.format !== 'webp' || size.width !== 512 || size.height !== 512) add('IMAGE_FORMAT', location, `${image} must be a 512×512 WebP.`);
      hashes.push(createHash('sha256').update(buffer).digest('hex'));
    }
    if (new Set(phasePaths).size < phasePaths.length || (hashes.length === 2 && hashes[0] === hashes[1])) add('DUPLICATE_PHASE', location, `${name}: Start and Movement are identical.`);
    if (item.imageSet?.return || item.imageSet?.setup) add('LEGACY_PHASES', location, `${name}: new V5.3 records must expose Start/Movement only; legacy art stays in legacy snapshots.`);
    for (const review of ['artworkStatus','visualReviewStatus','coachReviewStatus']) if (!['approved','complete'].includes(item[review])) add('REVIEW_PENDING', `${location}.${review}`, `${name}: ${review} is not approved.`);
    return item;
  }

  for (let week = 1; week <= 3; week += 1) {
    const days = weeks[week];
    if (!Array.isArray(days) || days.length !== 6) { add('DAY_COUNT', `week${week}`, 'Each rotation week must contain six Monday–Saturday training days.'); continue; }
    stats.weeks += 1;
    const seenDays = new Set();
    for (const [position, day] of days.entries()) {
      const index = day.dayIndex ?? day.day_index ?? position, location = `week${week}.day${index}`, focus = DAY_FOCUSES[index];
      if (!Number.isInteger(index) || index < 0 || index > 5 || seenDays.has(index)) add('DAY_INDEX', location, 'Day indexes must be unique Monday=0 through Saturday=5.');
      seenDays.add(index); stats.trainingDays += 1;
      if (!String(day.focus || '').toLowerCase().includes(focus)) add('DAY_FOCUS', location, `Expected ${focus} focus for this weekday.`);
      const slots = day.coreSlots || day.slots || [], selectedIds = new Set();
      if (slots.length !== 6) add('CORE_COUNT', location, `Expected six core slots; found ${slots.length}.`);
      stats.coreSlots += slots.length;
      for (const [slotIndex, slot] of slots.entries()) {
        const variants = [slot.variants?.week1 || slot.primary || slot.exercise, slot.variants?.week2 || slot.alternative, slot.variants?.week3 || slot.third];
        const items = variants.map((variant, i) => movement(variant, `${location}.slot${slotIndex + 1}.option${i + 1}`, 'core'));
        if (items.filter(Boolean).length === 3 && new Set(items.map(idOf)).size !== 3) add('VARIANT_IDENTITIES', location, `Slot ${slotIndex + 1} needs three mechanically distinct identities.`);
        const selected = items[week - 1];
        if (selected && selectedIds.has(idOf(selected))) add('DUPLICATE_CORE', location, `Default movement repeated: ${selected.name}.`);
        if (selected) selectedIds.add(idOf(selected));
      }
      for (const section of ['warmup','tendon','recovery']) {
        if (!asArray(day[section]).length) add('GUIDED_SECTION', `${location}.${section}`, `Missing ${section} movements.`);
        for (const [index, item] of asArray(day[section]).entries()) movement(item, `${location}.${section}${index + 1}`, section);
      }
      const options = day.optionalSlots || day.optional || [];
      for (const [index, item] of options.entries()) {
        const option = movement(item.exercise || item, `${location}.optional${index + 1}`, 'optional');
        if (option && /stretch|mobility|warmup|recovery|cooldown|tendon/i.test(option.exerciseType || '')) add('OPTIONAL_TYPE', location, `${option.name} cannot be a main-workout extra.`);
        if (option && asArray(option.targetGroups).some(group => !asArray(day.targetGroups).includes(group))) add('OPTIONAL_TARGET', location, `${option.name} targets an unrelated group.`);
      }
      if ((day.maxExtras ?? plan.maxExtras ?? 2) > 2) add('EXTRA_LIMIT', location, 'At most two recurring extras are allowed.');
      if (focus === 'legs' && asArray(day.recovery).some(item => /interval|liss|zone.?2/i.test(`${resolve(item)?.name || ''} ${resolve(item)?.cardDescription || ''}`))) add('LEG_CARDIO', location, 'Leg recovery cannot contain intervals, LISS, or Zone 2; use an easy cooldown walk.');
    }
  }
  // Metadata-only drafts are inspected too, so shared tendon proxies are not hidden
  // behind the missing 18-day plan error.
  if (!stats.trainingDays) for (const [index, item] of asArray(plan?.tendon).entries()) movement(item, `plan.tendon${index + 1}`, 'tendon');
  stats.uniqueMovements = visited.size;
  if (options.runtime) {
    const {app = '', index = '', templates = '', sourceGlobal = 'GYM_COMPANION_V53_THREEWEEK'} = options.runtime;
    if (!index.includes('data/v53-threeweek.js')) add('RUNTIME_SCRIPT', 'index.html', 'Three-week source is not loaded.');
    if (!app.includes(sourceGlobal)) add('RUNTIME_PLAN', 'member-app.js', `Member runtime does not read the canonical ${sourceGlobal} source.`);
    if (!/threeweek-ppl/.test(app)) add('RUNTIME_TEMPLATE', 'member-app.js', 'Plan selection/display must support threeweek-ppl.');
    if (!/threeweek-ppl/.test(templates)) add('TEMPLATE_REGISTRY', 'data/tiered-library.js', 'The template registry does not expose threeweek-ppl; runtime currently special-cases it.', 'warning');
    if (!app.includes('threeweek-ppl-v1')) add('RUNTIME_SOURCE', 'member-app.js', 'Sessions do not have a threeweek-ppl-v1 source-version path.');
    if (!app.includes('rotation_anchor_date') || !/rotation_week|rotationWeek/.test(app)) add('RUNTIME_ROTATION', 'member-app.js', 'Missing persisted rotation anchor and actual rotation week.');
    if (/function sessionForDate\([^)]*\)[^{]*\{[^\n]*(?:\?'biweekly-v1':'v5'|\?"biweekly-v1":"v5")/.test(app)) add('SESSION_SOURCE', 'member-app.js:sessionForDate', 'Active session lookup hard-codes v5 and cannot read back threeweek-ppl-v1 sessions.');
    if (/const choice=extra\?0:\(progress\.choices\?\.\[index\]\|\|0\)/.test(app.replace(/\s/g,''))) add('ROTATION_DEFAULT', 'member-app.js', 'The calculated rotation choice is not used as the unsaved per-slot default.');
    if (/replacement\?routineExercise\(\{name:replacement,image:exercise\.image\}/.test(app.replace(/\s/g,''))) add('RENAMED_REPLACEMENT', 'member-app.js:threeWeekPlan', 'Excluded exercise replacement retains excluded artwork/content instead of resolving a canonical movement.');
    const body = name => app.match(new RegExp(`function ${name}\\([^)]*\\)\\s*\\{([^\\n]*)`))?.[1] || '';
    if (!body('hasWorkoutActivity').includes('tendon')) add('TENDON_PROGRESS', 'member-app.js:hasWorkoutActivity', 'Tendon checks must create visible activity records. Tendon remains a separate optional zone and is not merged into the three calendar rings.');
    if (!/imageSet\??\.start|imageSet\[['"]start['"]\]/.test(app)) add('TWO_FRAME_RUNTIME', 'member-app.js', 'No explicit Start-image path is consumed by the current detail pipeline.');
    if (/\$\{sourceLabel\}/.test(app) && !/(?:const|let|var)\s+sourceLabel\b/.test(app)) add('HISTORY_SOURCE_LABEL', 'member-app.js:renderHistory', 'sourceLabel is referenced without a declaration and can crash history rendering.');
    add('VISUAL_REVIEW_REQUIRED', 'release gate', 'This script cannot prove pose mechanics, perceptual difference, safe margins, or mobile usability. Require recorded visual review and browser tests.', 'warning');
  }
  return {ok:findings.every(item => item.severity !== 'error'), stats, findings};
}

function selfTest() {
  const empty = validateRoutine({key:'threeweek-ppl',planVersion:'threeweek-ppl-v1',rotationLength:3}, {skipAssets:true});
  assert(empty.findings.some(item => item.code === 'WEEK_DATA'));
  assert.equal(empty.findings.filter(item => item.code === 'DAY_COUNT').length, 3);
  const badTendon = validateRoutine({key:'threeweek-ppl',planVersion:'threeweek-ppl-v1',rotationLength:3,tendon:[{id:'bad',name:'Banded Pallof Press',imageSet:{start:'a.webp',move:'a.webp'}}]}, {skipAssets:true});
  assert(badTendon.findings.some(item => item.code === 'EXCLUDED_EQUIPMENT'));
  assert(badTendon.findings.some(item => item.code === 'DUPLICATE_PHASE'));
  const png = Buffer.alloc(24); Buffer.from([137,80,78,71,13,10,26,10]).copy(png); png.writeUInt32BE(512,16); png.writeUInt32BE(512,20);
  assert.deepEqual(dimensions(png), {format:'png',width:512,height:512});
  assert.equal(dimensions(Buffer.from('invalid')), null);
  console.log('Three-week validator self-test passed (missing schedule, equipment denylist, duplicate phase, image header).');
}

if (args.has('--self-test')) selfTest();
else {
  const context = {window:{}}; vm.createContext(context);
  let loadError;
  for (const file of ['data/routine.js','data/v5-routine.js','data/tiered-library.js','data/v5-exercise-guides.js','data/v53-content.js','data/v53-threeweek.js']) {
    try { if (fs.existsSync(path.join(root,file))) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), context, {filename:file,timeout:1000}); }
    catch (error) { loadError = `${file}: ${error.message}`; break; }
  }
  const read = file => fs.existsSync(path.join(root,file)) ? fs.readFileSync(path.join(root,file),'utf8') : '';
  const sourceGlobal = context.window.GYM_COMPANION_V53_THREEWEEK ? 'GYM_COMPANION_V53_THREEWEEK' : 'GYM_COMPANION_V53_PLAN';
  const result = validateRoutine(context.window[sourceGlobal], {runtime:args.has('--data-only') ? null : {app:read('member-app.js'),index:read('index.html'),templates:read('data/tiered-library.js'),sourceGlobal}});
  if (loadError) { result.findings.unshift({severity:'error',code:'SOURCE_LOAD',location:'data/v53-threeweek.js',message:loadError}); result.ok = false; }
  const errors = result.findings.filter(item => item.severity === 'error').length, warnings = result.findings.length - errors;
  if (args.has('--json')) console.log(JSON.stringify({...result, errors, warnings}, null, 2));
  else {
    console.log(`V5.3 three-week PPL: ${result.stats.weeks}/3 weeks, ${result.stats.trainingDays}/18 days, ${result.stats.coreSlots}/108 slots, ${result.stats.uniqueMovements} movement identities.`);
    console.log(`${errors} activation errors; ${warnings} review warnings.`);
    for (const item of result.findings) console.log(`${item.severity.toUpperCase()} [${item.code}] ${item.location}: ${item.message}`);
  }
  if (!result.ok && !args.has('--audit')) process.exitCode = 1;
}
