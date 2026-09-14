import fs from 'node:fs';
const file = '.codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json';
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
const source = JSON.parse(fs.readFileSync('.codex/v541/artwork-v3/PROMPT-MANIFEST.json', 'utf8'));
const movement = manifest.movements.find((m) => m.canonicalMovementId === 'biweekly-hanging-straight-leg-raise');
const sourceMovement = source.movements.find((m) => m.canonicalMovementId === movement.canonicalMovementId);
if (!movement) throw new Error('Movement not found');
const replace = (prompt, phase) => prompt
  .replace(/^Body position:.*$/m, phase === 'start'
    ? 'Body position: Hang from a fixed pull-up bar with arms straight, shoulders active, legs together and straight below the hips, ribs down, and pelvis neutral.'
    : 'Body position: From the hang, raise both straight legs together until they reach hip height, using a controlled posterior pelvic tilt without swinging.' )
  .replace(/^Grip and stance:.*$/m, 'Grip and stance: Use a shoulder-width overhand grip on the fixed pull-up bar; legs stay together and straight, toes pointed slightly forward, with no kipping.')
  .replace(/^Anatomy:.*$/m, 'Anatomy: Highlight Rectus Abdominis and Iliopsoas with restrained Fitness 7 orange; Rectus Femoris and Obliques with muted blue; Erector Spinae and shoulder stabilizers subtly in desaturated grey-green. Anatomy emphasis must not hide posture, joints, or equipment.')
  .replace(/Camera angle: [^\n]*/, 'Camera angle: Side three-quarter view showing the full pull-up bar, hands, trunk, hips, and feet with clear space around the athlete.');
movement.startPrompt = replace(sourceMovement.startPrompt, 'start');
movement.movementPrompt = replace(sourceMovement.movementPrompt, 'movement');
fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
