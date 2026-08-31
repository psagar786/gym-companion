import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-artwork-registry.js'), 'utf8'), context);

const registry = context.window.GYM_COMPANION_BIWEEKLY_REGISTRY;
const phases = ['setup', 'move', 'return'];
const rolePriority = { core: 1, warmup: 1, cardio: 1, recovery: 1, optional: 2, alternative: 3 };
const phrase = (value, fallback) => String(value || fallback).replace(/\s+/g, ' ').trim();
const phaseDirection = {
  setup: 'no arrow; establish a stable, clearly readable start position',
  move: 'one vivid orange arrow showing the working direction toward the peak contraction',
  return: 'one vivid orange arrow showing the controlled return direction; show a visible midpoint, never the exact start pose'
};

function priority(movement) {
  return Math.min(...(movement.roles || []).map(role => rolePriority[role] || 9));
}

function promptFor(movement, phase) {
  const brief = movement.phaseBriefs?.[phase] || {};
  const instruction = typeof brief === 'string' ? brief : brief.instruction;
  const directionCue = typeof brief === 'object' ? brief.directionCue : '';
  const gripCue = typeof brief === 'object' ? brief.gripCue : '';
  return [
    'Use case: scientific-educational',
    'Asset type: Fitness 7 exercise detail illustration, one phase of a three-frame instructional sequence',
    `Primary request: ${movement.name}, ${phase} phase. ${phrase(instruction, `Show the ${phase} position with technically correct mechanics.`)}`,
    'Scene/backdrop: a clean charcoal Fitness 7 gym illustration backdrop',
    `Subject: one adult athlete in a black training kit using ${phrase(movement.equipment, 'the required exercise equipment')}; same side three-quarter camera angle and lighting for the complete sequence`,
    'Style/medium: premium flat-meets-3D fitness instruction illustration; off-white athlete and equipment highlights; restrained vivid orange only for movement path or target-muscle emphasis',
    'Composition/framing: exactly one full athlete and the necessary equipment in a square composition; keep every limb and equipment end inside a minimum 10 percent clear margin',
    `Phase direction: ${phaseDirection[phase]}. ${phrase(directionCue, 'Use a natural, mechanically accurate range of motion.')}`,
    `Grip and posture: ${phrase(gripCue, 'Show a stable neutral grip and braced posture where appropriate.')}`,
    `Target areas: ${(movement.targetGroups || []).join(', ') || 'the exercise target muscles'}`,
    'Constraints: exactly one pose for this phase; no collage, no mirrored duplicate pose, no text, no logos, no watermark, no grids, no unrelated equipment, no cropped limbs, no exaggerated unsafe range'
  ].join('\n');
}

const movements = [...(registry.movements || [])]
  .filter(movement => movement.artworkStatus !== 'complete')
  .sort((a, b) => priority(a) - priority(b) || a.name.localeCompare(b.name));

const queue = {
  queueVersion: 'biweekly-artwork-production-v1',
  createdAt: new Date().toISOString(),
  movementSetCount: movements.length,
  frameCount: movements.length * phases.length,
  phases,
  items: movements.flatMap(movement => phases.map(phase => ({
    stableMovementId: movement.stableMovementId,
    name: movement.name,
    phase,
    rolePriority: priority(movement),
    roles: movement.roles || [],
    equipment: movement.equipment || '',
    targetGroups: movement.targetGroups || [],
    output: movement.imageSet?.[phase] || null,
    alt: `${movement.alt || movement.name} — ${phase} phase`,
    prompt: promptFor(movement, phase),
    status: 'pending'
  })))
};

const output = path.join(root, 'assets/exercises/biweekly-artwork-production-queue.json');
fs.writeFileSync(output, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Built artwork queue: ${queue.movementSetCount} movement sets / ${queue.frameCount} frames.`);
