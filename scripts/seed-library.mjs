/* Run once after applying the V3 migration:
 * SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-library.mjs
 */
globalThis.window = {};
await import('../data/routine.js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const source = window.GYM_COMPANION_ROUTINE || [];
const bySlug = new Map();
for (const day of source) for (const slot of day.slots) {
  for (const movement of [slot.primary, slot.alternative, slot.third].filter(Boolean)) {
    bySlug.set(slug(movement.name), {
      slug: slug(movement.name), name: movement.name, target_muscles: day.focus,
      scheme: slot.scheme, cue: slot.cue, image_path: movement.image,
      alt_text: `Fitness 7 illustration: ${movement.name}`, active: true
    });
  }
}
const response = await fetch(`${SUPABASE_URL}/rest/v1/exercise_library?on_conflict=slug`, {
  method: 'POST', headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'content-type': 'application/json', prefer: 'resolution=merge-duplicates,return=minimal'
  }, body: JSON.stringify([...bySlug.values()])
});
if (!response.ok) throw new Error(await response.text());
console.log(`Seeded ${bySlug.size} Fitness 7 exercises.`);
