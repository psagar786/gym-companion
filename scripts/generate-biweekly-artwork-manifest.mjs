import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-routine.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-artwork-registry.js'), 'utf8'), context);
const source = context.window.GYM_COMPANION_BIWEEKLY_ROUTINE;
const registry = context.window.GYM_COMPANION_BIWEEKLY_REGISTRY || { movements: [] };
const movements = new Map((registry.movements || []).map(item => [item.stableMovementId, {
  id: item.stableMovementId, name: item.name, roles: item.roles || [], days: item.compatibleDays || [], sourceSheetRows: item.sourceSheetRows || [], phases: item.imageSet || {}, alt: item.alt, visualReviewStatus: item.visualReviewStatus || 'pending', coachReviewStatus: item.coachReviewStatus || 'pending', assetVersion: item.assetVersion || 'biweekly-v1', phaseBriefs: item.phaseBriefs || null
}]));
const output = {
  manifestVersion: 'biweekly-artwork-v1',
  sourceVersion: source.planVersion,
  generatedAt: new Date().toISOString(),
  movementCount: movements.size,
  phaseImageCount: movements.size * 3,
  movements: [...movements.values()].map(item => ({ ...item, requiredCanvas: { width: 512, height: 512, minimumClearMarginPx: 51 } }))
};
fs.writeFileSync(path.join(root, 'assets/exercises/biweekly-artwork-manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated Bi-weekly artwork manifest: ${output.movementCount} movements / ${output.phaseImageCount} phase images.`);
