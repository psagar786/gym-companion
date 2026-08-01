import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const config = window.GYM_COMPANION_CONFIG;
const routine = window.GYM_COMPANION_ROUTINE || [];
const app = document.querySelector('#app');
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { detectSessionInUrl: true, persistSession: true }
});
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const logo = '<span class="brand"><img src="assets/fitness7-hero-logo.png" alt="Fitness 7"></span>';
const iso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const scheduledDate = index => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + ((index + 1 - date.getDay() + 7) % 7));
  return date;
};

const state = {
  user: null, profile: null, membership: null, plans: [], sessions: [],
  screen: 'home', dayIndex: 0, message: ''
};

function notice() {
  return state.message ? `<p class="notice">${escapeHtml(state.message)}</p>` : '';
}

function header() {
  const name = state.profile?.full_name || state.user?.email || 'Member';
  return `<header class="topbar">${logo}<div class="topbar-actions"><span class="name">${escapeHtml(name)}</span><button class="avatar" data-screen="profile" aria-label="Open profile">${escapeHtml(name.slice(0, 1).toUpperCase())}</button></div></header>`;
}

function renderSignIn() {
  app.innerHTML = `<main class="shell auth">${logo}<section class="auth-panel"><p class="eyebrow">FITNESS 7 MEMBER</p><h1>Your workout is ready.</h1><p>Sign in to see the routine assigned by your coach.</p>${notice()}<form id="sign-in" class="stack"><label class="field">Email<input name="email" type="email" required autocomplete="email"></label><label class="field">Password<input name="password" type="password" required autocomplete="current-password"></label><button class="button">Sign in</button></form><button class="link-button" data-show-reset>Forgot password?</button><form id="request-reset" class="stack hidden"><label class="field">Email<input name="email" type="email" required></label><button class="button secondary">Send reset link</button></form></section></main>`;
}

function renderHome() {
  const today = new Date();
  app.innerHTML = `<main class="shell">${header()}${notice()}<section class="home-hero">${logo}<p class="eyebrow">${today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>Hello, ${escapeHtml((state.profile.full_name || 'Member').split(' ')[0])}</h1><p>Choose your training day. Your coach’s latest plan appears automatically.</p></section><section class="day-grid">${routine.map((day, index) => {
    const plan = state.plans.find(item => item.day_index === index);
    const date = scheduledDate(index);
    return `<button class="day-card" data-day="${index}"><b>${escapeHtml(day.day)}</b><span>${escapeHtml(plan?.focus || 'Plan not assigned')}</span><small>${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</small><em class="status">${plan ? 'Ready' : 'Ask your coach'}</em></button>`;
  }).join('')}<button class="day-card" data-screen="profile"><b>My progress</b><span>History & membership</span><small>${state.sessions.length} saved workouts</small></button></section></main>`;
}

function sessionSnapshot(plan) {
  return {
    focus: plan.focus,
    slots: [...(plan.member_plan_slots || [])].sort((a, b) => a.position - b.position).map(slot => ({
      id: slot.id, exercise: slot.exercise, alternative: slot.alternative
    })),
    warmup: plan.warmup || [], recovery: plan.recovery || []
  };
}

function guidedSection(title, items, checks, key) {
  if (!items?.length) return '';
  return `<section class="section-title"><div><p class="eyebrow">RECOMMENDED · OPTIONAL</p><h2>${title}</h2></div></section><section class="card workout-list">${items.map((item, index) => `<article class="exercise"><div class="visual" style="background-image:url('${escapeHtml(item.image || '')}')" role="img" aria-label="${escapeHtml(item.alt || item.title)}"></div><div><h3>${escapeHtml(item.title || item.name)}</h3><p>${escapeHtml(item.duration || item.scheme || '')}</p><p>${escapeHtml(item.cue || '')}</p></div><label class="check"><input type="checkbox" data-check="${key}" data-index="${index}" ${checks[index] ? 'checked' : ''}><span>Done</span></label></article>`).join('')}</section>`;
}

function renderWorkout() {
  const plan = state.plans.find(item => item.day_index === state.dayIndex);
  if (!plan) {
    app.innerHTML = `<main class="shell">${header()}<button class="link-button" data-screen="home">‹ All days</button><section class="card empty-state"><h1>No plan assigned</h1><p>Your coach has not added a ${escapeHtml(routine[state.dayIndex].day)} routine yet.</p></section></main>`;
    return;
  }
  const date = iso(scheduledDate(state.dayIndex));
  const saved = state.sessions.find(item => item.session_date === date);
  const snapshot = saved?.plan_snapshot || sessionSnapshot(plan);
  const progress = saved?.progress || { slots: {}, choices: {}, warmup: {}, recovery: {} };
  const completed = Object.values(progress.slots || {}).filter(Boolean).length;
  app.innerHTML = `<main class="shell">${header()}${notice()}<button class="link-button" data-screen="home">‹ All days</button><section class="detail-head"><div><p class="eyebrow">${scheduledDate(state.dayIndex).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>${escapeHtml(snapshot.focus)}</h1><p>${completed}/${snapshot.slots.length} exercises completed</p></div><button class="pill" data-screen="profile">History</button></section>${guidedSection('Warm-up', snapshot.warmup, progress.warmup || {}, 'warmup')}<section class="section-title"><div><p class="eyebrow">MAIN WORKOUT</p><h2>Your exercises</h2></div></section><section class="workout-list">${snapshot.slots.map((slot, index) => {
    const choice = progress.choices?.[index] || 0;
    const exercise = choice === 1 && slot.alternative ? slot.alternative : slot.exercise;
    return `<article class="card exercise"><div class="visual" style="background-image:url('${escapeHtml(exercise.image_path)}')" role="img" aria-label="${escapeHtml(exercise.alt_text)}"></div><div><h3>${escapeHtml(exercise.name)}</h3><p>${escapeHtml(exercise.target_muscles)} · ${escapeHtml(exercise.scheme)}</p><p>${escapeHtml(exercise.cue)}</p>${slot.alternative ? `<div class="choices"><button class="pill choice ${choice === 0 ? 'selected' : ''}" data-choice="${index}" data-choice-index="0">Main</button><button class="pill choice ${choice === 1 ? 'selected' : ''}" data-choice="${index}" data-choice-index="1">Alternative</button></div>` : ''}</div><label class="check"><input type="checkbox" data-check="slots" data-index="${index}" ${progress.slots?.[index] ? 'checked' : ''}><span>Done</span></label></article>`;
  }).join('')}</section>${guidedSection('Post-workout recovery', snapshot.recovery, progress.recovery || {}, 'recovery')}<section class="utility"><button class="button secondary" data-clear-session="${date}">Clear today’s checkmarks</button></section></main>`;
}

function renderProfile() {
  const membership = state.membership || {};
  app.innerHTML = `<main class="shell">${header()}${notice()}<button class="link-button" data-screen="home">‹ Home</button><section class="section-title"><div><p class="eyebrow">MY ACCOUNT</p><h1>${escapeHtml(state.profile.full_name)}</h1></div></section><section class="profile-grid"><article class="card"><h2>Membership</h2><p class="membership-badge ${escapeHtml(membership.status || '')}">${escapeHtml(membership.status || 'Not set')}</p><p>${membership.starts_on ? `Started ${escapeHtml(membership.starts_on)}` : 'Start date not set'}${membership.ends_on ? ` · Ends ${escapeHtml(membership.ends_on)}` : ''}</p></article><article class="card"><h2>Change password</h2><form id="change-password" class="stack"><label class="field">New password<input name="password" type="password" minlength="8" required autocomplete="new-password"></label><button class="button">Update password</button></form></article></section><section class="section-title"><div><p class="eyebrow">WORKOUT HISTORY</p><h2>Recent sessions</h2></div></section><section class="history-list">${state.sessions.length ? state.sessions.map(session => {
    const done = Object.values(session.progress?.slots || {}).filter(Boolean).length;
    return `<article class="card history-row"><div><b>${escapeHtml(session.plan_snapshot?.focus || 'Workout')}</b><small>${escapeHtml(session.session_date)}</small></div><span>${done}/${session.plan_snapshot?.slots?.length || 0}</span></article>`;
  }).join('') : '<article class="card empty">No completed exercises yet.</article>'}</section><section class="utility"><button class="button secondary" data-sign-out>Sign out</button></section></main>`;
}

function render() {
  if (!state.user) return renderSignIn();
  if (state.screen === 'workout') return renderWorkout();
  if (state.screen === 'profile') return renderProfile();
  return renderHome();
}

async function loadMember() {
  const [profileResult, membershipResult, plansResult, sessionsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', state.user.id).single(),
    supabase.from('memberships').select('*').eq('member_id', state.user.id).maybeSingle(),
    supabase.from('member_weekly_plans').select('*,member_plan_slots(*,exercise:exercise_library!member_plan_slots_exercise_id_fkey(*),alternative:exercise_library!member_plan_slots_alternative_exercise_id_fkey(*))').eq('member_id', state.user.id).order('day_index'),
    supabase.from('workout_sessions').select('*').eq('member_id', state.user.id).order('session_date', { ascending: false }).limit(45)
  ]);
  if (profileResult.error) throw profileResult.error;
  state.profile = profileResult.data;
  state.membership = membershipResult.data;
  state.plans = plansResult.data || [];
  state.sessions = sessionsResult.data || [];
  if (!state.profile.active) {
    await supabase.auth.signOut();
    state.user = null;
    state.message = 'Your membership access is inactive. Contact your coach.';
  }
  render();
}

async function saveProgress(group, index, value) {
  const date = iso(scheduledDate(state.dayIndex));
  const plan = state.plans.find(item => item.day_index === state.dayIndex);
  const existing = state.sessions.find(item => item.session_date === date);
  const session = existing || {
    member_id: state.user.id, session_date: date, day_index: state.dayIndex,
    plan_snapshot: sessionSnapshot(plan),
    progress: { slots: {}, choices: {}, warmup: {}, recovery: {} }
  };
  session.progress[group][index] = value;
  const { data, error } = await supabase.from('workout_sessions').upsert(session, { onConflict: 'member_id,session_date' }).select().single();
  if (error) throw error;
  state.sessions = [data, ...state.sessions.filter(item => item.session_date !== date)];
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  try {
    state.message = '';
    if (button.dataset.screen) { state.screen = button.dataset.screen; render(); return; }
    if (button.dataset.day !== undefined) { state.dayIndex = Number(button.dataset.day); state.screen = 'workout'; render(); return; }
    if (button.dataset.showReset !== undefined) { document.querySelector('#request-reset').classList.toggle('hidden'); return; }
    if (button.dataset.choice !== undefined) { await saveProgress('choices', button.dataset.choice, Number(button.dataset.choiceIndex)); render(); return; }
    if (button.dataset.clearSession) {
      const { error } = await supabase.from('workout_sessions').delete().eq('member_id', state.user.id).eq('session_date', button.dataset.clearSession);
      if (error) throw error;
      state.sessions = state.sessions.filter(item => item.session_date !== button.dataset.clearSession);
      render(); return;
    }
    if (button.dataset.signOut !== undefined) { await supabase.auth.signOut(); return; }
  } catch (error) { state.message = error.message; render(); }
});

document.addEventListener('change', async event => {
  if (event.target.dataset.check === undefined) return;
  try { await saveProgress(event.target.dataset.check, event.target.dataset.index, event.target.checked); render(); }
  catch (error) { state.message = error.message; render(); }
});

document.addEventListener('submit', async event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target));
  try {
    if (event.target.id === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
      if (error) throw error;
    }
    if (event.target.id === 'request-reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: location.origin });
      if (error) throw error;
      state.message = 'Check your email for the secure reset link.'; render();
    }
    if (event.target.id === 'change-password') {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      state.message = 'Password updated.'; render();
    }
  } catch (error) { state.message = error.message; render(); }
});

supabase.auth.onAuthStateChange((_event, session) => {
  state.user = session?.user || null;
  if (state.user) loadMember().catch(error => { state.message = error.message; render(); });
  else render();
});
const { data: { session } } = await supabase.auth.getSession();
state.user = session?.user || null;
if (state.user) await loadMember(); else render();
