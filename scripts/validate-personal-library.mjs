import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
globalThis.window = {};
await import('../data/routine.js');
await import('../data/tiered-library.js');
const catalog = window.GYM_COMPANION_TRAINING.catalog;
if (catalog.length < 120) throw new Error(`Expected 120+ movements; found ${catalog.length}.`);
if (new Set(catalog.map(item => item.slug)).size !== catalog.length) throw new Error('Exercise slugs must be unique.');
for (const item of catalog) {
  if (!item.name || !item.target_muscles || !item.scheme || !item.cue || !item.alt_text || !Array.isArray(item.targetGroups) || !item.targetGroups.length) throw new Error(`Incomplete movement metadata: ${item.slug}`);
  const file = resolve(process.cwd(), item.image_path);
  if (!existsSync(file)) throw new Error(`Missing image: ${item.image_path}`);
  const png = readFileSync(file);
  if (png.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${item.image_path}`);
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  if (width < 512 || height < 512 || width !== height) throw new Error(`Image must be square and at least 512px: ${item.image_path}`);
}
for (const [tier, required] of Object.entries({ beginner:6, intermediate:7, expert:8 })) {
  for (const day of window.GYM_COMPANION_TRAINING.templates.ppl.days) {
    if (day.candidates.filter(item => item.levels.includes(tier)).length < required) throw new Error(`${tier} does not have enough choices for ${day.focus}.`);
  }
}
console.log(`Validated ${catalog.length} movements and all tiered PPL choices.`);
