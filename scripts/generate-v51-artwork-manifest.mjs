import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
for (const file of ['../data/routine.js', '../data/v5-routine.js', '../data/tiered-library.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), context);
}

const routine = context.window.GYM_COMPANION_V5_ROUTINE || [];
const catalog = context.window.GYM_COMPANION_TRAINING?.catalog || [];
const catalogByName = new Map(catalog.map(item => [item.name, item]));
const catalogByImage = new Map(catalog.map(item => [item.image_path, item]));
const active = new Map();

const phasePath = (image, phase) => image.replace(/\.png$/i, `-phase-${phase}.png`);
const register = (item, usage, day) => {
  if (!item) return;
  const image = item.image || item.image_path;
  const catalogItem = catalogByName.get(item.name || item.title) || catalogByImage.get(image) || {};
  const name = catalogItem.name || item.name || item.title;
  if (!name || !image) throw new Error(`Incomplete active artwork record: ${day} / ${usage}`);
  const existing = active.get(name) || {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name,
    equipment: catalogItem.equipment || 'See movement specification',
    movementPattern: catalogItem.movement_pattern || usage,
    targetArea: catalogItem.target_muscles || 'See movement specification',
    baseImage: image,
    phases: {
      setup: phasePath(image, 'setup'),
      move: phasePath(image, 'move'),
      return: phasePath(image, 'return')
    },
    requiredCanvas: { width: 512, height: 512, minimumClearMarginPx: 51 },
    sequenceRules: [
      'same athlete, equipment, clothing, lighting, and camera angle in all phases',
      'one athlete and one pose per frame; no collage, inset, split screen, or mirrored duplicate',
      'setup, move, and return must show meaningfully different joint positions',
      'charcoal background, high-contrast off-white figure/equipment, restrained orange motion emphasis',
      'full athlete and equipment remain inside the safe margin'
    ],
    visualReviewStatus: 'pending-regeneration',
    coachReviewStatus: 'pending',
    assetVersion: 'v4-existing',
    usages: []
  };
  const key = `${day}:${usage}`;
  if (!existing.usages.includes(key)) existing.usages.push(key);
  active.set(name, existing);
};

for (const day of routine) {
  day.slots.forEach((slot, index) => {
    register(slot.primary, `core-${index + 1}-primary`, day.day);
    register(slot.alternative, `core-${index + 1}-alternative`, day.day);
    register(slot.third, `core-${index + 1}-third`, day.day);
  });
  day.warmup.steps.forEach((item, index) => register(item, `warmup-${index + 1}`, day.day));
  day.finish.steps.forEach((item, index) => {
    if (!(item.choices || []).length) register(item, `recovery-${index + 1}`, day.day);
    (item.choices || []).forEach((choice, choiceIndex) => register(choice, `recovery-${index + 1}-choice-${choiceIndex + 1}`, day.day));
  });
  for (const name of day.optional || []) {
    const item = catalogByName.get(name);
    if (!item) throw new Error(`${day.day}: optional movement is absent from catalog: ${name}`);
    register(item, 'optional', day.day);
  }
}

const manifest = {
  schemaVersion: 1,
  planVersion: 'v5.1',
  generatedAt: new Date().toISOString(),
  qualityReference: 'Pull-up',
  generationStatus: {
    state: 'blocked',
    reason: 'Built-in image generation returned HTTP 403 during the V5.1 remediation pass.',
    regeneratedMovementCount: 0
  },
  movementCount: active.size,
  phaseImageCount: active.size * 3,
  movements: [...active.values()].sort((a, b) => a.name.localeCompare(b.name))
};

const output = new URL('../assets/exercises/v51-active-visual-manifest.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${manifest.movementCount} active movements and ${manifest.phaseImageCount} phase requirements to ${output.pathname}`);
