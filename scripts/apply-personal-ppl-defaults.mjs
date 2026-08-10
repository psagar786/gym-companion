/* Applies the requested Intermediate PPL twice-weekly future plan to all active members.
 * Run only after the schema migration and seed-tiered-library.mjs succeed.
 */
globalThis.window = {};
await import('../data/routine.js');
await import('../data/tiered-library.js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
const api = async (path, {method='GET',body}={}) => { const response=await fetch(`${SUPABASE_URL}${path}`,{method,headers:{apikey:SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json',prefer:'resolution=merge-duplicates,return=representation'},body:body?JSON.stringify(body):undefined});if(!response.ok)throw new Error(await response.text());return response.status===204?[]:response.json(); };
const members=await api('/rest/v1/profiles?active=is.true&role=eq.member&select=id');
const library=await api('/rest/v1/exercise_library?active=is.true&select=id,slug');
const bySlug=new Map(library.map(item=>[item.slug,item]));
const { levels, templates, habitDefaults }=window.GYM_COMPANION_TRAINING;
for(const member of members){
  await api('/rest/v1/member_training_preferences?on_conflict=member_id',{method:'POST',body:{member_id:member.id,template_key:'ppl',tier:'intermediate'}});
  await api('/rest/v1/member_habit_templates?on_conflict=member_id',{method:'POST',body:{member_id:member.id,habits:habitDefaults}});
  for(const [day_index,day] of templates.ppl.days.entries()){
    const choices=day.candidates.filter(item=>item.levels.includes('intermediate')).slice(0,levels.intermediate.slots);
    const plan=await api('/rest/v1/member_weekly_plans?on_conflict=member_id,day_index',{method:'POST',body:{member_id:member.id,day_index,focus:day.focus,warmup:day.warmup,recovery:day.recovery}});
    await api(`/rest/v1/member_plan_slots?plan_id=eq.${plan[0].id}`,{method:'DELETE'});
    await api('/rest/v1/member_plan_slots',{method:'POST',body:choices.map((item,position)=>({plan_id:plan[0].id,position,exercise_id:bySlug.get(item.slug).id,alternative_exercise_id:bySlug.get(choices[position+1]?.slug)?.id||null}))});
  }
}
console.log(`Applied Intermediate PPL twice-weekly plans to ${members.length} active members.`);
