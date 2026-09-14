/* Run after 20260810_personal_v3.sql. Inserts/updates the approved 120+ Fitness 7 movement catalog. */
globalThis.window = {};
await import('../data/routine.js');
await import('../data/tiered-library.js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
const catalog = window.GYM_COMPANION_TRAINING.catalog;
const payload = catalog.map(item => ({slug:item.slug,name:item.name,target_muscles:item.target_muscles,scheme:item.scheme,cue:item.cue,image_path:item.image_path,alt_text:item.alt_text,active:true,metadata:{movement_pattern:item.movement_pattern,equipment:item.equipment,levels:item.levels}}));
const response = await fetch(`${SUPABASE_URL}/rest/v1/exercise_library?on_conflict=slug`, { method:'POST', headers:{apikey:SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json',prefer:'resolution=merge-duplicates,return=minimal'}, body:JSON.stringify(payload) });
if (!response.ok) throw new Error(await response.text());
console.log(`Seeded ${catalog.length} Fitness 7 Personal V3 movements.`);
