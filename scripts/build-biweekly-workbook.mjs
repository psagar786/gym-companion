import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputDir = path.join(root, 'outputs', 'biweekly-plan-review');
await fs.mkdir(outputDir, { recursive: true });

const context = { window: {} };
vm.createContext(context);
vm.runInContext(await fs.readFile(path.join(root, 'data/biweekly-routine.js'), 'utf8'), context);
const plan = context.window.GYM_COMPANION_BIWEEKLY_ROUTINE;
const sourceRows = JSON.parse(await fs.readFile(path.join(root, 'data/biweekly-plan-source.json'), 'utf8'));
const [sourceHeaders, ...rawRows] = sourceRows;
const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const slugify = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const equipment = name => {
  const text = String(name).toLowerCase();
  if (/foam roller/.test(text)) return 'Foam roller';
  if (/band|dislocate/.test(text)) return 'Resistance band / stick';
  if (/treadmill|incline walk/.test(text)) return 'Treadmill';
  if (/bike|cycle|elliptical|cross-trainer|rower/.test(text)) return 'Cardio machine';
  if (/cable|pulldown|woodchopper|pallof|face pull|pressdown|fly/.test(text)) return 'Cable station';
  if (/machine|pec deck|hack squat|leg press|adductor|abductor|leg curl|calf raise/.test(text)) return 'Gym machine';
  if (/barbell|smith|trap bar|ez-bar/.test(text)) return 'Barbell / rack';
  if (/dumbbell|db|goblet|kettlebell|plate/.test(text)) return 'Dumbbells / load';
  if (/hanging|pull-up|chin-up|dead hang/.test(text)) return 'Pull-up bar';
  return 'Bodyweight / floor';
};
const equipmentStatus = name => /foam roller|band |hack squat|pec deck|captain|trap bar|ab wheel|machine chest press|barbell hip thrust|smith machine/i.test(String(name)) ? 'Review before use' : 'Confirmed / review source sheet';
const weekDays = week => plan.days.filter(day => day.weekKey === week).sort((a, b) => a.dayIndex - b.dayIndex);
const rowsForDay = day => rawRows.filter(row => String(row[0]) === `Week ${day.weekKey} - Day ${day.dayIndex + 1}`);
const phaseLabel = row => String(row[1] || '').startsWith('Slot') ? (Number(String(row[1]).match(/\d+/)?.[0] || 0) <= 6 ? 'Core workout' : 'Optional / advanced') : String(row[1] || '');
const activation = row => {
  const name = String(row[2] || '').toLowerCase();
  if (/foam roller|band |hack squat|pec deck|captain|trap bar|ab wheel|machine chest press|barbell hip thrust|smith machine/.test(name)) return 'Review before use';
  return 'Ready for content review';
};

const wb = Workbook.create();
const overview = wb.worksheets.add('Overview');
const weekA = wb.worksheets.add('Week A Plan');
const weekB = wb.worksheets.add('Week B Plan');
const normalized = wb.worksheets.add('Normalized Exercise Review');
const mapping = wb.worksheets.add('App Mapping');
const charcoal = '#202124';
const orange = '#E85D04';
const paleOrange = '#FFF1E6';
const ink = '#1F2933';
const muted = '#5B6670';
const line = '#D9DEE3';
const headerFormat = { fill: charcoal, font: { bold: true, color: '#FFFFFF' }, wrapText: true, verticalAlignment: 'center' };
const titleFormat = { fill: orange, font: { bold: true, color: '#FFFFFF', size: 15 }, verticalAlignment: 'center' };
const sectionFormat = { fill: paleOrange, font: { bold: true, color: ink }, wrapText: true };
const bodyFormat = { font: { color: ink, size: 10 }, wrapText: true, verticalAlignment: 'top' };

overview.showGridLines = false;
overview.getRange('A1:H1').merge();
overview.getRange('A1').values = [['Fitness 7 Bi-Weekly Activity Plan — Review']];
overview.getRange('A1:H1').format = titleFormat;
overview.getRange('A2:H2').merge();
overview.getRange('A2').values = [['Separate review workbook sourced from the read-only “Fitness 7 V5 — Optimized Master Workout Plan” sheet.']];
overview.getRange('A2:H2').format = { fill: '#F8FAFC', font: { color: muted, italic: true }, wrapText: true };
overview.getRange('A4:B10').values = [
  ['Rotation', 'Week A and Week B alternate every calendar week'],
  ['Week A anchor', '2026-08-24 (first full Monday after activation)'],
  ['Main workout mapping', 'Sheet Slots 1–6 become core activity slots'],
  ['Optional mapping', 'Sheet Slots 7–8 become optional/advanced slots'],
  ['Sunday behavior', 'Active recovery/rest; no main workout completion requirement'],
  ['Source workbook', 'Fitness 7 V5 — Optimized Master Workout Plan'],
  ['App status', 'Review workbook complete; runtime integration staged, not deployed'],
];
overview.getRange('A4:A10').format = sectionFormat;
overview.getRange('B4:B10').format = bodyFormat;
overview.getRange('A12:C12').values = [['Level', 'Prescription behavior', 'Use in app']];
overview.getRange('A12:C12').format = headerFormat;
overview.getRange('A13:C15').values = [
  ['Beginner', 'Stable volume; locked rows remain skipped', '2–3 sets, controlled tempo, 3 RIR'],
  ['Intermediate', 'Core plus eligible intermediate rows', '3–4 sets, 1–2 RIR, progressive load'],
  ['Advanced', 'Core plus bonus rows when eligible', '4–5 sets, higher skill, no forced reps by default'],
];
overview.getRange('A13:C15').format = bodyFormat;
overview.getRange('E4:F4').values = [['Workbook QA', 'Value']];
overview.getRange('E4:F4').format = headerFormat;
overview.getRange('E5:F9').values = [
  ['Source rows imported', rawRows.length],
  ['Week A day records', weekDays('A').length],
  ['Week B day records', weekDays('B').length],
  ['Rows requiring equipment review', null],
  ['Runtime plan version', plan.planVersion],
];
overview.getRange('F8').formulas = [[`=COUNTIF('Normalized Exercise Review'!$P$2:$P$${rawRows.length + 1},"Review before use")`]];
overview.getRange('E5:E9').format = sectionFormat;
overview.getRange('F5:F9').format = bodyFormat;
overview.getRange('A1:H20').format.borders = { preset: 'outside', style: 'thin', color: line };
overview.getRange('A:A').format.columnWidth = 22;
overview.getRange('B:B').format.columnWidth = 58;
overview.getRange('C:C').format.columnWidth = 45;
overview.getRange('E:E').format.columnWidth = 30;
overview.getRange('F:F').format.columnWidth = 20;
overview.getRange('G:H').format.columnWidth = 18;

const activityHeaders = ['Day #', 'Day', 'Phase', 'Slot', 'Role', 'Exercise', 'Level Gate', 'Beginner', 'Intermediate', 'Advanced', 'Equipment swaps', 'Equipment status', 'App activation', 'Coaching cue'];
function writeWeekSheet(sheet, week) {
  sheet.showGridLines = false;
  sheet.getRange('A1:N1').merge();
  sheet.getRange('A1').values = [[`Fitness 7 ${week === 'A' ? 'Week A' : 'Week B'} — Daily Activity`]];
  sheet.getRange('A1:N1').format = titleFormat;
  sheet.getRange('A2:N2').values = [activityHeaders];
  sheet.getRange('A2:N2').format = headerFormat;
  const values = [];
  weekDays(week).forEach(day => rowsForDay(day).forEach(row => values.push([
    day.dayIndex + 1, dayNames[day.dayIndex], phaseLabel(row), row[1], /Slot 7|Slot 8/.test(row[1]) ? 'Optional / advanced' : row[1] === 'Active Rest' ? 'Active rest' : /^Slot/.test(row[1]) ? 'Core workout' : 'Guided', row[2], row[3], row[4], row[5], row[6], row[7], activation(row), activation(row) === 'Review before use' ? 'Needs coach/equipment review' : 'Ready for review', row[6] || 'See source prescription'
  ])));
  if (values.length) sheet.getRange(`A3:N${values.length + 2}`).values = values;
  sheet.getRange(`A3:N${values.length + 2}`).format = bodyFormat;
  sheet.getRange(`A2:N${values.length + 2}`).format.borders = { insideHorizontal: { style: 'thin', color: line }, bottom: { style: 'thin', color: line } };
  sheet.freezePanes.freezeRows(2);
  sheet.getRange('A:A').format.columnWidth = 8;
  sheet.getRange('B:B').format.columnWidth = 14;
  sheet.getRange('C:E').format.columnWidth = 18;
  sheet.getRange('F:F').format.columnWidth = 42;
  sheet.getRange('G:G').format.columnWidth = 24;
  sheet.getRange('H:J').format.columnWidth = 46;
  sheet.getRange('K:K').format.columnWidth = 38;
  sheet.getRange('L:M').format.columnWidth = 24;
  sheet.getRange('N:N').format.columnWidth = 44;
  sheet.getRange(`L3:M${values.length + 2}`).conditionalFormats.add('containsText', { text: 'Review before use', format: { fill: '#FDE2E2', font: { color: '#9B1C1C', bold: true } } });
}
writeWeekSheet(weekA, 'A');
writeWeekSheet(weekB, 'B');

const normalizedHeaders = ['Week', 'Day', 'Phase', 'Slot', 'Role', 'Exercise', 'Target area', 'Primary equipment', 'Alternative 1', 'Alternative 2', 'Beginner prescription', 'Intermediate prescription', 'Advanced prescription', 'Coaching cue', 'Level eligibility', 'Equipment status', 'App activation status', 'Review notes'];
normalized.showGridLines = false;
normalized.getRange('A1:R1').merge();
normalized.getRange('A1').values = [['Normalized Exercise Review — one row per source movement']];
normalized.getRange('A1:R1').format = titleFormat;
normalized.getRange('A2:R2').values = [normalizedHeaders];
normalized.getRange('A2:R2').format = headerFormat;
const normalizedRows = [];
rawRows.forEach(row => {
  const match = String(row[0] || '').match(/Week ([AB]) - Day (\d+)/);
  if (!match) return;
  const week = match[1];
  const day = Number(match[2]);
  const phase = phaseLabel(row);
  const swaps = String(row[7] || '').split('|').map(item => item.trim()).filter(item => item && item !== '-');
  const movement = String(row[2] || '').replace(/\s*\[BASE:[^\]]+\]/g, '').trim();
  normalizedRows.push([week, dayNames[day - 1], phase, row[1], /^Slot/.test(row[1]) && Number(String(row[1]).match(/\d+/)?.[0] || 0) <= 6 ? 'Core' : /^Slot/.test(row[1]) ? 'Optional / advanced' : phase === 'Active Rest' ? 'Active rest' : 'Guided', movement, `${dayNames[day - 1]} focus`, equipment(movement), swaps[0] || '-', swaps[1] || '-', row[4], row[5], row[6], row[6] || '-', row[3], equipmentStatus(movement), activation(row), /foam roller|band |hack squat|pec deck|captain|trap bar|ab wheel|machine chest press|barbell hip thrust|smith machine/i.test(movement) ? 'Preserved from source; approve equipment or select a listed swap.' : 'Review artwork and coaching detail before activation.']);
});
normalized.getRange(`A3:R${normalizedRows.length + 2}`).values = normalizedRows;
normalized.getRange(`A3:R${normalizedRows.length + 2}`).format = bodyFormat;
normalized.getRange(`A2:R${normalizedRows.length + 2}`).format.borders = { insideHorizontal: { style: 'thin', color: line }, bottom: { style: 'thin', color: line } };
normalized.freezePanes.freezeRows(2);
normalized.getRange('A:E').format.columnWidth = 16;
normalized.getRange('F:F').format.columnWidth = 42;
normalized.getRange('G:H').format.columnWidth = 24;
normalized.getRange('I:J').format.columnWidth = 34;
normalized.getRange('K:M').format.columnWidth = 46;
normalized.getRange('N:R').format.columnWidth = 30;
normalized.getRange(`P3:Q${normalizedRows.length + 2}`).conditionalFormats.add('containsText', { text: 'Review', format: { fill: '#FDE2E2', font: { color: '#9B1C1C', bold: true } } });

const mappingHeaders = ['Runtime ID', 'Week', 'Day', 'Role', 'Phase', 'Slot', 'Exercise', 'Target groups', 'Equipment', 'Equipment status', 'Eligibility', 'Image set', 'Detail content', 'Source sheet row'];
mapping.showGridLines = false;
mapping.getRange('A1:N1').merge();
mapping.getRange('A1').values = [['App Mapping — biweekly-v1 runtime records']];
mapping.getRange('A1:N1').format = titleFormat;
mapping.getRange('A2:N2').values = [mappingHeaders];
mapping.getRange('A2:N2').format = headerFormat;
const mappingRows = [];
plan.days.forEach(day => [...day.warmup, ...day.coreSlots, ...day.optionalSlots, ...day.cardio, ...day.recovery].forEach(item => mappingRows.push([item.id, day.weekKey, dayNames[day.dayIndex], item.role, item.phase, item.slot, item.name, item.targetGroups.join(', '), item.equipment, item.equipmentStatus, item.levelGate, `${item.imageSet.setup} | ${item.imageSet.move} | ${item.imageSet.return}`, item.detailContent.why, item.sourceSheetRow])));
mapping.getRange(`A3:N${mappingRows.length + 2}`).values = mappingRows;
mapping.getRange(`A3:N${mappingRows.length + 2}`).format = bodyFormat;
mapping.getRange(`A2:N${mappingRows.length + 2}`).format.borders = { insideHorizontal: { style: 'thin', color: line }, bottom: { style: 'thin', color: line } };
mapping.freezePanes.freezeRows(2);
mapping.getRange('A:A').format.columnWidth = 44;
mapping.getRange('B:F').format.columnWidth = 16;
mapping.getRange('G:G').format.columnWidth = 42;
mapping.getRange('H:K').format.columnWidth = 24;
mapping.getRange('L:L').format.columnWidth = 80;
mapping.getRange('M:M').format.columnWidth = 44;
mapping.getRange('N:N').format.columnWidth = 14;

const inspect = await wb.inspect({ kind: 'table', range: 'Overview!A1:H20', include: 'values,formulas', tableMaxRows: 20, tableMaxCols: 8 });
console.log(inspect.ndjson);
const formulaErrors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 100 }, summary: 'formula error scan' });
console.log(formulaErrors.ndjson);
for (const sheetName of ['Overview', 'Week A Plan', 'Week B Plan', 'Normalized Exercise Review', 'App Mapping']) {
  const preview = await wb.render({ sheetName, autoCrop: 'all', scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${slugify(sheetName)}.png`), new Uint8Array(await preview.arrayBuffer()));
}
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(path.join(outputDir, 'fitness7-biweekly-activity-plan-review.xlsx'));
console.log(`Saved ${path.join(outputDir, 'fitness7-biweekly-activity-plan-review.xlsx')}`);
