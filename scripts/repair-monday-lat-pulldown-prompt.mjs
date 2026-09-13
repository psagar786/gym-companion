import fs from 'node:fs';
const file = '.codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json';
const source = JSON.parse(fs.readFileSync('.codex/v541/artwork-v3/PROMPT-MANIFEST.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
const id = 'biweekly-neutral-grip-mag-grip-lat-pulldown';
const movement = manifest.movements.find((m) => m.canonicalMovementId === id);
const base = source.movements.find((m) => m.canonicalMovementId === id);
if (!movement || !base) throw new Error(`Movement not found: ${id}`);
const rewrite = (prompt, phase) => prompt
  .replace(/^Equipment:.*$/m, 'Equipment: Lat-pulldown machine with a close neutral MAG-grip handle and thigh pad.')
  .replace(/^Body position:.*$/m, phase === 'start'
    ? 'Body position: Sit tall under the thigh pad with feet planted, torso nearly upright, arms extended overhead holding the close neutral handle.'
    : 'Body position: Pull the neutral handle down toward the upper chest with elbows traveling down and slightly back; keep the torso nearly upright and shoulder blades depressed.')
  .replace(/^Grip and stance:.*$/m, 'Grip and stance: Use the handle\'s parallel neutral grips at shoulder width; secure both thighs under the pad, feet flat, and keep ribs stacked over the pelvis.')
  .replace(/^Anatomy:.*$/m, 'Anatomy: Highlight Latissimus Dorsi with restrained Fitness 7 orange; Biceps Brachii and Brachialis with muted blue; Lower Trapezius, Rhomboids, and rotator cuff subtly in desaturated grey-green. Anatomy emphasis must not hide posture, joints, or equipment.')
  .replace(/Camera angle: [^\n]*/, 'Camera angle: Front three-quarter view showing the full seat, thigh pad, handle, cable path, hands, elbows, and torso with clear margin.');
movement.startPrompt = rewrite(base.startPrompt, 'start');
movement.movementPrompt = rewrite(base.movementPrompt, 'movement');
fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
