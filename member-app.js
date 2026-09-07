let createClient;
async function ensureSupabase() {
  if (!createClient) {
    const module = await import('https://esm.sh/@supabase/supabase-js@2.45.4');
    createClient = module.createClient;
  }
  return createClient;
}
import { MEMBER_USERNAME, clearDemoSession, demoAccountMessage, isDemoCredential, readDemoMember, restoreDemoSession, saveDemoSession, writeDemoMember } from './demo-mode.js';

const config = window.GYM_COMPANION_CONFIG;
const routine = window.GYM_COMPANION_ROUTINE || [];
const v5Routine = window.GYM_COMPANION_V5_ROUTINE || [];
const biweekly = window.GYM_COMPANION_BIWEEKLY_ROUTINE || { planVersion:'biweekly-v1', days:[] };
const biweeklyArtwork = window.GYM_COMPANION_BIWEEKLY_REGISTRY || { movements:[] };
const training = window.GYM_COMPANION_TRAINING || { catalog: [], levels: {}, templates: {}, habitDefaults: [] };
const v53Content = window.GYM_COMPANION_V53_CONTENT || { warmup: [], tendon: [] };
const v53Plan = window.GYM_COMPANION_V53_THREEWEEK || window.GYM_COMPANION_V53_PLAN || { key:'threeweek-ppl', planVersion:'threeweek-ppl-v1', rotation:['Primary','Alternative 1','Option 2'], tendon:[], warmup:[] };
const periodized = window.GYM_COMPANION_PERIODIZED_ABC || { key:'periodized-abc', planVersion:'periodized-abc-v1', cadence:['A','B','A','C'], days:[] };
const periodizedArtwork = window.GYM_COMPANION_PERIODIZED_ARTWORK || { movements:{} };
const app = document.querySelector('#app');
const RELEASE_VERSION = '5.4';
const preferenceKey = 'gym-companion-v3-member-auth-storage';
const createSupabase = remember => config.supabaseUrl && config.supabaseAnonKey && createClient ? createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { detectSessionInUrl:true, persistSession:true, storage: remember ? localStorage : sessionStorage } }) : null;
let supabase = createSupabase(localStorage.getItem(preferenceKey) === 'remembered');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[character]));
function previewImage(item) {
  const imageSet=item?.imageSet||{};
  return imageSet.movement||imageSet.move||imageSet.start||imageSet.setup||imageSet.return||item?.image_path||item?.image||'';
}
function imageMarkup(item, className='visual') {
  const path=previewImage(item), name=item?.title||item?.name||'Exercise';
  const alt=item?.alt_text||item?.alt||`Fitness 7 illustration: ${name}`;
  const status=item?.artworkStatus==='pending' ? 'Artwork in production' : 'Artwork pending';
  const encodedPath=escapeHtml(path);
  return `<span class="${className} image-frame ${path?'has-image':'no-image'}" data-image-path="${encodedPath}" role="img" aria-label="${escapeHtml(alt)}" title="${escapeHtml(path||'No artwork path configured')}">${path?`<img src="${encodedPath}" alt="${escapeHtml(alt)}" loading="lazy" onload="this.parentElement.classList.add('asset-loaded')" onerror="window.fitness7ImageError(this)">`:''}<span class="asset-placeholder-label">${status}</span></span>`;
}
window.fitness7ImageError = image => {
  const frame=image?.parentElement;
  if(!frame) return;
  frame.classList.remove('has-image','asset-loaded');
  frame.classList.add('asset-missing');
  image.remove();
  console.warn('[Fitness 7] Artwork unavailable:', frame.dataset.imagePath||'unknown path');
};
const logo = '<span class="brand"><img src="assets/fitness7-hero-logo.png" alt="Fitness 7"></span>';
const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const scheduledDate = index => { const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate()+((index+1-date.getDay()+7)%7)); return date; };
const initialDayIndex = () => { const weekday=new Date().getDay(); return weekday>=1&&weekday<=6 ? weekday-1 : 0; };
const emptyProgress = () => ({slots:{},choices:{},warmup:{},tendon:{},recovery:{},extras:{}});
const dayGroups = [['back','biceps'],['chest','triceps'],['core'],['legs'],['shoulders','biceps','triceps'],['core','biceps','triceps']];
const state = { user:null,profile:null,membership:null,plans:[],sessions:[],library:[],preferences:{template_key:'periodized-abc',tier:'intermediate'},extras:[],guidedExtras:{},habitTemplate:training.habitDefaults,habitLog:{},screen:'home',dayIndex:initialDayIndex(),detailItem:null,showExtras:false,calendarMonth:new Date(new Date().getFullYear(),new Date().getMonth(),1),historyDate:null,message:'',demo:false };
const tierDefaults = {
  beginner: { label:'Beginner', summary:'Build repeatable technique with stable volume.', rir:'3 RIR', tempo:'3–1–2', progression:'Add reps first. Add the smallest load only after every rep is controlled.', extras:'Normally 0–1 optional extra.' },
  intermediate: { label:'Intermediate', summary:'Progress compounds and accessories without sacrificing form.', rir:'1–2 RIR', tempo:'2–1–2', progression:'Use double progression: reach the rep ceiling, then add the smallest practical load.', extras:'Up to 2 optional extras.' },
  expert: { label:'Expert', summary:'Higher loading and volume with deliberate fatigue control.', rir:'1 RIR', tempo:'3–0–1', progression:'Progress one variable at a time; only the final isolation set may reach 0–1 RIR.', extras:'Up to 2 optional extras; never use forced reps by default.' }
};
const demoProfile = { age:'33', height:'167.6 cm', weight:'87 kg', target:'70–75 kg', goal:'Sustainable fat loss while retaining muscle', frequency:'6 days / week', timeline:'6–12 months' };
const dayOutcomes = [
  {name:'Pull A', week:'Establish cleaner vertical pulls and a repeatable back-training baseline.', month:'Better lat engagement, grip tolerance, and control through rows and curls.', quarter:'Measurable rep or load progress with stronger back and biceps control.', half:'More visible back width and arm proportion may develop with consistent recovery and nutrition.'},
  {name:'Push A', week:'Build a stable pressing setup and learn consistent chest and triceps paths.', month:'Improve pressing work capacity and control through chest-focused ranges.', quarter:'Measurable press progression and improved upper-chest and triceps development.', half:'Chest shape and pressing strength may become more apparent with steady adherence.'},
  {name:'Legs A', week:'Establish comfortable squat, hinge, and single-leg movement patterns.', month:'Improve lower-body work capacity, balance, and controlled training depth.', quarter:'Build measurable squat or leg-press progress with stronger quads and hamstrings.', half:'Leg shape, balance, and overall lower-body strength may improve with adequate recovery.'},
  {name:'Pull B', week:'Learn distinct upper-back angles without relying on momentum.', month:'Improve scapular control, rowing endurance, and biceps consistency.', quarter:'Progress row and pulldown performance while improving upper-back density.', half:'Back thickness and arm balance may become more visible when training remains consistent.'},
  {name:'Push B', week:'Establish shoulder-friendly pressing and lateral-raise mechanics.', month:'Improve delt control and triceps endurance without excessive joint stress.', quarter:'Build measurable shoulder-press and accessory progress across multiple angles.', half:'Shoulder cap and upper-body proportion may improve with consistent technique and recovery.'},
  {name:'Legs B + Core', week:'Establish stable posterior-chain and trunk-bracing patterns.', month:'Improve hamstring, glute, calf, and core work capacity.', quarter:'Progress hinge and core-control performance while improving lower-body balance.', half:'Posterior-chain strength, trunk control, and lower-body proportion may become more apparent.'}
];

function notice() { return state.message ? `<p class="notice">${escapeHtml(state.message)}</p>` : ''; }
function banner() { return state.demo ? '<aside class="preview-banner demo-banner"><b>Demo mode</b><span>Sample-only account — changes stay in this browser and are never sent to Fitness 7 or Supabase.</span></aside>' : ''; }
function header() { const name = state.profile?.full_name || state.user?.email || 'Member'; return `<header class="topbar">${logo}<span class="version-badge">V${RELEASE_VERSION}</span><div class="topbar-actions"><button class="pill" data-screen="plan">My plan</button><button class="avatar" data-screen="profile" aria-label="Open profile">${escapeHtml(name.slice(0,1).toUpperCase())}</button></div></header>`; }
function biweeklyReadiness() {
  const movements=biweeklyArtwork.movements||[];
  const approved=movements.filter(item=>item.artworkStatus==='complete'&&item.visualReviewStatus==='approved'&&item.coachReviewStatus==='approved');
  return { ready: movements.length>0&&approved.length===movements.length, approved:approved.length, total:movements.length };
}
function biweeklyPreviewMode() { return ['biweekly','periodized-abc'].includes(state.preferences.template_key)&&!biweeklyReadiness().ready; }
function effectiveTemplateKey() { return state.preferences.template_key==='ppl' ? 'v5ppl' : state.preferences.template_key; }
function currentTemplate() { return effectiveTemplateKey()==='periodized-abc' ? { name:periodized.name||'3-Week Periodized A-B-C Activity', days:periodized.days.filter(day=>day.weekKey==='A'&&day.dayIndex<6) } : effectiveTemplateKey()==='threeweek-ppl' ? { name:v53Plan.name||v53Plan.label||'3-Week PPL Rotation', days:v5Routine } : effectiveTemplateKey()==='biweekly' ? { name:'Bi-Weekly Activity', days:[] } : (training.templates[effectiveTemplateKey()] || training.templates.v5ppl); }
function activeSourceVersion() { return effectiveTemplateKey()==='periodized-abc' ? periodized.planVersion : effectiveTemplateKey()==='threeweek-ppl' ? v53Plan.planVersion : effectiveTemplateKey()==='biweekly' ? 'biweekly-v1' : 'v5'; }
function mondayIso(date=new Date()) { const value=new Date(date); value.setHours(0,0,0,0); value.setDate(value.getDate()-((value.getDay()+6)%7)); return iso(value); }
function rotationWeek(date=new Date(), anchorIso=state.preferences.rotation_anchor_date||mondayIso(new Date())) {
  const anchor=new Date(`${anchorIso}T00:00:00`);
  const monday=new Date(date); monday.setHours(0,0,0,0); monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
  const diff=Math.floor((monday-anchor)/86400000/7);
  return ((diff%3)+3)%3+1;
}
function threeWeekPlan(dayIndex, date=scheduledDate(dayIndex)) {
  const week=rotationWeek(date), tier=state.preferences.tier||'intermediate';
  const resolved=v53Plan.resolveDay ? v53Plan.resolveDay(dayIndex,{weekIndex:week,tier}) : null;
  if(!resolved)return null;
  const sourceWarmup=resolved.warmup||v5Routine[dayIndex]?.warmup?.steps||[];
  const warmup=[...sourceWarmup,...(v53Plan.warmup?.[dayIndex]||v53Content.warmup?.[dayIndex]||[])];
  const tendon=v53Content.tendon?.[dayIndex]||[];
  const slots=(resolved.coreSlots||[]).map((slot,position)=>({id:slot.id,position,exercise:routineExercise(slot.primary),alternative:routineExercise(slot.alternative),third:routineExercise(slot.third)}));
  return {id:`threeweek-plan-${dayIndex}`,day_index:dayIndex,focus:resolved.focus,weekKey:`Week ${week}`,rotationWeek:week,defaultChoice:week-1,warmup,tendon,recovery:resolved.recovery||v5Routine[dayIndex]?.finish?.steps||[],member_plan_slots:slots,extras:(resolved.optionalSlots||[]).map(item=>routineExercise(item))};
}
function biweeklyWeekKey(date=new Date()) {
  const anchor=new Date(`${biweekly.anchorDate||'2026-08-24'}T00:00:00`);
  const monday=new Date(date); monday.setHours(0,0,0,0); monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
  const diff=Math.floor((monday-anchor)/86400000/7);
  return ((diff%2)+2)%2===0?'A':'B';
}
function biweeklyDay(dayIndex, date=scheduledDate(dayIndex)) { return biweekly.days.find(day=>day.weekKey===biweeklyWeekKey(date)&&day.dayIndex===dayIndex) || biweekly.days.find(day=>day.weekKey==='A'&&day.dayIndex===dayIndex); }
function periodizedWeekKey(date=new Date()) {
  const anchor=new Date(`${periodized.anchorDate||mondayIso(new Date())}T00:00:00`);
  const monday=new Date(date); monday.setHours(0,0,0,0); monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
  const diff=Math.floor((monday-anchor)/86400000/7);
  const index=((diff%periodized.cadence.length)+periodized.cadence.length)%periodized.cadence.length;
  return periodized.cadence[index]||'A';
}
function periodizedDay(dayIndex, date=scheduledDate(dayIndex)) { const key=periodizedWeekKey(date); return periodized.days.find(day=>day.weekKey===key&&day.dayIndex===dayIndex) || periodized.days.find(day=>day.weekKey==='A'&&day.dayIndex===dayIndex); }
function biweeklyRegistryRecord(name) {
  const slug=slugify(name);
  const staged=Object.values(periodizedArtwork.movements||{}).find(record => record.stableMovementId===slug || record.name===name || (record.aliases||[]).includes(name));
  if (staged) return staged;
  return (biweeklyArtwork.movements||[]).find(record => record.stableMovementId===slug || record.name===name || (record.aliases||[]).includes(name));
}
function biweeklyItem(item) {
  if(!item)return null;
  const registry=biweeklyRegistryRecord(item.name);
  const imageSet=registry?.imageSet||item.imageSet||{};
  const exercise={
    id:item.id,
    stableMovementId:registry?.stableMovementId||item.stableMovementId||slugify(item.name),
    slug:slugify(item.name),
    name:item.name,
    image_path:imageSet.movement||imageSet.move||imageSet.start||imageSet.setup||item.image,
    imageSet,
    alt_text:registry?.alt||item.alt_text||`Fitness 7 illustration: ${item.name}`,
    target_muscles:(item.targetGroups||registry?.targetGroups||[]).join(' + ')||'',
    targetGroups:item.targetGroups||registry?.targetGroups||[],
    primaryTargets:item.primaryTargets||registry?.primaryTargets||item.targetGroups||registry?.targetGroups||[],
    secondaryTargets:item.secondaryTargets||registry?.secondaryTargets||[],
    equipment:item.equipment||registry?.equipment,
    equipmentStatus:item.equipmentStatus||registry?.equipmentStatus,
    artworkStatus:registry?.artworkStatus||'pending',
    description:item.description||item.cardDescription||registry?.description||registry?.cardDescription,
    cardDescription:item.cardDescription||item.description||registry?.cardDescription||registry?.description,
    scheme:item.prescriptions?.[state.preferences.tier]||'',
    prescriptions:item.prescriptions,
    levelEligibility:item.levelEligibility,
    cue:item.cue,
    why:item.detailContent?.why||item.why,
    commonMistake:item.detailContent?.commonMistake||item.commonMistake,
    safetyCue:item.detailContent?.safetyCue||item.safetyCue,
    phaseBriefs:item.detailContent?.phaseBriefs||item.phaseBriefs,
    sourceSheetRow:item.sourceSheetRow,
    sourceSheetRows:item.sourceSheetRows||[item.sourceSheetRow],
    role:item.role,
    phase:item.phase,
    isOptional:item.role==='optional'
  };
  // In review preview, retain the actual alternative record even while its art
  // is being produced. It never borrows the primary movement's image set.
  if(item.__alternative && exercise.artworkStatus!=='complete' && !biweeklyPreviewMode()) return null;
  return normalizeExercise(exercise);
}
function biweeklySourceItemById(id) { for (const day of biweekly.days || []) { const item=[...(day.warmup||[]),...(day.coreSlots||[]),...(day.optionalSlots||[]),...(day.cardio||[]),...(day.recovery||[])].find(candidate=>candidate.id===id); if(item) return item; } return null; }
function periodizedSourceItemById(id) { for (const day of periodized.days || []) { const item=[...(day.warmup||[]),...(day.coreSlots||[]),...(day.optionalSlots||[]),...(day.cardio||[]),...(day.recovery||[])].find(candidate=>candidate.id===id); if(item) return item; } return null; }
function resolveExerciseById(id) { return state.library.map(normalizeExercise).find(item=>item.id===id) || training.catalog.find(item=>item.id===id) || (state.preferences.template_key==='periodized-abc' ? biweeklyItem(periodizedSourceItemById(id)) : state.preferences.template_key==='biweekly' ? biweeklyItem(biweeklySourceItemById(id)) : null); }
function biweeklyPlan(dayIndex, date=scheduledDate(dayIndex)) {
  const day=biweeklyDay(dayIndex,date); if(!day)return null;
  const tier=state.preferences.tier||'intermediate';
  const tierPlan=day.tierPlans?.[tier]||{};
  const sourceSlots=tierPlan.coreSlots?.length?tierPlan.coreSlots:(day.coreSlots||[]);
  const slots=sourceSlots.map((item,position)=>({id:item.id,position,exercise:biweeklyItem(item),alternative:item.alternatives?.[0]?biweeklyItem({...item,__alternative:true,id:`${item.id}-alt-1`,name:item.alternatives[0],imageSet:{}}):null,third:item.alternatives?.[1]?biweeklyItem({...item,__alternative:true,id:`${item.id}-alt-2`,name:item.alternatives[1],imageSet:{}}):null}));
  const guided=items=>items.map(item=>{const normalized=biweeklyItem(item);return normalized?({...normalized,title:item.name,duration:item.prescriptions?.[state.preferences.tier]||normalized.scheme||'',image:previewImage(normalized),alt:normalized.alt_text||`Fitness 7 illustration: ${item.name}`,recommended:true}):null;}).filter(Boolean);
  const optionalSource=tierPlan.optionalSlots?.length?tierPlan.optionalSlots:(day.optionalSlots||[]);
  return {id:`biweekly-${day.weekKey}-${day.dayIndex}`,day_index:dayIndex,weekKey:day.weekKey,focus:day.focus,targetGroups:day.targetGroups,warmup:guided(day.warmup),tendon:v53Plan.tendon?.[dayIndex]||v53Content.tendon?.[dayIndex]||[],recovery:guided([...day.cardio,...day.recovery]),member_plan_slots:slots,extras:optionalSource.map(biweeklyItem)};
}
function periodizedPlan(dayIndex, date=scheduledDate(dayIndex)) {
  const day=periodizedDay(dayIndex,date); if(!day)return null;
  const tier=state.preferences.tier||periodized.defaultTier||'intermediate';
  const sourceSlots=day.coreSlots||[];
  const slots=sourceSlots.map((item,position)=>({id:item.id,position,exercise:biweeklyItem(item),alternative:item.alternatives?.[0]?biweeklyItem({...item,id:`${item.id}-alt-1`,name:item.alternatives[0],__alternative:true,imageSet:{}}):null,third:item.alternatives?.[1]?biweeklyItem({...item,id:`${item.id}-alt-2`,name:item.alternatives[1],__alternative:true,imageSet:{}}):null}));
  const guided=items=>(items||[]).map(item=>{const normalized=biweeklyItem(item);return normalized?({...normalized,title:item.name,duration:item.prescriptions?.[tier]||normalized.scheme||'',image:previewImage(normalized),alt:normalized.alt_text||`Fitness 7 illustration: ${item.name}`,recommended:true}):null;}).filter(Boolean);
  const optional=(day.optionalSlots||[]).filter(item=>item.levelEligibility?.[tier]!==false).map(item=>biweeklyItem(item)).filter(Boolean);
  return {id:`periodized-${day.weekKey}-${day.dayIndex}`,day_index:dayIndex,weekKey:day.weekKey,focus:day.focus,targetGroups:day.targetGroups,warmup:guided(day.warmup),tendon:v53Content.tendon?.[dayIndex]?[v53Content.tendon[dayIndex]]:[],recovery:guided([...(day.cardio||[]),...(day.recovery||[])]),member_plan_slots:slots,extras:optional,rotationWeek:periodized.cadence.indexOf(day.weekKey)+1,defaultChoice:0};
}
const slugify = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
function targetGroupsForDay(index) {
  const key=effectiveTemplateKey();
  if(key==='periodized-abc') return periodizedDay(index,scheduledDate(index))?.targetGroups || dayGroups[index] || [];
  if(key==='threeweek-ppl') return v53Plan.days?.[1]?.[index]?.targetGroups || dayGroups[index] || [];
  return key==='biweekly' ? (biweeklyDay(index,scheduledDate(index))?.targetGroups || dayGroups[index] || []) : (currentTemplate()?.days?.[index]?.targetGroups || dayGroups[index] || []);
}
function libraryBySlug(value) { const slug=slugify(value); return normalizeExercise(state.library.find(item => item.slug === value || item.slug === slug) || training.catalog.find(item => item.slug === value || item.slug === slug)); }
function planSlots(plan) { return [...(plan?.member_plan_slots || [])].sort((a,b) => a.position-b.position); }
function habitCompleteCount() { return Object.values(state.habitLog || {}).filter(Boolean).length; }
function hasCheckedValue(group) { return Object.values(group || {}).some(Boolean); }
function hasWorkoutActivity(session) { const progress=session?.progress||{}; return ['slots','warmup','tendon','recovery','extras'].some(key=>hasCheckedValue(progress[key])); }
function visibleSessions() { return state.sessions.filter(hasWorkoutActivity); }
function movementClass(item) {
  const text=`${item?.movement_pattern||''} ${item?.name||item?.title||''}`.toLowerCase();
  if (/cardio|walk|bike|interval|stretch|mobility|rehearsal|circle|rotation|rock|march/.test(text)) return 'guided';
  if (/squat|deadlift|rdl|press|pull-up|pulldown|row|lunge|leg press|hip extension/.test(text)) return 'compound';
  if (/plank|pallof|dead bug|crunch|knee raise/.test(text)) return 'core';
  return 'isolation';
}
function prescriptionTierKey(tier) { return tier==='expert' ? 'advanced' : tier; }
function parsePrescriptionText(value) {
  const text=String(value||'').replace(/×/g,'x').replace(/\s+/g,' ').trim();
  if(!text) return null;
  const restMatch=text.match(/rest\s*:?\s*(\d+(?:\s*[–-]\s*\d+)?)\s*(?:sec|s|seconds?)/i) || text.match(/(\d+(?:\s*[–-]\s*\d+)?)\s*(?:sec|s|seconds?)\s*rest/i);
  const rest=restMatch?.[1] ? `${restMatch[1].replace(/\s*[–-]\s*/,'–')} sec` : null;
  const setMatch=text.match(/(\d+(?:\s*[–-]\s*\d+)?)\s*(?:sets?|rounds?)\b/i) || text.match(/^(\d+(?:\s*[–-]\s*\d+)?)\s*x\s*/i);
  const sets=setMatch?.[1]?.replace(/\s*[–-]\s*/,'–')||null;
  const durationMatch=text.match(/(\d+(?:\s*[–-]\s*\d+)?)\s*(sec|seconds?|min|minutes?)\b/i);
  const repsMatch=text.match(/(?:x\s*)?(\d+(?:\s*[–-]\s*\d+)?)\s*(?:reps?|repetitions?)\b/i) || (!durationMatch ? text.match(/x\s*(\d+(?:\s*[–-]\s*\d+)?)/i) : null);
  const reps=repsMatch?.[1]?.replace(/\s*[–-]\s*/,'–')||null;
  const duration=durationMatch ? `${durationMatch[1].replace(/\s*[–-]\s*/,'–')} ${durationMatch[2].toLowerCase().startsWith('min')?'min':'sec'}` : null;
  const side=text.match(/(\d+(?:\s*[–-]\s*\d+)?)\s*(?:each\s+side|\/side|each\s+direction|\/direction|per\s+side)/i)?.[1];
  const trainingMethod=/isometric|hold/i.test(text)?'Isometric hold':/superset/i.test(text)?'Superset':/circuit/i.test(text)?'Circuit':/drop\s*set/i.test(text)?'Drop set':/interval/i.test(text)?'Interval':null;
  if(!sets && !reps && !duration && !side) return null;
  return {sets:sets||null,reps:reps||side||null,duration:duration||null,rest,trainingMethod,sourceText:text};
}
function authoredPrescription(item,tier) {
  const key=prescriptionTierKey(tier), source=item?.prescriptions?.[key] ?? item?.prescriptions?.[tier];
  const candidate=typeof source==='string' ? source : source?.displayDose||source?.scheme||source?.dose||item?.scheme||item?.duration;
  return parsePrescriptionText(candidate);
}
function rolePrescriptionDefault(item,tier) {
  const kind=movementClass(item), unilateral=/single|alternating|lunge|split|\/side|\/leg/i.test(`${item?.name||''} ${item?.scheme||''}`), suffix=unilateral?'/side':'';
  if(kind==='guided') return {sets:'1',reps:'8',duration:null,rest:'20 sec',trainingMethod:/isometric|hold/i.test(`${item?.name||''} ${item?.movement_pattern||''}`)?'Isometric hold':null};
  const values={
    beginner: kind==='compound'?{sets:'2–3',reps:`10–12${suffix}`,rest:'90 sec'}:kind==='core'?{sets:'2',reps:`8–12${suffix}`,rest:'45–60 sec'}:{sets:'2',reps:`12–15${suffix}`,rest:'60 sec'},
    intermediate: kind==='compound'?{sets:'3',reps:`6–10${suffix}`,rest:'90–120 sec'}:kind==='core'?{sets:'3',reps:`10–15${suffix}`,rest:'45–60 sec'}:{sets:'3',reps:`10–15${suffix}`,rest:'60–75 sec'},
    expert: kind==='compound'?{sets:'4',reps:`5–8${suffix}`,rest:'120–150 sec'}:kind==='core'?{sets:'3–4',reps:`10–15${suffix}`,rest:'60 sec'}:{sets:'3–4',reps:`8–15${suffix}`,rest:'60–75 sec'}
  };
  return values[tier]||values.intermediate;
}
function progressionFor(item) {
  const kind=movementClass(item), text=`${item?.equipment||''} ${item?.name||''}`.toLowerCase();
  if(kind==='guided' && /cardio|walk|bike|treadmill/.test(text)) return 'Increase either duration by two minutes or incline/resistance by one small level; change one variable per week.';
  if(kind==='guided') return 'Progress by improving comfortable range, control, or smoothness. Do not add load to force range.';
  if(/machine|cable|pulldown|leg press/.test(text)) return 'Reach the top of the rep range on every set for two sessions, then move up one small stack increment.';
  if(/curl|raise|fly|extension|kickback/.test(text)) return 'Add controlled reps to the top of the range for two sessions, then use the smallest available load increase.';
  if(/bodyweight|pull.?up|push.?up|plank|crunch|knee raise/.test(text)) return 'Reach the top of the rep or time range with control, then reduce assistance or use a harder leverage.';
  if(/isometric|hold/.test(text)) return 'Add five seconds per hold until 45 seconds is comfortable, then increase resistance slightly.';
  return 'When every set reaches the top of the rep range for two sessions with clean form, add the smallest practical load.';
}
function tierPrescription(item, tier=state.preferences.tier) {
  const parsed=authoredPrescription(item,tier)||rolePrescriptionDefault(item,tier), defaults=tierDefaults[tier]||tierDefaults.intermediate;
  const isCardio=movementClass(item)==='guided'&&/cardio|walk|bike|treadmill/i.test(`${item?.name||''} ${item?.title||''} ${item?.equipment||''}`);
  const sets=isCardio&& !parsed.sets ? '' : (parsed.sets||'1'), reps=parsed.reps||null, duration=parsed.duration||null, rest=parsed.rest||'As needed';
  const dose=duration ? (sets ? `${sets} ${sets==='1'?'set':'sets'} × ${duration}` : duration) : `${sets} ${sets==='1'?'set':'sets'} × ${reps||'as prescribed'}`;
  return { ...parsed, sets, reps, duration, rest, level:defaults.label, scheme:`${dose} · ${rest}`, displayDose:dose, displayRest:rest==='As needed'?'Rest as needed':`${rest} rest`, rir:defaults.rir, tempo:defaults.tempo, progression:progressionFor(item), intensity:tier==='expert'&&movementClass(item)==='isolation'?'Final isolation set may approach technical fatigue; no forced reps.':'' };
}
function prescribeExercise(item,tier=state.preferences.tier) { if(!item)return item; const prescription=tierPrescription(item,tier); return {...item,scheme:prescription.scheme,tierPrescription:prescription}; }
function prescribePlan(plan,tier=state.preferences.tier) { if(!plan)return plan; return {...plan,member_plan_slots:planSlots(plan).map(slot=>({...slot,exercise:prescribeExercise(slot.exercise,tier),alternative:prescribeExercise(slot.alternative,tier),third:prescribeExercise(slot.third,tier)}))}; }
function inferredGroups(item) {
  if (Array.isArray(item?.targetGroups) && item.targetGroups.length) return item.targetGroups;
  const text=`${item?.target_muscles||''} ${item?.targets||''} ${item?.movement_pattern||''} ${item?.name||''}`.toLowerCase();
  const groups=new Set();
  if (/chest|pectoral|fly|horizontal press/.test(text)) groups.add('chest');
  if (/triceps|elbow extension/.test(text)) groups.add('triceps');
  if (/lat|back|row|rear delt|pulldown|pullover|shoulder extension/.test(text)) groups.add('back');
  if (/biceps|brachialis|forearm|curl|elbow flexion/.test(text)) groups.add('biceps');
  if (/shoulder|side delt|front delt|lateral|vertical press|abduction/.test(text)) groups.add('shoulders');
  if (/quad|glute|hamstring|calf|squat|lunge|hinge|leg|hip extension|knee flexion|knee extension/.test(text)) groups.add('legs');
  if (/abs|core|oblique|trunk|plank|pallof|dead bug|conditioning|cardio|treadmill|bike/.test(text)) groups.add('core');
  return [...groups];
}
function coachingFor(item) {
  const name=String(item?.name||item?.title||'Exercise'), lower=name.toLowerCase(), target=item?.target_muscles||item?.targets||'the working muscles';
  if(/shoulder circles/.test(lower)) return {description:'Stand tall and make smooth circles from the shoulders, gradually increasing the arc.',why:'Raises shoulder temperature and rehearses pain-free range before pressing or pulling.',commonMistake:'Shrugging the neck or moving only the hands.',safetyCue:'Use a smaller circle if the front of the shoulder pinches.',progression:'Increase the circle size before adding repetitions.'};
  if(/around.the.world/.test(lower)) return {description:'Hold the stick wide and trace a slow circle around the head while keeping ribs stacked.',why:'Prepares overhead shoulder control across the angles used in pressing and pulling.',commonMistake:'Arching the lower back to force the stick overhead.',safetyCue:'Widen the grip and stop before shoulder pain.',progression:'Use a slightly narrower grip only when the full arc is comfortable.'};
  if(/thoracic|trunk rotation|rotation/.test(lower)) return {description:'Keep the pelvis quiet and rotate through the ribcage, then return under control.',why:'Gives the upper back the rotation needed to brace and position the shoulders.',commonMistake:'Twisting from the knees or snapping into the end range.',safetyCue:'Keep the range easy and stop for sharp back pain.',progression:'Add one slow repetition per side while keeping the hips still.'};
  if(/pull.?up|pulldown/.test(lower)) return {description:'Start tall with shoulders set, then drive the elbows down and return without swinging.',why:'Builds vertical pulling strength for back width while keeping the shoulder path controlled.',commonMistake:'Leading with the chin or shrugging toward the ears.',safetyCue:'Use assistance or a lighter load if the shoulders lose position.',progression:'Add one controlled repetition before increasing load.'};
  if(/row/.test(lower)) return {description:'Brace the trunk, reach until the shoulder blades glide, then pull elbows toward the ribs.',why:'Adds upper-back thickness and reinforces stable scapular control.',commonMistake:'Jerking the weight or lifting the chest to finish the rep.',safetyCue:'Stop the pull when the shoulders would roll forward.',progression:'Add load only after every rep pauses cleanly at the squeeze.'};
  if(/curl/.test(lower)) return {description:'Keep elbows near the torso, curl without rocking, and lower until the elbow is comfortably extended.',why:'Trains elbow flexors through a repeatable range without borrowing momentum from the back.',commonMistake:'Swinging the shoulders or letting wrists fold.',safetyCue:'Use a lighter load if the front of the elbow becomes painful.',progression:'Reach the top of the rep range with strict form, then add the smallest load.'};
  if(/press|push-up|fly/.test(lower)) return {description:'Set the shoulder blades, keep wrists stacked, and press or arc through a pain-free range.',why:'Builds pressing strength while distributing work across the chest, shoulders, and triceps.',commonMistake:'Flaring the elbows or losing rib control at the bottom.',safetyCue:'Shorten the range if the shoulder feels pinched.',progression:'Add reps first, then a small load increase when the target range is controlled.'};
  if(/squat|lunge|leg press/.test(lower)) return {description:'Brace before the descent, track knees with the toes, and drive through the whole foot to stand.',why:'Builds useful leg strength while keeping the knee and hip path predictable.',commonMistake:'Letting the knees collapse inward or the hips lift from the support.',safetyCue:'Use a depth that keeps the foot planted and the spine comfortable.',progression:'Add a rep per set before increasing load.'};
  if(/deadlift|rdl|hinge/.test(lower)) return {description:'Push the hips back with a long spine, keep the weight close, then squeeze the glutes to stand.',why:'Loads the hamstrings and glutes without turning the movement into a back bend.',commonMistake:'Rounding the lower back or reaching the weight away from the legs.',safetyCue:'Stop the descent when the spine would lose its neutral shape.',progression:'Increase range before load, then add small weight increments.'};
  if(/plank|pallof|dead bug|crunch|knee raise/.test(lower)) return {description:'Brace the trunk, breathe behind the brace, and move only the limbs or cable path you can control.',why:'Builds trunk stiffness that supports heavier pressing, pulling, and leg work.',commonMistake:'Holding the breath or letting the ribs flare.',safetyCue:'Reduce the lever or load when the low back starts to arch.',progression:'Add time or repetitions while keeping the same breathing pattern.'};
  if(/calf/.test(lower)) return {description:'Use the full ankle range, pause at the top, and lower slowly into the stretch.',why:'Builds calf capacity for walking, squatting, and ankle control.',commonMistake:'Bouncing through the bottom or rolling the ankle outward.',safetyCue:'Use support and stop for sharp Achilles pain.',progression:'Add a pause and then small load increases once the range is steady.'};
  return {description:`Perform ${name.toLowerCase()} with a steady tempo and a controlled return.`,why:`Supports the ${target.toLowerCase()} demand of this training day.`,commonMistake:'Using momentum to move past the strongest part of the range.',safetyCue:'Stop for sharp pain, dizziness, or unusual breathlessness.',progression:'Add a controlled repetition before adding load.'};
}
function normalizeExercise(item) { if(!item)return item; const normalized={...item,targetGroups:inferredGroups(item)}; normalized.exerciseType ||= isStretchOrMobility(normalized)?'mobility':'strength'; normalized.isOptional ||= false; const copy=coachingFor(normalized); normalized.description ||= copy.description; normalized.cardDescription ||= copy.description; normalized.why ||= copy.why; normalized.commonMistake ||= copy.commonMistake; normalized.safetyCue ||= copy.safetyCue; normalized.progression ||= copy.progression; normalized.cue ||= copy.description; return normalized; }
function isStretchOrMobility(item) {
  const text=`${item?.exerciseType||''} ${item?.movement_pattern||''} ${item?.name||''} ${item?.title||''}`.toLowerCase();
  const groups=inferredGroups(item);
  return groups.includes('mobility') || /stretch|mobility|warm.?up|recovery|cooldown/.test(text);
}
function isGuidedMovement(item, panel) {
  if (!item || isStretchOrMobility(item)) return false;
  const text=`${item.exerciseType||''} ${item.movement_pattern||''} ${item.name||''} ${item.title||''}`.toLowerCase();
  if (panel==='warmup') return /activation|rehearsal|bodyweight|mobility|warm/.test(text) || inferredGroups(item).includes('core');
  return /cardio|bike|treadmill|walk|zone 2|cooldown|recovery/.test(text);
}
function routineExercise(option) {
  if (!option) return null;
  const found=libraryBySlug(option.name);
  if(found) return normalizeExercise(found);
  const explicit=option.imageSet||{}, image=option.image||explicit.move||explicit.movement||explicit.start||explicit.setup;
  return normalizeExercise({...option,id:option.id||`routine-${slugify(option.name)}`,slug:slugify(option.name),name:option.name,image_path:image,image:image,imageSet:{setup:explicit.setup||explicit.start,move:explicit.move||explicit.movement||image,return:explicit.return||explicit.move||explicit.movement||image},alt_text:option.alt||option.alt_text||`Fitness 7 illustration: ${option.name}`,target_muscles:(option.targetGroups||option.primaryTargets||[]).join(' + '),scheme:option.scheme||option.duration||'',cue:option.cue||option.formCue||''});
}
function tierSlotOption(slot,tier){ if(!slot)return null; const explicit=slot.tierVariants?.[tier]||slot.tierOptions?.[tier]; if(explicit)return explicit; if(tier==='expert')return slot.third||slot.primary||slot.alternative; if(tier==='beginner')return slot.primary||slot.alternative; return slot.primary||slot.alternative; }
function routinePlan(dayIndex, source=routine, label='routine') { const day=source[dayIndex]; if (!day) return null; const slots=day.tierPlans?.[state.preferences.tier]?.slots||day.slots||[]; return {id:`${label}-plan-${dayIndex}`,day_index:dayIndex,focus:day.focus,warmup:v53Content.warmup[dayIndex]?.length ? [...(day.warmup?.steps||[]),...v53Content.warmup[dayIndex]] : day.warmup?.steps||[],tendon:v53Content.tendon[dayIndex]||[],recovery:day.finish?.steps||[],member_plan_slots:slots.map((slot,position)=>({id:`${label}-slot-${dayIndex}-${position}`,position,exercise:routineExercise(tierSlotOption(slot,state.preferences.tier)),alternative:routineExercise(slot.alternative),third:routineExercise(slot.third)}))}; }
function displayPlan(dayIndex) { const key=effectiveTemplateKey(); let plan; if (key==='periodized-abc') plan=periodizedPlan(dayIndex); else if (key==='threeweek-ppl') plan=threeWeekPlan(dayIndex); else if (key==='biweekly') plan=biweeklyPlan(dayIndex); else if (key==='fitness7') plan=routinePlan(dayIndex, routine, 'fitness7'); else if (key==='v5ppl') plan=routinePlan(dayIndex, v5Routine, 'v5'); else plan=state.plans.find(item=>item.day_index===dayIndex) || routinePlan(dayIndex, v5Routine, 'v5'); return prescribePlan(plan); }
function detailItem(key) { const plan=displayPlan(state.dayIndex), slots=planSlots(plan); const all=[...slots.flatMap(slot=>[slot.exercise,slot.alternative,slot.third].filter(Boolean)),...plan?.warmup||[],...plan?.tendon||[],...plan?.recovery||[],...state.extras.filter(item=>item.day_index===state.dayIndex).map(item=>item.exercise).filter(Boolean)], registry=(biweeklyArtwork.movements||[]).find(item=>item.stableMovementId===key||slugify(item.name)===key||(item.aliases||[]).some(alias=>slugify(alias)===key)); return all.find(item=>slugify(item.slug||item.name||item.title)===key) || (registry?biweeklyItem({id:`biweekly-review-${registry.stableMovementId}`,name:registry.name,imageSet:registry.imageSet,targetGroups:registry.targetGroups,equipment:registry.equipment,equipmentStatus:registry.equipmentStatus,detailContent:registry.detailContent,phaseBriefs:registry.phaseBriefs,role:(registry.roles||[])[0],image:registry.imageSet?.move}):null) || libraryBySlug(key) || {name:key,image_path:`assets/exercises/${key}.png`,alt_text:`Fitness 7 illustration: ${key}`}; }
function phaseAsset(baseImage, phase) { return String(baseImage).replace(/\.png$/i, `-phase-${phase}.png`); }
function detailRecord(item) {
  const name=item.name||item.title||'Exercise';
  const baseImage=item.image_path||item.image||`assets/exercises/${slugify(name)}.png`;
  const target=item.target_muscles||item.targets||'Targeted movement';
  const cue=item.cue||'Move slowly and keep the range comfortable.';
  const equipment=item.equipment||item.equipment_required||'the available setup';
  const supplied=Array.isArray(item.detailSteps)?item.detailSteps:[];
  const suppliedSet=item.imageSet||{};
  const phaseBriefs=item.phaseBriefs||{};
  const explicitStart=item.imageSet?.start, explicitMove=item.imageSet?.movement;
  const twoFrame=Boolean(explicitStart||explicitMove);
  const phases=twoFrame ? [
    ['start', 'Start', item.startInstruction||phaseBriefs.start?.instruction||phaseBriefs.setup?.instruction||`Set up ${equipment} with a stable base and your joints stacked.`],
    ['movement', 'Movement', item.movementInstruction||phaseBriefs.movement?.instruction||phaseBriefs.move?.instruction||cue]
  ] : [
    ['setup', 'Set up', item.setupInstruction||phaseBriefs.setup?.instruction||`Set up ${equipment} with a stable base and your joints stacked.`],
    ['move', 'Move', item.executionInstruction||phaseBriefs.move?.instruction||cue],
    ['return', 'Return', item.returnInstruction||phaseBriefs.return?.instruction||'Return slowly to the start and keep tension under control.']
  ];
  const imageSet=twoFrame ? {
    start:suppliedSet.start||explicitStart||suppliedSet.setup||phaseAsset(baseImage,'setup'),
    movement:suppliedSet.movement||explicitMove||suppliedSet.move||phaseAsset(baseImage,'move')
  } : {setup:suppliedSet.setup||phaseAsset(baseImage,'setup'),move:suppliedSet.move||phaseAsset(baseImage,'move'),return:suppliedSet.return||phaseAsset(baseImage,'return')};
  return {...item,name,image_path:baseImage,alt_text:item.alt_text||item.alt||`Fitness 7 illustration: ${name}`,target_muscles:target,scheme:item.scheme||item.duration||'',why:item.why||`Build control and prepare the ${target.toLowerCase()}.`,safetyCue:item.safetyCue||'Stop for sharp pain, dizziness, or unusual breathlessness.',imageSet,detailSteps:phases.map(([phase,label,instruction],index)=>({...supplied[index],phase,label,image:imageSet[phase],alt:supplied[index]?.alt||`Fitness 7 ${name} ${label.toLowerCase()} position`,instruction,directionCue:supplied[index]?.directionCue||phaseBriefs[phase]?.directionCue||'',gripCue:supplied[index]?.gripCue||phaseBriefs[phase]?.gripCue||''}))};
}
function optionalCandidates() {
  if(effectiveTemplateKey()==='periodized-abc') {
    const selected=new Set(state.extras.filter(item=>item.day_index===state.dayIndex).map(item=>item.exercise_id));
    const day=periodizedDay(state.dayIndex,scheduledDate(state.dayIndex));
    const allowed=new Set(targetGroupsForDay(state.dayIndex));
    return (day?.optionalSlots||[]).filter(item=>item.levelEligibility?.[state.preferences.tier]!==false&&!selected.has(item.id)&&!isStretchOrMobility(item)&&inferredGroups(item).length&&inferredGroups(item).every(group=>allowed.has(group))).map(biweeklyItem).filter(Boolean);
  }
  if(effectiveTemplateKey()==='threeweek-ppl') {
    const selected=new Set(state.extras.filter(item=>item.day_index===state.dayIndex).map(item=>item.exercise_id));
    return (threeWeekPlan(state.dayIndex)?.extras||[]).filter(item=>item && !selected.has(item.id) && !isStretchOrMobility(item) && inferredGroups(item).some(group=>targetGroupsForDay(state.dayIndex).includes(group)));
  }
  if(effectiveTemplateKey()==='biweekly') {
    const selected=new Set(state.extras.filter(item=>item.day_index===state.dayIndex).map(item=>item.exercise_id));
    const day=biweeklyDay(state.dayIndex,scheduledDate(state.dayIndex)), tierPlan=day?.tierPlans?.[state.preferences.tier]||{};
    return (tierPlan.optionalSlots?.length?tierPlan.optionalSlots:(day?.optionalSlots||[])).filter(item=>item.levelEligibility?.[state.preferences.tier]!==false&&!selected.has(item.id)).map(biweeklyItem).filter(item=>item?.artworkStatus==='complete');
  }
  const source=currentTemplate()?.days?.[state.dayIndex]||{}, raw=source?.slots?.flatMap(slot=>[slot.primary,slot.alternative,slot.third].filter(Boolean))||source?.candidates||[];
  const base=new Set(raw.map(item=>slugify(item.name))), selected=new Set(state.extras.filter(item=>item.day_index===state.dayIndex).map(item=>item.exercise_id)), allowed=new Set(targetGroupsForDay(state.dayIndex));
  return state.library.map(normalizeExercise).filter(item=>!base.has(item.slug)&&!selected.has(item.id)&&!isStretchOrMobility(item)&&inferredGroups(item).length>0&&inferredGroups(item).every(group=>allowed.has(group)));
}
function guidedCandidates(panel, plan) {
  const allowed=new Set(targetGroupsForDay(state.dayIndex));
  return state.library.map(normalizeExercise).filter(item=>!isStretchOrMobility(item)&&isGuidedMovement(item,panel)&&inferredGroups(item).some(group=>allowed.has(group))).slice(0,8).map(item=>({...item,guidedPanel:panel}));
}
function optionalCards(items, mode='extra') { return items.length ? `<div class="extra-option-grid">${items.map(raw=>{const item=prescribeExercise(raw);const prescription=item.tierPrescription||tierPrescription(item);return `<article class="extra-option"><button type="button" class="visual-button" data-detail-key="${escapeHtml(slugify(item.slug||item.name||''))}" aria-label="View details for ${escapeHtml(item.name)}">${imageMarkup(item,'extra-option-visual visual')}</button><span class="extra-option-copy"><b>${escapeHtml(item.name)}</b><small>${escapeHtml(prescription.displayDose)}</small><small>${escapeHtml(prescription.displayRest)}</small><button type="button" class="link-button detail-button" data-detail-key="${escapeHtml(slugify(item.slug||item.name||''))}">View details →</button><button type="button" class="pill ${mode==='guided'?'guided-add':'extra-add'}" ${mode==='guided'?`data-add-guided-panel="${escapeHtml(item.guidedPanel||'warmup')}" data-add-guided="${escapeHtml(item.id)}"`: `data-add-extra="${escapeHtml(item.id)}"`}>＋ Add</button></span></article>`;}).join('')}</div>` : '<p class="muted">No more approved options are available for this day.</p>'; }
async function addExtra(exerciseId) {
  const dayExtras=state.extras.filter(item=>item.day_index===state.dayIndex);
  if(dayExtras.length>=2) throw new Error('Keep optional extras to two for recovery.');
  const exercise=resolveExerciseById(exerciseId);
  if(!exercise) throw new Error('Choose an approved exercise.');
  if(isStretchOrMobility(exercise) || !inferredGroups(exercise).length || !inferredGroups(exercise).every(group=>targetGroupsForDay(state.dayIndex).includes(group))) throw new Error('That exercise is not compatible with this day.');
  if(state.demo){ const data=demoData(); data.personal.extras.push({day_index:state.dayIndex,position:dayExtras.length,exercise_id:exercise.id,exercise}); writeDemoMember(data); loadDemoMember(); return; }
  const {error}=await supabase.from('member_extra_templates').upsert({member_id:state.user.id,day_index:state.dayIndex,position:dayExtras.length,exercise_id:exercise.id},{onConflict:'member_id,day_index,position'}); if(error) throw error; await loadMember();
}
function sessionForDate(date) { const source=activeSourceVersion(); return state.sessions.find(item=>item.session_date===date && item.source_version===source) || null; }
function calendarSessionForDate(date) { const current=sessionForDate(date); if(hasWorkoutActivity(current))return current; return state.sessions.find(item=>item.session_date===date&&hasWorkoutActivity(item)) || null; }
function zoneComplete(progress, key, expected) { return expected>0 && Object.values(progress?.[key]||{}).filter(Boolean).length>=expected; }
function ringStatus(session) { const snap=session?.plan_snapshot||{}, progress=session?.progress||emptyProgress(); return {main:zoneComplete(progress,'slots',snap.slots?.length||0),warmup:zoneComplete(progress,'warmup',snap.warmup?.length||0),recovery:zoneComplete(progress,'recovery',snap.recovery?.length||0)}; }
function zoneCounts(session) { const snap=session?.plan_snapshot||{},progress=session?.progress||emptyProgress(); return {main:[Object.values(progress.slots||{}).filter(Boolean).length,snap.slots?.length||0],warmup:[Object.values(progress.warmup||{}).filter(Boolean).length,snap.warmup?.length||0],recovery:[Object.values(progress.recovery||{}).filter(Boolean).length,snap.recovery?.length||0]}; }
const sourceLabel = 'FITNESS 7 WORKOUT';
function weeklyProgress() {
  const today=new Date(), monday=new Date(today); monday.setHours(0,0,0,0); monday.setDate(today.getDate()-((today.getDay()+6)%7));
  const sunday=new Date(monday); sunday.setDate(monday.getDate()+6);
  const sessions=visibleSessions().filter(item=>{const date=new Date(`${item.session_date}T00:00:00`);return date>=monday&&date<=sunday;});
  const sum=key=>{let done=0,total=0;sessions.forEach(session=>{const [value,expected]=zoneCounts(session)[key];done+=value;total+=expected;});return total?Math.round(done/total*100):0;};
  return {main:sum('main'),warmup:sum('warmup'),recovery:sum('recovery')};
}
function progressRingsMarkup(stats) { return `<div class="hero-rings" role="img" aria-label="This week: main workout ${stats.main} percent, warm-up ${stats.warmup} percent, recovery ${stats.recovery} percent"><svg viewBox="0 0 128 128" aria-hidden="true"><circle class="ring-track" cx="64" cy="64" r="52"></circle><circle class="hero-ring hero-ring-main" style="--progress:${stats.main}" pathLength="100" cx="64" cy="64" r="52"></circle><circle class="ring-track" cx="64" cy="64" r="40"></circle><circle class="hero-ring hero-ring-warmup" style="--progress:${stats.warmup}" pathLength="100" cx="64" cy="64" r="40"></circle><circle class="ring-track" cx="64" cy="64" r="28"></circle><circle class="hero-ring hero-ring-recovery" style="--progress:${stats.recovery}" pathLength="100" cx="64" cy="64" r="28"></circle></svg><span><b>${stats.main}%</b><small>main</small></span></div>`; }
function monthLabel() { return state.calendarMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'}); }
function calendarMarkup(compact=false) {
  const cursor=state.calendarMonth, year=cursor.getFullYear(), month=cursor.getMonth(), first=new Date(year,month,1), start=(first.getDay()+6)%7, days=new Date(year,month+1,0).getDate();
  const cells=[]; for(let index=0;index<start;index++) cells.push('<span class="calendar-cell empty"></span>');
  for(let day=1;day<=days;day++){ const date=iso(new Date(year,month,day)), session=calendarSessionForDate(date), rings=ringStatus(session), classes=`calendar-cell ${session?'has-session':''}`; cells.push(`<button class="${classes}" data-history-date="${session?date:''}" ${session?'':'disabled'} aria-label="${date}${session?` ${rings.main?'main complete, ':''}${rings.warmup?'warm-up complete, ':''}${rings.recovery?'recovery complete':''}`:' no saved workout'}"><time>${day}</time><span class="rings"><i class="ring ring-main ${rings.main?'complete':''}"></i><i class="ring ring-warmup ${rings.warmup?'complete':''}"></i><i class="ring ring-recovery ${rings.recovery?'complete':''}"></i></span></button>`); }
  return `<section class="calendar-panel ${compact?'calendar-compact':''}"><div class="calendar-head"><div><p class="eyebrow">WORKOUT HISTORY</p><h2>${monthLabel()}</h2></div><div class="calendar-controls"><button class="icon-btn" data-calendar-shift="-1" aria-label="Previous month">−</button><button class="icon-btn" data-calendar-shift="1" aria-label="Next month">＋</button>${compact?'<button class="link-button" data-screen="profile">Full view →</button>':''}</div></div><div class="calendar-weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="calendar-grid">${cells.join('')}</div><div class="calendar-legend"><span><i class="ring ring-main complete"></i>Main</span><span><i class="ring ring-warmup complete"></i>Warm-up</span><span><i class="ring ring-recovery complete"></i>Recovery</span></div></section>`;
}

function renderSignIn() {
  app.innerHTML = `<main class="shell auth">${logo}<section class="auth-panel"><p class="eyebrow">FITNESS 7 MEMBER</p><h1>Your workout is ready.</h1><p>Sign in to follow your personal training plan.</p>${config.demoMode ? '<p class="demo-hint">Demo: <b>sagar.paperwala003.member</b> · password <b>1234</b></p>' : ''}${notice()}<form id="sign-in" class="stack"><label class="field">Username or email<input name="username" required autocomplete="username"></label><label class="field">Password<input name="password" type="password" required autocomplete="current-password"></label><label class="remember-row"><input name="remember" type="checkbox"> Remember me</label><button class="button">Sign in</button></form><button class="link-button" data-show-reset>Forgot password?</button><form id="request-reset" class="stack hidden"><label class="field">Email<input name="email" type="email" required></label><button class="button secondary">Send reset link</button></form></section></main>`;
}
function renderHome() {
  const dayName = new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
  const selectedTemplate=currentTemplate().name||'My training';
  const tier=tierDefaults[state.preferences.tier]?.label||'Intermediate';
  const weekday=new Date().getDay(), todayIndex=weekday>=1&&weekday<=6?weekday-1:-1;
  app.innerHTML = `<main class="shell">${header()}${banner()}${notice()}<section class="home-hero home-hero-clean"><p class="eyebrow">${dayName}</p><h1>Your weekly training</h1><p>${escapeHtml(selectedTemplate)} · ${escapeHtml(tier)}</p></section><button class="plan-compact-card" data-screen="plan"><span><b>My Training Plan</b><small>${escapeHtml(selectedTemplate)} · ${escapeHtml(tier)}</small></span><span aria-hidden="true">Change ›</span></button><section class="section-title"><div><p class="eyebrow">THIS WEEK</p><h2>Choose a day</h2></div></section><section class="day-grid">${routine.map((fallback,index) => { const plan=displayPlan(index), ready=Boolean(plan); const date=scheduledDate(index), isToday=index===todayIndex; return `<button class="day-card ${isToday?'is-today':''}" data-day="${index}" data-screen="workout" ${isToday?'aria-current="date"':''}><b>${escapeHtml(fallback.day)}${isToday?'<span class="today-badge">Today</span>':''}</b><span>${escapeHtml(plan?.focus || 'Plan not assigned')}</span><small>${date.toLocaleDateString(undefined,{day:'numeric',month:'short'})}</small><em class="status">${ready?'Ready':'Apply plan'}</em></button>`; }).join('')}</section>${calendarMarkup(true)}</main>`;
}
function renderArtworkReview() {
  const movements=(biweeklyArtwork.movements||[]).filter(item=>item.artworkStatus==='complete').sort((a,b)=>a.name.localeCompare(b.name));
  app.innerHTML=`<main class="shell">${header()}${banner()}<button class="link-button" data-screen="home">‹ Home</button><section class="section-title artwork-heading"><div><p class="eyebrow">BI-WEEKLY · ARTWORK REVIEW</p><h1>Artwork gallery</h1><p>Every completed movement is shown with its actual Setup, Move, and Return files. Select Bi-Weekly Activity in My Training Plan to see these same visuals in the Week A/B exercise cards.</p></div><span class="artwork-count">${movements.length} / ${(biweeklyArtwork.movements||[]).length} sets</span></section><section class="artwork-gallery">${movements.map(item=>`<article class="card artwork-card"><button class="artwork-card-title" data-detail-key="${escapeHtml(item.stableMovementId)}"><span>${imageMarkup({name:item.name,imageSet:item.imageSet,alt:item.alt},'artwork-cover')}</span><span><b>${escapeHtml(item.name)}</b><small>${escapeHtml((item.targetGroups||[]).join(' + '))}</small></span></button><div class="artwork-phase-strip">${['setup','move','return'].map(phase=>`<button class="artwork-phase" data-detail-key="${escapeHtml(item.stableMovementId)}" aria-label="View ${escapeHtml(item.name)} ${phase} details"><img src="${escapeHtml(item.imageSet?.[phase]||'')}" alt="${escapeHtml(item.alt||item.name)} — ${phase}" loading="lazy"><small>${phase}</small></button>`).join('')}</div><button class="link-button detail-button" data-detail-key="${escapeHtml(item.stableMovementId)}">View three-phase details →</button></article>`).join('')}</section></main>`;
}
function guided(title, items, checks, key, options=[]) { if (!items?.length) return ''; return `<details class="guided-panel" open><summary><span><p class="eyebrow">RECOMMENDED · OPTIONAL</p><h2>${title}</h2><p class="muted">Start with Priority 1; add more if time allows.</p></span><span class="guided-toggle">View</span></summary><section class="card workout-list">${items.map((raw,index)=>{const item=prescribeExercise({...raw,name:raw.title||raw.name,scheme:raw.scheme||raw.duration,prescriptions:raw.prescriptions});const prescription=item.tierPrescription||tierPrescription(item);return `<article class="exercise guided-exercise"><button type="button" class="visual-button" data-detail-key="${escapeHtml(slugify(item.name||''))}" aria-label="View details for ${escapeHtml(item.name||'exercise')}">${imageMarkup(item,'visual')}</button><div class="exercise-copy"><span class="priority-badge">${index===0?'Priority 1 — Do this first':index===1?'Priority 2 — Recommended':'Optional — If time allows'}</span><h3>${escapeHtml(item.name)}</h3><p class="exercise-dose">${escapeHtml(prescription.displayDose)}</p><p class="exercise-rest">${escapeHtml(prescription.displayRest)}</p><button class="link-button detail-button" data-detail-key="${escapeHtml(slugify(item.name||''))}">View exercise details →</button></div><label class="check"><input type="checkbox" data-check="${key}" data-index="${index}" ${checks?.[index]?'checked':''}><span>Done</span></label></article>`;}).join('')}</section>${options.length?`<section class="guided-options"><div class="section-title compact"><div><p class="eyebrow">OPTIONAL ADD-ONS</p><h3>Need a different option?</h3><p class="muted">Choose a relevant movement if you have extra time.</p></div></div>${optionalCards(options, 'guided')}</section>`:''}</details>`; }
function snapshot(plan, extras, guidedExtras={}) { return {source_version:activeSourceVersion(),rotation_week:plan.rotationWeek||null,week_key:plan.weekKey||null,focus:plan.focus,slots:planSlots(plan).map(slot=>({id:slot.id,exercise:slot.exercise,alternative:slot.alternative,third:slot.third})),warmup:plan.warmup||[],tendon:plan.tendon||[],recovery:plan.recovery||[],warmupExtras:guidedExtras.warmup||[],recoveryExtras:guidedExtras.recovery||[],extras:extras.map(item=>({id:item.exercise_id,exercise:item.exercise}))}; }
async function addGuidedExtra(panel, exerciseId) {
  const date=iso(scheduledDate(state.dayIndex)), plan=displayPlan(state.dayIndex), existing=sessionForDate(date), dayExtras=state.extras.filter(item=>item.day_index===state.dayIndex);
  const exercise=state.library.map(normalizeExercise).find(item=>item.id===exerciseId)||training.catalog.find(item=>item.id===exerciseId);
  if(!exercise || !isGuidedMovement(exercise,panel)) throw new Error('Choose a relevant guided movement.');
  const current=existing?.plan_snapshot?.[panel==='warmup'?'warmupExtras':'recoveryExtras']||[];
  if(current.some(item=>item.id===exercise.id)) return;
  const guidedExtras={warmup:existing?.plan_snapshot?.warmupExtras||[],recovery:existing?.plan_snapshot?.recoveryExtras||[]};
  guidedExtras[panel].push(exercise);
  const session=existing||{member_id:state.user.id,session_date:date,day_index:state.dayIndex,source_version:activeSourceVersion(),plan_snapshot:snapshot(plan,dayExtras,guidedExtras),progress:emptyProgress()};
  session.plan_snapshot={...session.plan_snapshot,[panel==='warmup'?'warmupExtras':'recoveryExtras']:guidedExtras[panel]};
  if(state.demo){state.sessions=[session,...state.sessions.filter(item=>!(item.session_date===date&&item.source_version===activeSourceVersion()))];const data=demoData();data.sessions=state.sessions;writeDemoMember(data);render();return;}
  const {data,error}=await supabase.from('workout_sessions').upsert(session,{onConflict:'member_id,session_date,source_version'}).select().single(); if(error) throw error; state.sessions=[data,...state.sessions.filter(item=>!(item.session_date===date&&item.source_version===activeSourceVersion()))]; render();
}
function renderWorkout() {
  const plan=displayPlan(state.dayIndex); if(!plan){ app.innerHTML=`<main class="shell">${header()}${banner()}<button class="link-button" data-screen="plan">Set up my plan</button><section class="card empty-state"><h1>No plan assigned</h1><p>Choose your split and level to create your future workouts.</p></section></main>`; return; }
  const date=iso(scheduledDate(state.dayIndex)), saved=sessionForDate(date), dayExtras=state.extras.filter(item=>item.day_index===state.dayIndex), savedSnapshot=saved?.plan_snapshot, savedUsable=Boolean(savedSnapshot?.slots?.length>=planSlots(plan).length), snapBase=savedUsable?{...savedSnapshot,warmup:savedSnapshot.warmup?.length?savedSnapshot.warmup:plan.warmup,tendon:savedSnapshot.tendon?.length?savedSnapshot.tendon:plan.tendon,recovery:savedSnapshot.recovery?.length?savedSnapshot.recovery:plan.recovery}:snapshot(plan,dayExtras), snap={...snapBase,warmup:[...(snapBase.warmup||[]),...(snapBase.warmupExtras||[])],tendon:[...(snapBase.tendon||[])],recovery:[...(snapBase.recovery||[]),...(snapBase.recoveryExtras||[])],extras:dayExtras.map(item=>({id:item.exercise_id,exercise:item.exercise}))}, progress=saved?.progress||emptyProgress(), done=Object.values(progress.slots||{}).filter(Boolean).length;
  const renderExercise=(slot,index,extra=false)=>{ const hasChoice=Object.prototype.hasOwnProperty.call(progress.choices||{},index); const choice=extra?0:(hasChoice?Number(progress.choices[index]):(plan.defaultChoice||0)), raw=choice===2&&slot.third?slot.third:choice===1&&slot.alternative?slot.alternative:slot.exercise, exercise=prescribeExercise(raw), prescription=exercise?.tierPrescription||tierPrescription(exercise), rotationLabel=effectiveTemplateKey()==='periodized-abc'?`Source ${plan.weekKey}`:(v53Plan.rotation?.[choice]||'Primary'); return `<article class="card exercise"><button type="button" class="visual-button" data-detail-key="${escapeHtml(slugify(exercise?.slug||exercise?.name||''))}" aria-label="View details for ${escapeHtml(exercise?.name||'exercise')}">${imageMarkup(exercise,'visual')}</button><div class="exercise-copy"><h3>${escapeHtml(exercise?.name||'Exercise')}</h3><span class="level-badge">${escapeHtml(tierDefaults[state.preferences.tier]?.label||'Intermediate')}</span>${plan.rotationWeek?`<span class="rotation-badge">Week ${plan.rotationWeek} · ${escapeHtml(rotationLabel)}</span>`:''}<p class="exercise-dose">${escapeHtml(prescription.displayDose)}</p><p class="exercise-rest">${escapeHtml(prescription.displayRest)}</p>${prescription.trainingMethod?`<span class="technique-badge">${escapeHtml(prescription.trainingMethod)}</span>`:''}<button class="link-button detail-button" data-detail-key="${escapeHtml(slugify(exercise?.slug||exercise?.name||''))}">View exercise details →</button>${!extra&&(slot.alternative||slot.third)?`<div class="choices"><button class="pill choice ${choice===0?'selected':''}" data-choice="${index}" data-choice-index="0" aria-pressed="${choice===0}">Main</button>${slot.alternative?`<button class="pill choice ${choice===1?'selected':''}" data-choice="${index}" data-choice-index="1" aria-pressed="${choice===1}">Alternative</button>`:''}${slot.third?`<button class="pill choice ${choice===2?'selected':''}" data-choice="${index}" data-choice-index="2" aria-pressed="${choice===2}">Option 2</button>`:''}</div>`:''}</div><label class="check"><input type="checkbox" data-check="${extra?'extras':'slots'}" data-index="${index}" ${extra?progress.extras?.[index]?'checked':'':progress.slots?.[index]?'checked':''}><span>Done</span></label></article>`; };
  const activeDay=effectiveTemplateKey()==='periodized-abc' ? periodizedDay(state.dayIndex, scheduledDate(state.dayIndex)) : effectiveTemplateKey()==='biweekly' ? biweeklyDay(state.dayIndex, scheduledDate(state.dayIndex)) : (currentTemplate().days?.[state.dayIndex]||v5Routine[state.dayIndex]);
  const outcome=dayOutcomes[state.dayIndex]||dayOutcomes[0];
  const outcomeMarkup=`<details class="outlook-card"><summary><span><p class="eyebrow">CONSISTENCY OUTLOOK</p><h2>What ${escapeHtml(outcome.name)} can build</h2></span><span class="guided-toggle">View</span></summary><div class="outlook-timeline"><div><b>1 week</b><p>${escapeHtml(outcome.week)}</p></div><div><b>1 month</b><p>${escapeHtml(outcome.month)}</p></div><div><b>3 months</b><p>${escapeHtml(outcome.quarter)}</p></div><div><b>6 months</b><p>${escapeHtml(outcome.half)}</p></div></div><p class="outlook-note">These are possible training milestones, not guaranteed body or weight outcomes. Nutrition, sleep, recovery, and adherence determine results.</p></details>`;
  const optional=state.showExtras?`<section class="card optional-picker"><div class="section-title compact"><div><p class="eyebrow">${activeDay?.day||routine[state.dayIndex].day} ONLY</p><h2>Add optional exercise</h2><p>Only ${activeDay?.focus?.toLowerCase()||''} options are shown. Tap ＋ Add to save a recurring extra.</p></div></div>${optionalCards(optionalCandidates())}<button type="button" class="pill" data-close-extras>Close</button></section>`:'';
  const reviewPreview=biweeklyPreviewMode()?`<aside class="preview-banner artwork-preview-notice"><b>Bi-Weekly review preview</b><span>Week ${escapeHtml(plan.weekKey)} · cards use only exact approved artwork. “Artwork in production” means that movement’s sequence is still being created; no unrelated image is used.</span></aside>`:'';
  app.innerHTML=`<main class="shell">${header()}${banner()}${notice()}${reviewPreview}<button class="link-button" data-screen="home">‹ All days</button><section class="detail-head"><div><p class="eyebrow">${scheduledDate(state.dayIndex).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</p><h1>${escapeHtml(snap.focus)}</h1><p>${escapeHtml(tierDefaults[state.preferences.tier]?.label||'Intermediate')} · ${done}/${snap.slots.length} main exercises completed</p></div></section>${outcomeMarkup}${guided('Warm-up',snap.warmup,progress.warmup,'warmup',guidedCandidates('warmup',plan))}${snap.tendon?.length?guided('Tendon preparation',snap.tendon,progress.tendon,'tendon'):''}<section class="section-title"><div><p class="eyebrow">MAIN WORKOUT</p><h2>Your exercises</h2></div></section><section class="workout-list">${snap.slots.map((slot,index)=>renderExercise(slot,index)).join('')}</section><section class="post-main-actions"><button class="button" data-open-extras>＋ Add optional exercise</button><small>Up to two recurring extras for this weekday</small></section>${snap.extras?.length?`<section class="section-title"><div><p class="eyebrow">OPTIONAL EXTRAS</p><h2>Extra work</h2><p class="muted">Tap − to remove a recurring extra.</p></div></section><section class="workout-list">${snap.extras.map((slot,index)=>`${renderExercise(slot,index,true)}<button class="pill extra-remove" data-remove-extra="${index}">− Remove extra</button>`).join('')}</section>`:''}${optional}${guided('Post-workout recovery',snap.recovery,progress.recovery,'recovery',guidedCandidates('recovery',plan))}<section class="utility"><button class="button secondary" data-clear-session="${date}">Clear today’s checkmarks</button></section></main>`;
}
function renderDetail() { const item=detailRecord(prescribeExercise(state.detailItem||{})), prescription=item.tierPrescription||tierPrescription(item), review=item.equipmentStatus==='Review before use', steps=(item.detailSteps||[]).slice(0,2), phaseLabels=['Start','Movement']; app.innerHTML=`<main class="shell">${header()}${banner()}<button class="link-button" data-close-detail>‹ Back to workout</button><section class="detail-hero"><p class="eyebrow">EXERCISE GUIDE · ${escapeHtml(tierDefaults[state.preferences.tier]?.label||'Intermediate')}</p><h1>${escapeHtml(item.name)}</h1>${review?'<span class="equipment-review">Review before use</span>':''}</section><section class="dose-card"><span><b>${escapeHtml(prescription.sets||'—')}</b><small>Sets</small></span><span><b>${escapeHtml(prescription.duration||prescription.reps||'—')}</b><small>${prescription.duration?'Hold':'Reps'}</small></span><span><b>${escapeHtml(prescription.rest||'As needed')}</b><small>Rest</small></span></section><section class="detail-steps">${steps.map((step,index)=>`<article class="card detail-step"><div class="detail-phase-image">${imageMarkup({name:item.name,imageSet:{move:step.image},alt:step.alt,artworkStatus:item.artworkStatus},'visual detail-visual')}</div><div><span class="step-label">${index+1}</span><span class="phase-name">${phaseLabels[index]}</span><p>${escapeHtml(step.instruction)}</p></div></article>`).join('')}</section><section class="card detail-copy"><p><b>How to progress</b><br>${escapeHtml(prescription.progression)}</p><p class="safety-line"><b>Safety</b><br>${escapeHtml(item.safetyCue||'Stop for sharp pain, dizziness, or unusual breathlessness.')}</p>${item.videoUrl?`<a class="button secondary video-link" href="${escapeHtml(item.videoUrl)}" target="_blank" rel="noreferrer">Watch demonstration ↗</a>`:''}</section></main>`; }
function tierPreviewMarkup(tier) { const level=tierDefaults[tier]||tierDefaults.intermediate, examples={beginner:['2–3 sets','10–15 reps','3 RIR','60–90 sec rest'],intermediate:['3 sets','6–15 reps','1–2 RIR','60–120 sec rest'],expert:['3–4 sets','5–15 reps','~1 RIR','60–150 sec rest']}[tier]||[]; return `<div class="tier-preview"><p class="eyebrow">${escapeHtml(level.label)} PRESCRIPTION</p><h3>${escapeHtml(level.summary)}</h3><div class="tier-metrics">${examples.map(value=>`<span>${escapeHtml(value)}</span>`).join('')}</div><p><b>Tempo:</b> ${escapeHtml(level.tempo)} · <b>Progression:</b> ${escapeHtml(level.progression)}</p><small>${escapeHtml(level.extras)}</small></div>`; }
function futurePlanPreviewMarkup(templateKey,tier){
  const template=training.templates[templateKey]||training.templates.v5ppl;
  const days=templateKey==='periodized-abc'?(periodized.days||[]).filter(day=>day.weekKey==='A'&&day.dayIndex<6):templateKey==='biweekly'?(biweekly.days||[]).filter(day=>day.weekKey==='A'&&day.dayIndex<6):templateKey==='threeweek-ppl'?(v53Plan.days?.[1]||[]):(template.days||[]);
  return `<div class="future-plan-preview"><p class="eyebrow">FUTURE WORKOUT PREVIEW</p>${days.slice(0,6).map((day,index)=>{
    const slots=templateKey==='periodized-abc'?(day.coreSlots||[]):templateKey==='biweekly'?(day.tierPlans?.[tier]?.coreSlots||day.coreSlots||[]):templateKey==='threeweek-ppl'?(day.coreSlots||[]):(day.tierPlans?.[tier]?.slots||day.slots||[]);
    return `<div><b>${escapeHtml(day.dayName||day.day||['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][index])}</b><small>${escapeHtml(slots.map(slot=>slot.name||slot.primary?.name||tierSlotOption(slot,tier)?.name||'Exercise').join(' · '))}</small></div>`;
  }).join('')}</div>`;
}
function renderPlan() {
  const key=effectiveTemplateKey(), template=currentTemplate(), tier=state.preferences.tier, source=key==='periodized-abc'?periodizedDay(state.dayIndex,scheduledDate(state.dayIndex)):(template.days?.[state.dayIndex]||{}), baseIds=new Set(planSlots(displayPlan(state.dayIndex)).map(slot=>slot.exercise?.id)), rawCandidates=source.candidates||source.slots?.flatMap(slot=>[slot.primary,slot.alternative,slot.third].filter(Boolean))||[], candidates=key==='periodized-abc'?optionalCandidates():rawCandidates.map(item=>libraryBySlug(item.slug||item.name)).filter(item=>item&&(item.levels?.includes(tier) ?? true)&&!baseIds.has(item.id)&&!isStretchOrMobility(item)&&inferredGroups(item).length&&inferredGroups(item).every(group=>targetGroupsForDay(state.dayIndex).includes(group))), extras=state.extras.filter(item=>item.day_index===state.dayIndex), biweeklyStatus=biweeklyReadiness();
  const activeDay=key==='periodized-abc' ? periodizedDay(state.dayIndex,scheduledDate(state.dayIndex)) : key==='biweekly' ? biweeklyDay(state.dayIndex, scheduledDate(state.dayIndex)) : (template.days?.[state.dayIndex]||v5Routine[state.dayIndex]);
  const planCandidates=candidates.filter(item=>!extras.some(extra=>extra.exercise_id===item.id));
  const planDays=key==='periodized-abc' ? (periodized.days||[]).filter(day=>day.weekKey===periodizedWeekKey()&&day.dayIndex<6) : key==='biweekly' ? (biweekly.days||[]).filter(day=>day.weekKey===biweeklyWeekKey()&&day.dayIndex<6) : (template.days||v5Routine);
  app.innerHTML=`<main class="shell">${header()}${banner()}${notice()}<button class="link-button" data-screen="home">‹ Home</button><section class="section-title"><div><p class="eyebrow">MY TRAINING PLAN</p><h1>Build your week</h1><p>Your selected template and level apply to future workouts; saved history never changes.</p></div></section><section class="card"><form id="training-preferences" class="stack"><label class="field">Training template<select name="template_key"><option value="periodized-abc" ${key==='periodized-abc'?'selected':''}>Periodized A-B-A-C (sheet plan)</option><option value="threeweek-ppl" ${key==='threeweek-ppl'?'selected':''}>3-Week PPL Rotation (Primary → Alternative → Option 2)</option><option value="v5ppl" ${key==='v5ppl'?'selected':''}>V5 Optimized PPL</option><option value="fitness7" ${key==='fitness7'?'selected':''}>Fitness 7 split</option></select></label><p class="muted">The periodized plan follows Week A → Week B → Week A → Week C. Week C is the monthly foundation and strength-support week.</p><label class="field">Training level<select name="tier" data-tier-select>${Object.entries(training.levels).map(([itemKey,value])=>`<option value="${itemKey}" ${tier===itemKey?'selected':''}>${value.label} — ${value.subtitle}</option>`).join('')}</select></label><div data-tier-preview>${tierPreviewMarkup(tier)}</div><div data-future-plan-preview>${futurePlanPreviewMarkup(key,tier)}</div><button class="button">Apply my future plan</button></form></section><section class="section-title"><div><p class="eyebrow">${activeDay?.day||'Day'} OPTIONS</p><h2>Optional extras</h2><p>Only related muscle groups are shown. Tap ＋ Add to save up to two.</p></div></section><section class="card stack">${optionalCards(planCandidates)}${extras.map((item,index)=>`<article class="compact-row"><span>${escapeHtml(item.exercise?.name||'Extra exercise')}</span><button type="button" class="pill" data-remove-extra="${index}">− Remove</button></article>`).join('')||'<p class="muted">No extras saved for this day yet.</p>'}</section><div class="day-picker">${planDays.map((day,index)=>`<button class="day-chip ${state.dayIndex===index?'selected':''}" data-plan-day="${index}">${(day.day||day.dayName||['Mon','Tue','Wed','Thu','Fri','Sat'][index]||'Day').slice(0,3)}</button>`).join('')}</div></main>`;
}
function renderHabits() { const weekday=new Date().getDay(); app.innerHTML=`<main class="shell">${header()}${banner()}${notice()}<button class="link-button" data-screen="home">‹ Home</button><section class="section-title"><div><p class="eyebrow">TODAY’S HABITS</p><h1>Keep the simple wins</h1><p>Binary tracking only—no calorie counting.</p></div></section><section class="card workout-list">${state.habitTemplate.map(item=>`<article class="compact-row"><span>${escapeHtml(item.label)}${item.id==='weekend-portions'&&weekday!==0&&weekday!==6?' <small>(weekend only)</small>':''}</span><label class="check"><input type="checkbox" data-habit="${escapeHtml(item.id)}" ${state.habitLog?.[item.id]?'checked':''}><span>Done</span></label></article>`).join('')}</section></main>`; }
function renderHistory(){ const session=calendarSessionForDate(state.historyDate), snap=session?.plan_snapshot||{}, progress=session?.progress||emptyProgress(), rings=ringStatus(session), legacy=session?.source_version!=='v5'; if(!session){state.screen='profile';render();return;} const selected=(slot,index)=>{const choice=progress.choices?.[index]||0;return choice===2&&slot.third?slot.third:choice===1&&slot.alternative?slot.alternative:slot.exercise;}; app.innerHTML=`<main class="shell">${header()}${banner()}${notice()}<button class="link-button" data-screen="profile">‹ Back to calendar</button><section class="detail-hero"><p class="eyebrow">${sourceLabel}</p><h1>${escapeHtml(state.historyDate)}</h1><p>${escapeHtml(snap.focus||'Workout')}</p></section><section class="ring-summary"><span class="ring-label"><i class="ring ring-main ${rings.main?'complete':''}"></i>Main ${rings.main?'complete':'incomplete'}</span><span class="ring-label"><i class="ring ring-warmup ${rings.warmup?'complete':''}"></i>Warm-up ${rings.warmup?'complete':'incomplete'}</span><span class="ring-label"><i class="ring ring-recovery ${rings.recovery?'complete':''}"></i>Recovery ${rings.recovery?'complete':'incomplete'}</span></section><section class="section-title"><div><p class="eyebrow">MAIN WORKOUT</p><h2>Completed exercises</h2></div></section><section class="history-list">${(snap.slots||[]).map((slot,index)=>`<article class="card history-row"><div><b>${escapeHtml(selected(slot,index)?.name||'Exercise')}</b><small>${escapeHtml(slot.exercise?.name||'')}</small></div><span>${progress.slots?.[index]?'✓':'—'}</span></article>`).join('')}</section><section class="section-title"><div><p class="eyebrow">PREPARATION & RECOVERY</p><h2>Optional progress</h2></div></section><section class="history-list">${(snap.warmup||[]).map((item,index)=>`<article class="card history-row"><div><b>${escapeHtml(item.title||item.name)}</b><small>Warm-up</small></div><span>${progress.warmup?.[index]?'✓':'—'}</span></article>`).join('')}${(snap.recovery||[]).map((item,index)=>`<article class="card history-row"><div><b>${escapeHtml(item.title||item.name)}</b><small>Recovery</small></div><span>${progress.recovery?.[index]?'✓':'—'}</span></article>`).join('')}</section></main>`; }
function renderProfile(){ const membership=state.membership||{}, sessions=visibleSessions(); const demoCard=state.demo?`<article class="card demo-profile-card profile-demo-card"><div><p class="eyebrow">SAGAR DEMO PROFILE</p><h2>Lean down while keeping strength</h2><p>${demoProfile.goal} over ${demoProfile.timeline}. Daily scale changes are not the score—creatine, hydration, sodium, and restaurant meals can temporarily move body weight.</p></div><dl><div><dt>Age</dt><dd>${demoProfile.age}</dd></div><div><dt>Height</dt><dd>${demoProfile.height}</dd></div><div><dt>Now</dt><dd>${demoProfile.weight}</dd></div><div><dt>Target</dt><dd>${demoProfile.target}</dd></div><div><dt>Training</dt><dd>${demoProfile.frequency}</dd></div><div><dt>Level</dt><dd>${escapeHtml(tierDefaults[state.preferences.tier]?.label||'Intermediate')}</dd></div></dl></article>`:'<article class="card"><p class="eyebrow">PROGRAM SUMMARY</p><p>Your selected level controls future working sets, rep ranges, rest, tempo, and progression.</p></article>'; app.innerHTML=`<main class="shell">${header()}${banner()}${notice()}<button class="link-button" data-screen="home">‹ Home</button><section class="section-title"><div><p class="eyebrow">MY ACCOUNT</p><h1>${escapeHtml(state.profile?.full_name||'Member')}</h1></div></section>${demoCard}<section class="profile-grid"><article class="card"><h2>Membership</h2><p class="membership-badge ${escapeHtml(membership.status||'')}">${escapeHtml(membership.status||'Not set')}</p><p>${membership.ends_on?`Ends ${escapeHtml(membership.ends_on)}`:'Membership date not set'}</p></article><article class="card"><h2>Training</h2><p>${escapeHtml(currentTemplate().name||'Personal plan')} · ${escapeHtml(training.levels[state.preferences.tier]?.label||'Intermediate')}</p><button class="pill" data-screen="plan">Edit plan</button></article></section>${calendarMarkup(false)}<section class="section-title"><div><p class="eyebrow">SESSION LIST</p><h2>Recent sessions</h2><p class="muted">A session appears after you check at least one workout, warm-up, recovery, or optional exercise.</p></div></section><section class="history-list">${sessions.length?sessions.map(session=>{const counts=zoneCounts(session),rings=ringStatus(session),partial=!rings.main;return `<button class="card history-row history-button" data-history-date="${escapeHtml(session.session_date)}"><div><b>${escapeHtml(session.plan_snapshot?.focus||'Workout')}</b><small>${escapeHtml(session.session_date)} · ${partial?'In progress':'Main complete'}</small><span class="session-zones"><i class="ring ring-main ${rings.main?'complete':''}></i>Main ${counts.main[0]}/${counts.main[1]} <i class="ring ring-warmup ${rings.warmup?'complete':''}></i>Warm-up ${counts.warmup[0]}/${counts.warmup[1]} <i class="ring ring-recovery ${rings.recovery?'complete':''}></i>Recovery ${counts.recovery[0]}/${counts.recovery[1]}</span></div><span aria-hidden="true">›</span></button>`;}).join(''):'<article class="card empty">No active workouts yet. Your selected alternatives remain saved, but choice-only sessions stay hidden.</article>'}</section><section class="utility"><button class="button secondary" data-sign-out>Sign out</button></section></main>`; }
function decoratePlan(){ /* Template labels are rendered with live artwork coverage. */ }
function render(){ try { if(!state.user) return renderSignIn(); if(state.screen==='detail') return renderDetail(); if(state.screen==='history') return renderHistory(); if(state.screen==='workout') return renderWorkout(); if(state.screen==='plan'){renderPlan();decoratePlan();return;} if(state.screen==='artwork') return renderArtworkReview(); if(state.screen==='habits') return renderHabits(); if(state.screen==='profile') return renderProfile(); renderHome(); } catch(error) { console.error('[Fitness 7] Render error', error); app.innerHTML=`<main class="shell"><div class="notice">Unable to render this screen. Return home and try again.</div><button class="button" data-screen="home">Return home</button></main>`; } }

function demoData(){ const data=readDemoMember(v5Routine); data.personal ||= {preferences:{template_key:'periodized-abc',tier:'intermediate'},extras:[],habitTemplate:training.habitDefaults,habitLog:{}}; data.personal.preferences ||= {template_key:'periodized-abc',tier:'intermediate'}; return data; }
function routineDemoPlans(){ return v5Routine.map((day,day_index)=>{const plan=routinePlan(day_index,v5Routine,'v5');return {id:`demo-plan-${state.user.id}-${day_index}`,member_id:state.user.id,day_index,focus:plan.focus,warmup:plan.warmup,recovery:plan.recovery,member_plan_slots:plan.member_plan_slots.map(slot=>({...slot,exercise_id:slot.exercise?.id,alternative_exercise_id:slot.alternative?.id||null,third_exercise_id:slot.third?.id||null}))};}); }
function loadDemoMember(){ const data=demoData(); state.demo=true; state.user={id:data.profile.id,email:MEMBER_USERNAME}; state.profile=data.profile; state.membership=data.membership; state.sessions=(data.sessions||[]).map(session=>({...session,source_version:session.source_version||'v5'})); state.library=training.catalog.map((item,index)=>normalizeExercise({...item,id:`demo-library-${item.slug||index}`})); const storedPreferences=data.personal.preferences||{}; const needsPeriodizedMigration=!storedPreferences.template_key; const resetLegacyExtras=!data.personal.periodizedExtrasReset; state.preferences={...storedPreferences,template_key:needsPeriodizedMigration?'periodized-abc':(storedPreferences.template_key||'periodized-abc')}; state.preferences.rotation_anchor_date ||= periodized.anchorDate||mondayIso(new Date()); if(!data.plans?.length){data.plans=routineDemoPlans();} if(needsPeriodizedMigration || !storedPreferences.rotation_anchor_date || resetLegacyExtras){data.personal.preferences={...state.preferences};data.personal.planVersion=54;data.personal.extras=resetLegacyExtras?[]:(data.personal.extras||[]);data.personal.periodizedExtrasReset=true;writeDemoMember(data);} state.plans=data.plans; state.extras=(data.personal.extras||[]).map(item=>({...item,exercise:item.exercise||resolveExerciseById(item.exercise_id)})); state.habitTemplate=data.personal.habitTemplate||training.habitDefaults; state.habitLog=data.personal.habitLog||{}; render(); }
async function loadMember(){ const core=await Promise.all([supabase.from('profiles').select('*').eq('id',state.user.id).single(),supabase.from('memberships').select('*').eq('member_id',state.user.id).maybeSingle(),supabase.from('member_weekly_plans').select('*,member_plan_slots(*,exercise:exercise_library!member_plan_slots_exercise_id_fkey(*),alternative:exercise_library!member_plan_slots_alternative_exercise_id_fkey(*))').eq('member_id',state.user.id).order('day_index'),supabase.from('workout_sessions').select('*').eq('member_id',state.user.id).order('session_date',{ascending:false}).limit(90),supabase.from('exercise_library').select('*').eq('active',true).order('name')]); if(core[0].error) throw core[0].error; [state.profile,state.membership,state.plans,state.sessions]=[core[0].data,core[1].data,core[2].data||[],core[3].data||[]]; state.library=(core[4].data||[]).map(item=>normalizeExercise({...item,levels:item.metadata?.levels||['beginner','intermediate','expert']})); const today=iso(new Date()); const feature=await Promise.all([supabase.from('member_training_preferences').select('*').eq('member_id',state.user.id).maybeSingle(),supabase.from('member_extra_templates').select('*,exercise:exercise_library(*)').eq('member_id',state.user.id),supabase.from('member_habit_templates').select('*').eq('member_id',state.user.id).maybeSingle(),supabase.from('daily_habit_logs').select('*').eq('member_id',state.user.id).eq('log_date',today).maybeSingle()]); state.preferences=feature[0].data||state.preferences; if(state.preferences.template_key==='ppl') state.preferences={...state.preferences,template_key:'v5ppl'}; if(state.preferences.template_key==='biweekly') state.preferences={...state.preferences,template_key:'threeweek-ppl'}; state.extras=(feature[1].data||[]).map(item=>({...item,exercise:normalizeExercise(item.exercise)})); state.habitTemplate=feature[2].data?.habits||training.habitDefaults; state.habitLog=feature[3].data?.checks||{}; render(); }
async function saveProgress(group,index,value){ const date=iso(scheduledDate(state.dayIndex)),plan=displayPlan(state.dayIndex),existing=sessionForDate(date),dayExtras=state.extras.filter(item=>item.day_index===state.dayIndex),sourceVersion=activeSourceVersion(),session=existing||{member_id:state.user.id,session_date:date,day_index:state.dayIndex,source_version:sourceVersion,plan_snapshot:snapshot(plan,dayExtras),progress:emptyProgress()}; session.progress={...emptyProgress(),...(session.progress||{})}; session.progress[group]={...(session.progress[group]||{}),[index]:value}; if(state.demo){state.sessions=[session,...state.sessions.filter(item=>!(item.session_date===date&&item.source_version===sourceVersion))]; const data=demoData(); data.sessions=state.sessions; writeDemoMember(data);return;} const {data,error}=await supabase.from('workout_sessions').upsert(session,{onConflict:'member_id,session_date,source_version'}).select().single();if(error)throw error;state.sessions=[data,...state.sessions.filter(item=>!(item.session_date===date&&item.source_version===sourceVersion))]; }
async function saveHabit(id,value){ state.habitLog[id]=value; if(state.demo){const data=demoData();data.personal.habitLog=state.habitLog;writeDemoMember(data);return;} const {error}=await supabase.from('daily_habit_logs').upsert({member_id:state.user.id,log_date:iso(new Date()),checks:state.habitLog},{onConflict:'member_id,log_date'});if(error)throw error; }
async function applyPlan(values){
  if(values.template_key==='periodized-abc'){
    const anchor=state.preferences.rotation_anchor_date||periodized.anchorDate||mondayIso(new Date());
    if(state.demo){const data=demoData();data.personal.preferences={template_key:'periodized-abc',tier:values.tier,rotation_anchor_date:anchor};data.personal.planVersion=54;writeDemoMember(data);loadDemoMember();return;}
    const pref=await supabase.from('member_training_preferences').upsert({member_id:state.user.id,template_key:'periodized-abc',tier:values.tier,rotation_anchor_date:anchor},{onConflict:'member_id'});if(pref.error)throw pref.error;await loadMember();return;
  }
  if(values.template_key==='threeweek-ppl'){
    const anchor=state.preferences.rotation_anchor_date||mondayIso(new Date());
    if(state.demo){const data=demoData();data.personal.preferences={template_key:'threeweek-ppl',tier:values.tier,rotation_anchor_date:anchor};data.personal.planVersion=54;writeDemoMember(data);loadDemoMember();return;}
    const pref=await supabase.from('member_training_preferences').upsert({member_id:state.user.id,template_key:'threeweek-ppl',tier:values.tier,rotation_anchor_date:anchor},{onConflict:'member_id'});if(pref.error)throw pref.error;await loadMember();return;
  }
  if(values.template_key==='biweekly'){
    if(state.demo){const data=demoData();data.personal.preferences={template_key:'biweekly',tier:values.tier};data.personal.planVersion=54;writeDemoMember(data);loadDemoMember();return;}
    const pref=await supabase.from('member_training_preferences').upsert({member_id:state.user.id,template_key:'biweekly',tier:values.tier},{onConflict:'member_id'});if(pref.error)throw pref.error;await loadMember();return;
  }
  const template=training.templates[values.template_key], tier=values.tier, limit=template.fixedSlots||training.levels[tier].slots, plans=[]; for(let index=0;index<6;index++){const source=template.days[index], candidates=(source.candidates||[]).map(item=>libraryBySlug(item.slug||item.name)).filter(Boolean).filter(item=>!item.levels||item.levels.includes(tier)); const sourceSlots=source.tierPlans?.[tier]?.slots||source.slots||[]; const selected=(values.template_key==='fitness7'||values.template_key==='v5ppl') ? sourceSlots.map(slot=>libraryBySlug(tierSlotOption(slot,tier)?.slug||tierSlotOption(slot,tier)?.name)).filter(Boolean) : candidates.slice(0,limit); if(selected.length<(values.template_key==='fitness7'?sourceSlots.length:limit)||selected.some(item=>!item?.id)) throw new Error(`Not enough approved ${training.levels[tier].label} exercises for ${source.day||routine[index].day}.`); plans.push({day_index:index,focus:source.focus,warmup:source.warmup?.steps||source.warmup||[],recovery:source.finish?.steps||source.recovery||[],slots:selected.map((exercise,position)=>({position,exercise_id:exercise.id,alternative_exercise_id:libraryBySlug(sourceSlots?.[position]?.alternative?.slug||sourceSlots?.[position]?.alternative?.name)?.id||null}))}); } if(state.demo){const data=demoData();data.personal.preferences={template_key:values.template_key,tier};data.plans=plans.map(plan=>({id:`demo-plan-${state.user.id}-${plan.day_index}`,member_id:state.user.id,...plan,member_plan_slots:plan.slots.map(slot=>({...slot,id:`demo-slot-${plan.day_index}-${slot.position}`,exercise:state.library.find(item=>item.id===slot.exercise_id),alternative:state.library.find(item=>item.id===slot.alternative_exercise_id)}))}));data.personal.planVersion=54;writeDemoMember(data);loadDemoMember();return;} for(const planData of plans){const {data:plan,error}=await supabase.from('member_weekly_plans').upsert({member_id:state.user.id,day_index:planData.day_index,focus:planData.focus,warmup:planData.warmup,recovery:planData.recovery},{onConflict:'member_id,day_index'}).select().single();if(error)throw error;const remove=await supabase.from('member_plan_slots').delete().eq('plan_id',plan.id);if(remove.error)throw remove.error;const insert=await supabase.from('member_plan_slots').insert(planData.slots.map(slot=>({...slot,plan_id:plan.id})));if(insert.error)throw insert.error;} const pref=await supabase.from('member_training_preferences').upsert({member_id:state.user.id,template_key:values.template_key,tier},{onConflict:'member_id'});if(pref.error)throw pref.error; await loadMember(); }

document.addEventListener('click',async event=>{const button=event.target.closest('button');if(!button)return;try{state.message='';if(button.dataset.detailKey){state.detailItem=detailItem(button.dataset.detailKey);state.screen='detail';render();return;}if(button.dataset.closeDetail!==undefined){state.detailItem=null;state.screen='workout';render();return;}if(button.dataset.openExtras!==undefined){state.showExtras=true;render();return;}if(button.dataset.closeExtras!==undefined){state.showExtras=false;render();return;}if(button.dataset.calendarShift){const shift=Number(button.dataset.calendarShift);state.calendarMonth=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()+shift,1);render();return;}if(button.dataset.historyDate){state.historyDate=button.dataset.historyDate;state.screen='history';render();return;}if(button.dataset.addExtra){await addExtra(button.dataset.addExtra);return;}if(button.dataset.day!==undefined){state.dayIndex=Number(button.dataset.day);state.screen='workout';state.showExtras=false;render();return;}if(button.dataset.planDay!==undefined){state.dayIndex=Number(button.dataset.planDay);render();return;}if(button.dataset.screen){state.screen=button.dataset.screen;state.showExtras=false;render();return;}if(button.dataset.showReset!==undefined){document.querySelector('#request-reset').classList.toggle('hidden');return;}if(button.dataset.choice!==undefined){await saveProgress('choices',button.dataset.choice,Number(button.dataset.choiceIndex));render();return;}if(button.dataset.removeExtra!==undefined){const extras=state.extras.filter(item=>item.day_index===state.dayIndex);const target=extras[Number(button.dataset.removeExtra)];if(!target)return;if(state.demo){const data=demoData();data.personal.extras=data.personal.extras.filter(item=>!(item.day_index===state.dayIndex&&item.exercise_id===target.exercise_id));writeDemoMember(data);loadDemoMember();}else{const {error}=await supabase.from('member_extra_templates').delete().eq('member_id',state.user.id).eq('day_index',state.dayIndex).eq('exercise_id',target.exercise_id);if(error)throw error;await loadMember();}return;}if(button.dataset.clearSession){if(state.demo){state.sessions=state.sessions.filter(item=>!(item.session_date===button.dataset.clearSession&&item.source_version===activeSourceVersion()));const data=demoData();data.sessions=state.sessions;writeDemoMember(data);}else{const {error}=await supabase.from('workout_sessions').delete().eq('member_id',state.user.id).eq('session_date',button.dataset.clearSession).eq('source_version',activeSourceVersion());if(error)throw error;state.sessions=state.sessions.filter(item=>!(item.session_date===button.dataset.clearSession&&item.source_version===activeSourceVersion()));}render();return;}if(button.dataset.signOut!==undefined){if(state.demo){clearDemoSession('member');state.demo=false;state.user=null;state.profile=null;render();}else{await supabase.auth.signOut();localStorage.removeItem(preferenceKey);sessionStorage.removeItem(preferenceKey);state.user=null;render();}}}catch(error){state.message=error.message;render();}});
document.addEventListener('click',async event=>{const button=event.target.closest('button[data-add-guided]');if(!button)return;try{await addGuidedExtra(button.dataset.addGuidedPanel||'warmup',button.dataset.addGuided);}catch(error){state.message=error.message;render();}});
document.addEventListener('change',async event=>{try{if(event.target.dataset.tierSelect!==undefined){const preview=document.querySelector('[data-tier-preview]');if(preview)preview.innerHTML=tierPreviewMarkup(event.target.value);const future=document.querySelector('[data-future-plan-preview]');if(future)future.innerHTML=futurePlanPreviewMarkup(document.querySelector('#training-preferences select[name="template_key"]')?.value||state.preferences.template_key,event.target.value);return;}if(event.target.dataset.check!==undefined){await saveProgress(event.target.dataset.check,event.target.dataset.index,event.target.checked);render();}if(event.target.dataset.habit!==undefined){await saveHabit(event.target.dataset.habit,event.target.checked);render();}}catch(error){state.message=error.message;render();}});
document.addEventListener('submit',async event=>{event.preventDefault();const values=Object.fromEntries(new FormData(event.target));try{if(event.target.id==='sign-in'){const username=String(values.username||'').trim();if(config.demoMode&&isDemoCredential('member',username,values.password)){saveDemoSession('member',values.remember==='on');loadDemoMember();return;}if(!username.includes('@'))throw new Error(demoAccountMessage);const remember=values.remember==='on';localStorage.removeItem(preferenceKey);sessionStorage.removeItem(preferenceKey);(remember?localStorage:sessionStorage).setItem(preferenceKey,remember?'remembered':'temporary');await ensureSupabase();supabase=createSupabase(remember);if(!supabase)throw new Error('Secure sign-in is not configured for this preview.');const {data,error}=await supabase.auth.signInWithPassword({email:username,password:values.password});if(error)throw error;state.user=data.user;await loadMember();return;}if(event.target.id==='request-reset'){const {error}=await supabase.auth.resetPasswordForEmail(values.email,{redirectTo:location.origin});if(error)throw error;state.message='Check your email for the secure reset link.';render();}if(event.target.id==='training-preferences'){await applyPlan(values);state.message='Your future training plan is ready.';state.screen='home';render();}if(event.target.id==='extra-form'){const dayExtras=state.extras.filter(item=>item.day_index===state.dayIndex);if(dayExtras.length>=2)throw new Error('Keep optional extras to two for recovery.');const exercise=state.library.find(item=>item.id===values.exercise_id)||training.catalog.find(item=>item.id===values.exercise_id);if(!exercise)throw new Error('Choose an approved exercise.');if(state.demo){const data=demoData();data.personal.extras.push({day_index:state.dayIndex,position:dayExtras.length,exercise_id:exercise.id});writeDemoMember(data);loadDemoMember();}else{const {error}=await supabase.from('member_extra_templates').upsert({member_id:state.user.id,day_index:state.dayIndex,position:dayExtras.length,exercise_id:exercise.id},{onConflict:'member_id,day_index,position'});if(error)throw error;await loadMember();}state.showExtras=false;state.screen='workout';render();}}catch(error){state.message=error.message;render();}});
if(config.demoMode&&restoreDemoSession('member'))loadDemoMember();else if(supabase){const {data:{session}}=await supabase.auth.getSession();state.user=session?.user||null;if(state.user)await loadMember();else render();}else render();

// Home program cards use the same future-plan persistence as the full selector.
document.addEventListener('click', async event => {
  const button = event.target.closest('button[data-template-choice]');
  if (!button) return;
  try {
    state.message = '';
    await applyPlan({template_key: button.dataset.templateChoice, tier: state.preferences.tier});
    state.message = 'Bi-weekly activity is now your future workout category.';
    state.screen = 'home';
    render();
  } catch (error) {
    state.message = error.message;
    render();
  }
});
