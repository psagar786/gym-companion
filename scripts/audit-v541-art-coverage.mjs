import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js', 'data/periodized-v2-pilot.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;
const library = context.window.GYM_COMPANION_PERIODIZED_V2_PILOT;
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const runtime = new Map();
const add = (id, name, role, day, week) => {
  const record = runtime.get(id) || { id, name, roles: new Set(), days: new Set(), weeks: new Set() };
  record.roles.add(role); record.days.add(day); record.weeks.add(week); runtime.set(id, record);
};
for (const day of plan.days) {
  for (const [role, items] of Object.entries({ core: day.coreSlots || [], optional: day.optionalSlots || [], warmup: day.warmup || [], recovery: day.recovery || [], cardio: day.cardio || [] })) {
    for (const item of items) {
      add(item.stableMovementId || `periodized-${slug(item.name)}`, item.name, role, day.dayName, day.weekKey);
      for (const alternative of item.alternatives || []) add(`periodized-${slug(alternative)}`, alternative, 'alternative', day.dayName, day.weekKey);
    }
  }
}
const pathOwners = new Map();
const assetRows = [];
for (const item of Object.values(library.movements)) {
  const phaseRows = [];
  for (const phase of ['start', 'movement']) {
    const relative = item.imageSet[phase];
    const absolute = path.join(root, relative);
    const exists = fs.existsSync(absolute);
    const buffer = exists ? fs.readFileSync(absolute) : null;
    const size = buffer?.subarray(1, 4).toString() === 'PNG' ? [buffer.readUInt32BE(16), buffer.readUInt32BE(20)] : null;
    const hash = buffer ? crypto.createHash('sha256').update(buffer).digest('hex') : null;
    phaseRows.push({ phase, path: relative, exists, width: size?.[0] || null, height: size?.[1] || null, hash });
    if (relative) pathOwners.set(relative, [...(pathOwners.get(relative) || []), item.stableMovementId]);
  }
  const matchedRuntimeIds = item.runtimeIds.filter(id => runtime.has(id));
  const unknownRuntimeIds = item.runtimeIds.filter(id => !runtime.has(id));
  assetRows.push({ movementId: item.stableMovementId, name: item.name, sourceRow: item.sourceRow, runtimeIds: item.runtimeIds, matchedRuntimeIds, unknownRuntimeIds, phases: phaseRows, technicalPass: phaseRows.every(row => row.exists && row.width === 512 && row.height === 512) && phaseRows[0].hash !== phaseRows[1].hash });
}
const mappedRuntime = new Set(assetRows.flatMap(row => row.matchedRuntimeIds));
const uncovered = [...runtime.values()].filter(item => !mappedRuntime.has(item.id)).map(item => ({ ...item, roles: [...item.roles], days: [...item.days], weeks: [...item.weeks] }));
const unusedPilot = assetRows.filter(row => row.matchedRuntimeIds.length === 0);
const report = {
  generatedAt: new Date().toISOString(),
  planVersion: plan.planVersion,
  runtimeIdentityCount: runtime.size,
  v2ArtworkSetCount: assetRows.length,
  v2ArtworkFileCount: assetRows.length * 2,
  mappedRuntimeIdentityCount: mappedRuntime.size,
  uncoveredRuntimeIdentityCount: uncovered.length,
  unusedPilotSetCount: unusedPilot.length,
  technicalPassCount: assetRows.filter(row => row.technicalPass).length,
  assetRows,
  unusedPilotSets: unusedPilot.map(row => ({ movementId: row.movementId, name: row.name, sourceRow: row.sourceRow })),
  uncoveredRuntime: uncovered
};
fs.mkdirSync(path.join(root, '.codex/v541/integration'), { recursive: true });
fs.mkdirSync(path.join(root, 'output/reports'), { recursive: true });
fs.writeFileSync(path.join(root, '.codex/v541/integration/COVERAGE-AUDIT.json'), JSON.stringify(report, null, 2));
const lines = [
  '# Fitness 7 V5.4.1 V2 artwork coverage audit', '',
  `- Current A–B–A–C selectable identities: **${runtime.size}**.`,
  `- New V2 artwork: **${assetRows.length} sets / ${assetRows.length * 2} images**.`,
  `- Runtime identities safely mapped to V2 artwork: **${mappedRuntime.size}**.`,
  `- Runtime identities still without V2 artwork: **${uncovered.length}**.`,
  `- Pilot sets not used by the current runtime: **${unusedPilot.length}**.`,
  `- Technically valid 512×512 Start/Movement pairs: **${report.technicalPassCount}/${assetRows.length}**.`, '',
  '## Decision', '',
  'The 43-set library is complete as a visual pilot, but it is not a complete replacement library for the A–B–A–C program. V5.4.1 may apply a V2 pair only to the explicit runtime IDs in the mapping file. Every other exercise keeps its exact legacy artwork; no similarity-based fallback is allowed.', '',
  '## Pilot sets not currently used by A–B–A–C', '',
  ...unusedPilot.map(row => `- Row ${row.sourceRow}: ${row.name} (${row.movementId})`), '',
  '## Runtime identities still awaiting V2 conversion', '',
  '| Runtime identity | Exercise | Roles | Days | Weeks |',
  '|---|---|---|---|---|',
  ...uncovered.map(item => `| ${item.id} | ${item.name} | ${item.roles.join(', ')} | ${item.days.join(', ')} | ${item.weeks.join(', ')} |`)
];
fs.writeFileSync(path.join(root, 'output/reports/v541-artwork-coverage.md'), `${lines.join('\n')}\n`);
console.log(`V5.4.1 artwork: ${assetRows.length}/43 technical pairs; ${mappedRuntime.size}/${runtime.size} runtime identities mapped; ${uncovered.length} remain.`);
if (assetRows.some(row => !row.technicalPass)) process.exitCode = 1;
