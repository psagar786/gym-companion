import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { COACH_USERNAME, clearDemoSession, demoAccountMessage, isDemoCredential, readDemoCoach, restoreDemoSession, saveDemoSession, writeDemoCoach } from './demo-mode.js';

const config = window.GYM_COMPANION_CONFIG;
const routine = window.GYM_COMPANION_ROUTINE || [];
const app = document.querySelector('#app');
const sessionPreferenceKey = 'gym-companion-v3-admin-auth-storage';
const createSupabase = remember => createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { detectSessionInUrl: true, persistSession: true, storage: remember ? localStorage : sessionStorage }
});
let supabase = createSupabase(localStorage.getItem(sessionPreferenceKey) === 'remembered');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const logo = '<span class="brand"><img src="assets/fitness7-hero-logo.png" alt="Fitness 7"></span>';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const state = {
  user: null, profile: null, members: [], exercises: [], plans: [],
  view: 'dashboard', selectedMemberId: '', selectedDay: 0, message: '', search: '', demo: false
};

function notice() { return state.message ? `<p class="notice">${escapeHtml(state.message)}</p>` : ''; }
function demoBanner() { return state.demo ? '<aside class="preview-banner demo-banner"><b>Demo mode</b><span>Sample-only workspace — edits stay in this browser and are never sent to Fitness 7 or Supabase.</span></aside>' : ''; }
function selectedMember() { return state.members.find(member => member.id === state.selectedMemberId); }
function selectedMembership() { return selectedMember()?.memberships?.[0] || {}; }

async function adminRequest(action, payload = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ action, ...payload })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}

function signInView() {
  app.innerHTML = `<main class="shell auth">${logo}<section class="auth-panel"><p class="eyebrow">FITNESS 7 COACH</p><h1>Coach workspace</h1><p>Manage members and build their weekly routines.</p>${config.demoMode ? '<p class="demo-hint">Demo: <b>sagar.paperwala003.admin</b> · password <b>1234</b></p>' : ''}${notice()}<form id="admin-sign-in" class="stack"><label class="field">Username or email<input name="username" required autocomplete="username"></label><label class="field">Password<input name="password" type="password" required autocomplete="current-password"></label><label class="remember-row"><input name="remember" type="checkbox"> Remember me</label><button class="button">Sign in as coach</button></form></section></main>`;
}

function accessDeniedView() {
  app.innerHTML = `<main class="shell auth">${logo}<section class="auth-panel"><p class="eyebrow">COACH ACCESS</p><h1>This account is not an admin.</h1><p>Ask the Fitness 7 owner to promote this account before using the coach workspace.</p><button class="button secondary" data-sign-out>Sign out</button></section></main>`;
}

function header() {
  return `<header class="topbar coach-topbar">${logo}<div class="topbar-actions"><span class="name">${escapeHtml(state.profile.full_name || 'Coach')}</span><span class="role-badge">${escapeHtml(state.profile.role)}</span><button class="pill" data-sign-out>Sign out</button></div></header>`;
}

function navigation() {
  return `<nav class="coach-nav" aria-label="Coach workspace"><button class="coach-nav-item ${state.view === 'dashboard' ? 'active' : ''}" data-view="dashboard">Home</button><button class="coach-nav-item ${['members', 'member'].includes(state.view) ? 'active' : ''}" data-view="members">Members</button><button class="coach-nav-item ${state.view === 'plans' ? 'active' : ''}" data-view="plans">Workout plans</button><button class="coach-nav-item ${state.view === 'exercises' ? 'active' : ''}" data-view="exercises">Exercises</button></nav>`;
}

function dashboardView() {
  const active = state.members.filter(member => member.memberships?.[0]?.status === 'active').length;
  const endingSoon = state.members.filter(member => {
    const end = member.memberships?.[0]?.ends_on;
    if (!end) return false;
    const daysLeft = (new Date(`${end}T00:00:00`) - new Date()) / 86400000;
    return daysLeft >= 0 && daysLeft <= 14;
  }).length;
  return `<section class="coach-hero"><p class="eyebrow">TODAY’S OVERVIEW</p><h1>What would you like to manage?</h1><p>Everything important is one tap away.</p></section><section class="coach-actions"><button class="action-card primary" data-view="members" data-open-invite><span>＋</span><b>Add a new member</b><small>Create account and membership</small></button><button class="action-card" data-view="plans"><span>▦</span><b>Build a workout plan</b><small>Assign exercises by day</small></button><button class="action-card" data-view="exercises"><span>●</span><b>Exercise library</b><small>${state.exercises.filter(item => item.active).length} active exercises</small></button></section><section class="summary-grid"><article class="summary-card"><small>Total members</small><strong>${state.members.length}</strong></article><article class="summary-card"><small>Active memberships</small><strong>${active}</strong></article><article class="summary-card"><small>Ending in 14 days</small><strong>${endingSoon}</strong></article></section>`;
}

function memberListView() {
  const query = state.search.toLowerCase();
  const members = state.members.filter(member => (member.full_name || '').toLowerCase().includes(query));
  return `<section class="page-heading"><div><p class="eyebrow">MEMBERS</p><h1>Gym members</h1><p>Select a member to update membership or exercises.</p></div><button class="button" data-toggle-invite>＋ Add member</button></section><section id="invite-panel" class="card invite-panel hidden"><div class="section-title compact"><div><h2>Add a member</h2><p>They will receive a secure email to set their password.</p></div><button class="icon-btn" data-toggle-invite aria-label="Close">×</button></div><form id="invite-member" class="simple-form"><label class="field">Full name<input name="full_name" required placeholder="Member name"></label><label class="field">Email<input name="email" type="email" required placeholder="member@example.com"></label><button class="button">Send invitation</button></form></section><label class="search-box"><span>⌕</span><input id="member-search" value="${escapeHtml(state.search)}" placeholder="Search member by name"></label><section class="member-cards">${members.length ? members.map(member => {
    const membership = member.memberships?.[0] || {};
    return `<button class="member-card" data-member="${member.id}"><span class="member-avatar">${escapeHtml((member.full_name || '?').slice(0, 1).toUpperCase())}</span><span><b>${escapeHtml(member.full_name || 'Unnamed member')}</b><small>Joined ${escapeHtml(String(member.created_at || '').slice(0, 10))}</small></span><span class="membership-badge ${escapeHtml(membership.status || '')}">${escapeHtml(membership.status || 'not set')}</span><i>›</i></button>`;
  }).join('') : '<article class="card empty">No members found.</article>'}</section>`;
}

function memberDetailView() {
  const member = selectedMember();
  if (!member) return memberListView();
  const membership = selectedMembership();
  return `<button class="link-button" data-view="members">‹ All members</button><section class="member-profile-head"><span class="member-avatar large">${escapeHtml((member.full_name || '?').slice(0, 1).toUpperCase())}</span><div><p class="eyebrow">MEMBER PROFILE</p><h1>${escapeHtml(member.full_name)}</h1><span class="membership-badge ${escapeHtml(membership.status || '')}">${escapeHtml(membership.status || 'not set')}</span></div></section><section class="quick-actions"><button class="action-card" data-member-plan="${member.id}"><span>▦</span><b>Edit workout</b><small>Personal weekly plan</small></button><button class="action-card" data-reset-member="${member.id}"><span>↻</span><b>Reset password</b><small>Send secure email</small></button></section><section class="card"><div class="section-title compact"><div><h2>Membership</h2><p>Update access and membership dates.</p></div></div><form id="membership-form" class="simple-form"><input name="id" type="hidden" value="${member.id}"><label class="field">Member name<input name="full_name" value="${escapeHtml(member.full_name)}" required></label><label class="field">Status<select name="status">${['active', 'paused', 'expired', 'cancelled'].map(status => `<option value="${status}" ${membership.status === status ? 'selected' : ''}>${status[0].toUpperCase() + status.slice(1)}</option>`).join('')}</select></label><label class="field">Start date<input name="starts_on" type="date" value="${escapeHtml(membership.starts_on || '')}"></label><label class="field">End date<input name="ends_on" type="date" value="${escapeHtml(membership.ends_on || '')}"></label><label class="field full">Coach notes<textarea name="notes" placeholder="Optional private note">${escapeHtml(membership.notes || '')}</textarea></label><button class="button">Save changes</button><button type="button" class="button danger" data-deactivate-member="${member.id}">Remove app access</button></form></section>`;
}

function exerciseOptions(selected, allowEmpty = true) {
  return `${allowEmpty ? '<option value="">No alternative</option>' : '<option value="">Choose exercise</option>'}${state.exercises.filter(item => item.active).map(item => `<option value="${item.id}" ${item.id === selected ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}`;
}

function planSlot(slot, index) {
  return `<article class="plan-slot"><span class="slot-number">${index + 1}</span><label class="field">Main exercise<select name="exercise_id" required>${exerciseOptions(slot?.exercise_id, false)}</select></label><label class="field">Alternative<select name="alternative_exercise_id">${exerciseOptions(slot?.alternative_exercise_id)}</select></label><button type="button" class="icon-btn" data-remove-plan-slot aria-label="Remove exercise">×</button></article>`;
}

function plansView() {
  const member = selectedMember() || state.members[0];
  if (!member) return '<section class="card empty">Add a member before creating a workout plan.</section>';
  const plan = state.plans.find(item => item.member_id === member.id && item.day_index === state.selectedDay);
  const slots = [...(plan?.member_plan_slots || [])].sort((a, b) => a.position - b.position);
  return `<section class="page-heading"><div><p class="eyebrow">PERSONAL WORKOUT</p><h1>Build a weekly plan</h1><p>Choose one member, one day, then add the exercises.</p></div></section><section class="coach-step card"><span class="step-label">1</span><label class="field">Choose member<select id="plan-member">${state.members.map(item => `<option value="${item.id}" ${item.id === member.id ? 'selected' : ''}>${escapeHtml(item.full_name)}</option>`).join('')}</select></label></section><section class="coach-step card"><span class="step-label">2</span><div><b>Choose training day</b><div class="day-picker">${days.map((day, index) => `<button class="day-chip ${index === state.selectedDay ? 'selected' : ''}" data-plan-day="${index}">${day.slice(0, 3)}</button>`).join('')}</div></div></section><form id="plan-form" class="card plan-builder"><input name="member_id" type="hidden" value="${member.id}"><input name="day_index" type="hidden" value="${state.selectedDay}"><div class="section-title compact"><div><span class="step-label">3</span><h2>${days[state.selectedDay]} workout</h2></div><button type="button" class="pill" data-add-plan-slot>＋ Add exercise</button></div><label class="field">Simple workout title<input name="focus" value="${escapeHtml(plan?.focus || routine[state.selectedDay]?.focus || '')}" required placeholder="Example: Back + Biceps"></label><div id="plan-slots">${(slots.length ? slots : Array.from({ length: 5 })).map(planSlot).join('')}</div><div class="sticky-save"><span>${slots.length || 5} exercise slots</span><button class="button">Save ${days[state.selectedDay]} plan</button></div></form>`;
}

function assetChoices(selected) {
  const assets = [...new Set(routine.flatMap(day => day.slots.flatMap(slot => [slot.primary, slot.alternative, slot.third].filter(Boolean).map(item => item.image))))];
  return assets.map(path => `<option value="${escapeHtml(path)}" ${path === selected ? 'selected' : ''}>${escapeHtml(path.replace('assets/exercises/', '').replace('.png', '').replaceAll('-', ' '))}</option>`).join('');
}

function exercisesView() {
  return `<section class="page-heading"><div><p class="eyebrow">EXERCISE LIBRARY</p><h1>Approved exercises</h1><p>Archive old exercises instead of deleting workout history.</p></div><button class="button" data-toggle-exercise>＋ Add exercise</button></section><section id="exercise-editor" class="card hidden"><div class="section-title compact"><div><h2 id="exercise-editor-title">Add exercise</h2><p>Use clear language that a member can follow.</p></div><button class="icon-btn" data-toggle-exercise>×</button></div><form id="exercise-form" class="simple-form"><input name="id" type="hidden"><label class="field">Exercise name<input name="name" required></label><label class="field">Target muscles<input name="target_muscles" required placeholder="Lats + biceps"></label><label class="field">Sets and reps<input name="scheme" required placeholder="3 × 8–12 · 90 sec"></label><label class="field full">One coaching cue<textarea name="cue" required placeholder="Keep your chest tall and pull elbows down."></textarea></label><label class="field">Illustration<select name="image_path">${assetChoices()}</select></label><input name="slug" type="hidden"><input name="alt_text" type="hidden"><button class="button">Save exercise</button></form></section><section class="exercise-library-grid">${state.exercises.map(exercise => `<article class="exercise-library-card ${exercise.active ? '' : 'archived'}"><div class="visual large-visual" style="background-image:url('${escapeHtml(exercise.image_path)}')" role="img" aria-label="${escapeHtml(exercise.alt_text)}"></div><div><b>${escapeHtml(exercise.name)}</b><small>${escapeHtml(exercise.target_muscles)}</small><p>${escapeHtml(exercise.scheme)}</p></div><div class="row-actions"><button class="pill" data-edit-exercise="${exercise.id}">Edit</button><button class="pill" data-archive-exercise="${exercise.id}" data-active="${exercise.active ? 'false' : 'true'}">${exercise.active ? 'Archive' : 'Restore'}</button></div></article>`).join('')}</section>`;
}

function render() {
  if (!state.user) return signInView();
  if (!['owner', 'admin'].includes(state.profile?.role)) return accessDeniedView();
  const content = state.view === 'dashboard' ? dashboardView()
    : state.view === 'members' ? memberListView()
    : state.view === 'member' ? memberDetailView()
    : state.view === 'plans' ? plansView()
    : exercisesView();
  app.innerHTML = `<main class="shell coach-shell">${header()}${demoBanner()}${navigation()}${notice()}${content}</main>`;
}

async function loadPlans() {
  if (state.demo) { state.plans = readDemoCoach(routine).plans.filter(item => item.member_id === state.selectedMemberId); return; }
  if (!state.selectedMemberId) { state.plans = []; return; }
  const { data, error } = await supabase.from('member_weekly_plans').select('*,member_plan_slots(*)').eq('member_id', state.selectedMemberId);
  if (error) throw error;
  state.plans = data || [];
}

async function loadAdmin() {
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', state.user.id).single();
  if (error) throw error;
  state.profile = profile;
  if (!['owner', 'admin'].includes(profile.role)) { render(); return; }
  const [membersResult, exercisesResult] = await Promise.all([
    adminRequest('members'),
    supabase.from('exercise_library').select('*').order('name')
  ]);
  state.members = membersResult.members.filter(member => member.role === 'member');
  state.exercises = exercisesResult.data || [];
  state.selectedMemberId ||= state.members[0]?.id || '';
  await loadPlans();
  render();
}

function loadDemoAdmin() {
  const demo = readDemoCoach(routine);
  state.demo = true;
  state.user = { id: demo.profile.id, email: COACH_USERNAME };
  state.profile = demo.profile;
  state.members = demo.members;
  state.exercises = demo.exercises;
  state.selectedMemberId ||= state.members[0]?.id || '';
  state.plans = demo.plans.filter(item => item.member_id === state.selectedMemberId);
  render();
}

function persistDemo(mutator) {
  const demo = readDemoCoach(routine);
  mutator(demo);
  writeDemoCoach(demo);
  state.members = demo.members;
  state.exercises = demo.exercises;
  state.plans = demo.plans.filter(item => item.member_id === state.selectedMemberId);
}

async function refreshMembers() {
  if (state.demo) { state.members = readDemoCoach(routine).members; return; }
  const result = await adminRequest('members');
  state.members = result.members.filter(member => member.role === 'member');
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  try {
    state.message = '';
    if (button.dataset.view) {
      state.view = button.dataset.view;
      if (button.dataset.openInvite !== undefined) setTimeout(() => document.querySelector('#invite-panel')?.classList.remove('hidden'));
      render(); return;
    }
    if (button.dataset.signOut !== undefined) {
      if (state.demo) { clearDemoSession('admin'); state.demo = false; state.user = null; state.profile = null; render(); }
      else { await supabase.auth.signOut(); localStorage.removeItem(sessionPreferenceKey); sessionStorage.removeItem(sessionPreferenceKey); state.user = null; render(); }
      return;
    }
    if (button.dataset.toggleInvite !== undefined) { document.querySelector('#invite-panel').classList.toggle('hidden'); return; }
    if (button.dataset.member) { state.selectedMemberId = button.dataset.member; state.view = 'member'; await loadPlans(); render(); return; }
    if (button.dataset.memberPlan) { state.selectedMemberId = button.dataset.memberPlan; state.view = 'plans'; await loadPlans(); render(); return; }
    if (button.dataset.resetMember) {
      if (state.demo) state.message = 'Demo accounts use sample credentials; no password-reset email was sent.';
      else { await adminRequest('reset-password', { member_id: button.dataset.resetMember }); state.message = 'Password reset email sent.'; }
      render(); return;
    }
    if (button.dataset.deactivateMember) {
      const member = selectedMember();
      if (!confirm(`Remove app access for ${member.full_name}? Their history will be preserved.`)) return;
      if (state.demo) persistDemo(demo => { const target = demo.members.find(item => item.id === member.id); target.memberships[0].status = 'cancelled'; });
      else await adminRequest('update-member', { id: member.id, full_name: member.full_name, status: 'cancelled', starts_on: selectedMembership().starts_on, ends_on: selectedMembership().ends_on, notes: selectedMembership().notes });
      await refreshMembers(); state.message = 'Member access removed. Their records were preserved.'; state.view = 'members'; render(); return;
    }
    if (button.dataset.planDay !== undefined) { state.selectedDay = Number(button.dataset.planDay); render(); return; }
    if (button.dataset.addPlanSlot !== undefined) {
      const container = document.querySelector('#plan-slots');
      container.insertAdjacentHTML('beforeend', planSlot(null, container.children.length)); return;
    }
    if (button.dataset.removePlanSlot !== undefined) { button.closest('.plan-slot').remove(); return; }
    if (button.dataset.toggleExercise !== undefined) { document.querySelector('#exercise-editor').classList.toggle('hidden'); return; }
    if (button.dataset.editExercise) {
      const exercise = state.exercises.find(item => item.id === button.dataset.editExercise);
      const editor = document.querySelector('#exercise-editor');
      const form = document.querySelector('#exercise-form');
      editor.classList.remove('hidden');
      document.querySelector('#exercise-editor-title').textContent = `Edit ${exercise.name}`;
      for (const key of ['id', 'name', 'target_muscles', 'scheme', 'cue', 'image_path', 'slug', 'alt_text']) form.elements[key].value = exercise[key] || '';
      editor.scrollIntoView({ behavior: 'smooth' }); return;
    }
    if (button.dataset.archiveExercise) {
      if (state.demo) persistDemo(demo => { const exercise = demo.exercises.find(item => item.id === button.dataset.archiveExercise); if (exercise) exercise.active = button.dataset.active === 'true'; });
      else { await adminRequest('archive-exercise', { id: button.dataset.archiveExercise, active: button.dataset.active === 'true' }); const { data } = await supabase.from('exercise_library').select('*').order('name'); state.exercises = data || []; }
      state.message = 'Exercise library updated.'; render(); return;
    }
  } catch (error) { state.message = error.message; render(); }
});

document.addEventListener('input', event => {
  if (event.target.id === 'member-search') { state.search = event.target.value; render(); document.querySelector('#member-search')?.focus(); }
});

document.addEventListener('change', async event => {
  if (event.target.id !== 'plan-member') return;
  try { state.selectedMemberId = event.target.value; await loadPlans(); render(); }
  catch (error) { state.message = error.message; render(); }
});

document.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.target;
  const values = Object.fromEntries(new FormData(form));
  try {
    if (form.id === 'admin-sign-in') {
      const username = String(values.username || '').trim();
      if (config.demoMode && isDemoCredential('admin', username, values.password)) {
        saveDemoSession('admin', values.remember === 'on'); loadDemoAdmin(); return;
      }
      if (!username.includes('@')) throw new Error(demoAccountMessage);
      const remember = values.remember === 'on';
      localStorage.removeItem(sessionPreferenceKey); sessionStorage.removeItem(sessionPreferenceKey);
      (remember ? localStorage : sessionStorage).setItem(sessionPreferenceKey, remember ? 'remembered' : 'temporary');
      supabase = createSupabase(remember);
      const { data, error } = await supabase.auth.signInWithPassword({ email: username, password: values.password });
      if (error) throw error;
      state.user = data.user; await loadAdmin(); return;
    }
    if (form.id === 'invite-member') {
      if (state.demo) {
        persistDemo(demo => { const id = `demo-member-${Date.now()}`; demo.members.push({ id, full_name: values.full_name, role: 'member', active: true, created_at: new Date().toISOString(), memberships: [{ member_id: id, status: 'active', starts_on: '', ends_on: '', notes: 'Demo member' }] }); });
        state.message = 'Sample member added locally. No invitation email was sent.';
      } else { await adminRequest('invite', values); await refreshMembers(); state.message = 'Member invited. They will receive a password setup email.'; }
      render();
    }
    if (form.id === 'membership-form') {
      if (state.demo) persistDemo(demo => { const member = demo.members.find(item => item.id === values.id); if (!member) return; member.full_name = values.full_name; member.memberships[0] = { member_id: member.id, status: values.status, starts_on: values.starts_on, ends_on: values.ends_on, notes: values.notes }; });
      else { await adminRequest('update-member', values); await refreshMembers(); }
      state.message = 'Membership saved.'; render();
    }
    if (form.id === 'plan-form') {
      const slots = [...form.querySelectorAll('.plan-slot')].map(row => ({
        exercise_id: row.querySelector('[name="exercise_id"]').value,
        alternative_exercise_id: row.querySelector('[name="alternative_exercise_id"]').value || null
      })).filter(slot => slot.exercise_id);
      const plan = { member_id: values.member_id, day_index: Number(values.day_index), focus: values.focus, slots, warmup: routine[Number(values.day_index)].warmup.steps, recovery: routine[Number(values.day_index)].finish.steps };
      if (state.demo) persistDemo(demo => {
        const existingIndex = demo.plans.findIndex(item => item.member_id === plan.member_id && item.day_index === plan.day_index);
        const record = { id: existingIndex >= 0 ? demo.plans[existingIndex].id : `demo-plan-${plan.member_id}-${plan.day_index}`, member_id: plan.member_id, day_index: plan.day_index, focus: plan.focus, warmup: plan.warmup, recovery: plan.recovery, member_plan_slots: plan.slots.map((slot, position) => ({ id: `demo-slot-${plan.member_id}-${plan.day_index}-${position}`, position, ...slot })) };
        if (existingIndex >= 0) demo.plans[existingIndex] = record; else demo.plans.push(record);
      });
      else await adminRequest('save-plan', { plan });
      await loadPlans(); state.message = `${days[state.selectedDay]} plan saved for ${selectedMember().full_name}.`; render();
    }
    if (form.id === 'exercise-form') {
      const name = values.name.trim();
      values.slug ||= name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      values.alt_text ||= `Fitness 7 illustration: ${name}`;
      if (state.demo) persistDemo(demo => { const item = { ...values, id: values.id || `demo-exercise-${Date.now()}`, active: true }; const index = demo.exercises.findIndex(exercise => exercise.id === item.id); if (index >= 0) demo.exercises[index] = { ...demo.exercises[index], ...item }; else demo.exercises.push(item); });
      else { await adminRequest('save-exercise', { exercise: values }); const { data } = await supabase.from('exercise_library').select('*').order('name'); state.exercises = data || []; }
      state.message = 'Exercise saved.'; render();
    }
  } catch (error) { state.message = error.message; render(); }
});

if (config.demoMode && restoreDemoSession('admin')) loadDemoAdmin();
else {
  const { data: { session } } = await supabase.auth.getSession();
  state.user = session?.user || null;
  if (state.user) await loadAdmin(); else render();
}
