import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js', 'data/v53-content.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}

const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;
const tendonContent = context.window.GYM_COMPANION_V53_CONTENT?.tendon || [];
const canonicalPath = path.join(root, '.codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json');
const aliasPath = path.join(root, '.codex/v541/artwork-v3/ALIAS-DECISIONS.json');
const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
const aliases = JSON.parse(fs.readFileSync(aliasPath, 'utf8'));
const runtimeById = new Map(canonical.runtimeIdentities.map(row => [row.runtimeId, row]));
const aliasById = new Map();
for (const decision of aliases.decisions) {
  for (const id of decision.candidateIds) aliasById.set(id, decision);
}

const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const excludedEquipment = /captain['’]?s chair|band(?:ed|s)?|trap[- ]bar|hack squat|swiss ball|seated leg curl|cable (?:standing )?hip abduction|cuffed cable|pec[- ]deck|dip machine|machine chest press|barbell hip thrust|ab wheel/i;
const idFor = (item, isAlternative = false) => isAlternative
  ? `periodized-${slug(item.name)}`
  : (item.stableMovementId || `periodized-${slug(item.name)}`);
const equipmentMismatch = (name, equipment) => {
  const text = String(name || '').toLowerCase();
  const eq = String(equipment || '').toLowerCase();
  const checks = [
    [/barbell|bar bench/, /barbell|rack|smith/],
    [/dumbbell|\bdb\b/, /dumbbell/],
    [/push-up|push up|bodyweight/, /bodyweight|floor|mat|bench/],
    [/dip/, /parallel|dip/],
    [/cable|pulldown|face pull|pushdown|woodchop|fly|pallof/, /cable/],
    [/stick/, /stick|broom/],
    [/hanging|toes-to-bar|knee raise|leg raise/, /pull-up|pull up|captain|bar|hanging/],
    [/machine|abductor|adductor/, /machine/],
    [/band/, /band/]
  ];
  for (const [namePattern, equipmentPattern] of checks) if (namePattern.test(text) && !equipmentPattern.test(eq)) return true;
  return false;
};
const statusFor = (runtime, name, equipment) => {
  if (!runtime) return { status: 'not-in-canonical-registry', issues: ['runtime identity is not in the frozen registry'] };
  const issues = [];
  const excluded = excludedEquipment.test(`${name || runtime.name} ${equipment || runtime.equipment}`);
  if (excluded) issues.push('excluded or unverified equipment; do not generate or activate');
  if (runtime.replacementRequired) issues.push('new artwork required');
  if (runtime.currentArtworkCondition === 'legacy-complete-replace') issues.push('legacy pair should be replaced');
  if (runtime.currentArtworkCondition === 'same-image-both-phases') issues.push('Start and Movement resolve to the same image');
  if (runtime.currentArtworkCondition === 'missing-start-and-movement') issues.push('Start and Movement are missing');
  if (runtime.currentArtworkCondition === 'missing-start') issues.push('Start image is missing');
  if (runtime.currentArtworkCondition === 'missing-movement') issues.push('Movement image is missing');
  if (runtime.artworkSource === 'v2') issues.push('semantic review still pending');
  if (runtime.equipmentStatus && /review|unverified|unknown/i.test(runtime.equipmentStatus)) issues.push('equipment needs review');
  if (equipmentMismatch(name || runtime.name, equipment || runtime.equipment)) issues.push('name and equipment metadata appear inconsistent');
  const alias = aliasById.get(runtime.runtimeId);
  if (alias?.candidateIds.length > 1) issues.push(`duplicate-name group pending mechanics review (${alias.candidateIds.length} IDs)`);
  return { status: excluded ? 'excluded-from-runtime' : runtime.currentArtworkCondition, issues, excluded };
};

const firstByWeek = new Map();
for (const day of plan.days || []) {
  if (day.dayName !== 'Monday' || !['A', 'B', 'C'].includes(day.weekKey) || firstByWeek.has(day.weekKey)) continue;
  firstByWeek.set(day.weekKey, day);
}

const rows = [];
function addRow({ weekKey, role, item, variationLabel = null, variationIndex = null, sourceRowOverride = null, source = 'periodized' }) {
  const isAlternative = role === 'alternative';
  const runtimeId = source === 'tendon' ? `tendon-${slug(item.name)}` : idFor(item, isAlternative);
  const runtime = runtimeById.get(runtimeId);
  const artwork = statusFor(runtime, item.name || item.title, item.equipment || runtime?.equipment);
  rows.push({
    weekKey,
    cyclePosition: weekKey === 'A' ? 'Week 1 and Week 3' : weekKey === 'B' ? 'Week 2' : 'Week 4',
    day: 'Monday',
    role,
    variationLabel,
    variationIndex,
    runtimeId,
    canonicalMovementId: runtime?.canonicalMovementId || null,
    name: item.name || item.title,
    sourceRows: sourceRowOverride || item.sourceSheetRows || (item.sourceSheetRow != null ? [item.sourceSheetRow] : runtime?.sourceRows || []),
    equipment: item.equipment || runtime?.equipment || null,
    equipmentStatus: item.equipmentStatus || runtime?.equipmentStatus || null,
    targetGroups: item.targetGroups || runtime?.targetGroups || [],
    artworkSource: runtime?.artworkSource || null,
    currentArtworkCondition: runtime?.currentArtworkCondition || 'not-in-canonical-registry',
    existingImageSet: runtime?.existingImageSet || null,
    replacementRequired: runtime?.replacementRequired ?? true,
    excludedFromRuntime: artwork.excluded || false,
    generationEligible: Boolean((runtime?.replacementRequired ?? true) && !artwork.excluded),
    artworkStatus: artwork.status,
    issues: artwork.issues
  });
}

for (const [weekKey, day] of firstByWeek) {
  for (const item of day.coreSlots || []) {
    addRow({ weekKey, role: 'core', item });
    (item.alternatives || []).forEach((name, index) => addRow({
      weekKey,
      role: 'alternative',
      variationLabel: index === 0 ? 'Alternative' : index === 1 ? 'Option 2' : `Additional option ${index + 1}`,
      variationIndex: index + 1,
      item: { ...item, name },
      sourceRowOverride: item.sourceSheetRows || (item.sourceSheetRow != null ? [item.sourceSheetRow] : undefined)
    }));
  }
  for (const item of day.optionalSlots || []) {
    addRow({ weekKey, role: 'optional', item });
    (item.alternatives || []).forEach((name, index) => addRow({
      weekKey,
      role: 'alternative',
      variationLabel: index === 0 ? 'Alternative' : index === 1 ? 'Option 2' : `Additional option ${index + 1}`,
      variationIndex: index + 1,
      item: { ...item, name },
      sourceRowOverride: item.sourceSheetRows || (item.sourceSheetRow != null ? [item.sourceSheetRow] : undefined)
    }));
  }
  for (const item of day.warmup || []) addRow({ weekKey, role: 'warmup', item });
  for (const item of day.cardio || []) addRow({ weekKey, role: 'cardio', item });
  for (const item of day.recovery || []) addRow({ weekKey, role: 'recovery', item });
}

const mondayTendon = tendonContent.find(item => /wrist extensor/i.test(item.name || item.title));
if (mondayTendon) addRow({ weekKey: 'A/B/C', role: 'tendon', item: mondayTendon, source: 'tendon' });

const uniqueRuntime = [...new Map(rows.map(row => [row.runtimeId, row])).values()];
const replacementRows = uniqueRuntime.filter(row => row.generationEligible);
const statusCounts = Object.fromEntries([...new Set(uniqueRuntime.map(row => row.artworkStatus))].sort().map(status => [status, uniqueRuntime.filter(row => row.artworkStatus === status).length]));
const roleCounts = {};
for (const row of uniqueRuntime) {
  roleCounts[row.role] = roleCounts[row.role] || { total: 0, replacement: 0 };
  roleCounts[row.role].total += 1;
  if (row.generationEligible) roleCounts[row.role].replacement += 1;
  if (row.excludedFromRuntime) roleCounts[row.role].excluded = (roleCounts[row.role].excluded || 0) + 1;
}

const output = {
  schemaVersion: 'fitness7-monday-abc-artwork-audit-v1',
  generatedAt: new Date().toISOString(),
  plan: { key: plan.key, planVersion: plan.planVersion, cycle: 'A-B-A-C', day: 'Monday', weekKeys: ['A', 'B', 'C'] },
  counts: {
    uniqueMondayRuntimeIdentities: uniqueRuntime.length,
    uniqueMondayReplacementIdentities: replacementRows.length,
    uniqueMondayExcludedIdentities: uniqueRuntime.filter(row => row.excludedFromRuntime).length,
    uniqueMondayExistingV2Identities: uniqueRuntime.filter(row => row.artworkSource === 'v2').length,
    uniqueMondayFilesToGenerate: replacementRows.length * 2,
    occurrenceRows: rows.length,
    statusCounts,
    roleCounts
  },
  notes: [
    'Week A appears twice in the cycle (Week 1 and Week 3) and uses the same Monday movement identities; it is listed once to avoid double-counting artwork.',
    'Alternative and Option 2 rows are separate runtime identities and are audited independently from the primary movement.',
    'V2 artwork is technically present but remains semantic-review pending until human mechanics review.',
    'Tendon preparation is included as a Monday guided movement; it uses the A/B/C tendon content record.'
  ],
  occurrences: rows,
  uniqueRuntimeIdentities: uniqueRuntime.sort((a, b) => `${a.role}-${a.name}`.localeCompare(`${b.role}-${b.name}`))
};

const outDir = path.join(root, '.codex/v541/artwork-v3');
fs.writeFileSync(path.join(outDir, 'MONDAY-A-B-C-AUDIT.json'), `${JSON.stringify(output, null, 2)}\n`);

const roleOrder = ['core', 'alternative', 'optional', 'warmup', 'tendon', 'cardio', 'recovery'];
const lines = [];
lines.push('# Monday A–B–A–C artwork audit');
lines.push('');
lines.push('This report covers Monday in Week A, Week B, and Week C. Week A is repeated in the cycle as Week 1 and Week 3, so identical movement identities are counted once for artwork production. No images were generated.');
lines.push('');
lines.push('## Frozen counts');
lines.push('');
lines.push(`- Unique Monday runtime identities: **${output.counts.uniqueMondayRuntimeIdentities}**.`);
lines.push(`- Unique identities requiring replacement artwork: **${output.counts.uniqueMondayReplacementIdentities}**.`);
lines.push(`- Unique identities excluded from runtime/artwork generation: **${output.counts.uniqueMondayExcludedIdentities}**.`);
lines.push(`- Future files for this Monday queue: **${output.counts.uniqueMondayFilesToGenerate}** (Start + Movement per identity).`);
lines.push(`- Existing V2-covered identities: **${output.counts.uniqueMondayExistingV2Identities}**; these are not regenerated in this queue.`);
lines.push(`- Occurrence rows across A/B/C, including variations: **${output.counts.occurrenceRows}**.`);
lines.push('');
lines.push('## Status summary');
lines.push('');
for (const [status, count] of Object.entries(statusCounts)) lines.push(`- ${status}: **${count}** unique identities.`);
lines.push('');
lines.push('## Day structure');
lines.push('');
for (const weekKey of ['A', 'B', 'C']) {
  const day = firstByWeek.get(weekKey);
  lines.push(`### Monday ${weekKey} (${weekKey === 'A' ? 'Week 1 and Week 3' : weekKey === 'B' ? 'Week 2' : 'Week 4'})`);
  lines.push('');
  lines.push(`Focus: **${day?.focus || 'Not recorded'}**.`);
  lines.push('');
  for (const role of roleOrder) {
    const roleRows = rows.filter(row => row.weekKey === weekKey && row.role === role);
    if (!roleRows.length) continue;
    lines.push(`**${role}**`);
    lines.push('');
    for (const row of roleRows) {
      const variation = row.variationLabel ? ` · ${row.variationLabel}` : '';
      const action = row.replacementRequired ? 'ARTWORK NEEDED' : 'V2 ARTWORK PRESENT';
      const issueText = row.issues.length ? ` · Issues: ${row.issues.join('; ')}` : '';
      lines.push(`- ${row.name}${variation} · \`${row.runtimeId}\` · ${action}${issueText}`);
    }
    lines.push('');
  }
}
lines.push('## Generation queue');
lines.push('');
for (const row of replacementRows.sort((a, b) => `${a.role}-${a.name}`.localeCompare(`${b.role}-${b.name}`))) {
  lines.push(`- [ ] ${row.name} · ${row.role} · \`${row.runtimeId}\` · source rows ${row.sourceRows.length ? row.sourceRows.join(', ') : 'not recorded'} · equipment: ${row.equipment || 'needs review'} · ${row.issues.join('; ') || 'new pair required'}`);
}
lines.push('');
lines.push('## V2 preservation queue');
lines.push('');
for (const row of uniqueRuntime.filter(row => !row.replacementRequired && !row.excludedFromRuntime).sort((a, b) => a.name.localeCompare(b.name))) {
  lines.push(`- Preserve and review: ${row.name} · \`${row.runtimeId}\` · ${row.existingImageSet?.start?.path || 'Start path missing'} · ${row.existingImageSet?.movement?.path || 'Movement path missing'} · ${row.issues.join('; ') || 'technical pair present'}`);
}
lines.push('');
lines.push('## Excluded from runtime and generation');
lines.push('');
for (const row of uniqueRuntime.filter(row => row.excludedFromRuntime).sort((a, b) => a.name.localeCompare(b.name))) {
  lines.push(`- Do not generate or activate: ${row.name} · \`${row.runtimeId}\` · ${row.equipment || 'equipment not recorded'} · ${row.issues.join('; ')}`);
}
lines.push('');
lines.push('## Decisions before generation');
lines.push('');
lines.push('- Confirm each replacement identity has exact equipment, grip, stance, camera, Start pose, Movement pose, target muscles, and safe range.');
lines.push('- Resolve the duplicate-name groups flagged above before sharing artwork between identities.');
lines.push('- Review the V2-covered rows semantically; technical presence does not equal gym-coach approval.');
lines.push('- Generate only the replacement queue saved in `MONDAY-A-B-C-AUDIT.json`; do not regenerate the V2 preservation queue.');
fs.writeFileSync(path.join(outDir, 'MONDAY-A-B-C-AUDIT.md'), `${lines.join('\n')}\n`);

console.log(JSON.stringify(output.counts, null, 2));
