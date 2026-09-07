const app = document.querySelector('#app');
const routine = window.GYM_COMPANION_ROUTINE || [];
const storageKey = 'gym-companion-v3-local-preview';
const logo = '<span class="brand"><img src="assets/fitness7-hero-logo.png" alt="Fitness 7"></span>';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const exerciseCatalog = [];
const catalogIds = new Set();
for (const day of routine) {
  for (const slot of day.slots) {
    for (const movement of [slot.primary, slot.alternative, slot.third].filter(Boolean)) {
      const id = movement.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (catalogIds.has(id)) continue;
      catalogIds.add(id);
      exerciseCatalog.push({ id, name: movement.name, image: movement.image, scheme: slot.scheme, cue: slot.cue, target: day.focus });
    }
  }
}

function planFromRoutine(day, index) {
  return {
    focus: day.focus,
    slots: day.slots.map(slot => ({
      primary: slot.primary.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      alternative: slot.alternative.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    })),
    warmup: day.warmup.steps,
    recovery: day.finish.steps,
    dayIndex: index
  };
}

const initialStore = {
  members: [{
    id: 'preview-member-1', name: 'Sagar Paperwala', status: 'active',
    startsOn: '2026-07-01', endsOn: '2026-10-01', notes: 'Physique-first plan',
    plans: Object.fromEntries(routine.map((day, index) => [index, planFromRoutine(day, index)])),
    checks: {}
  }]
};
let store;
try { store = JSON.parse(localStorage.getItem(storageKey)) || initialStore; }
catch { store = initialStore; }
let view = 'launcher';
let selectedMemberId = store.members[0]?.id || '';
let selectedDay = Math.min(Math.max(new Date().getDay() - 1, 0), 5);

const persist = () => localStorage.setItem(storageKey, JSON.stringify(store));
const member = () => store.members.find(item => item.id === selectedMemberId) || store.members[0];
const exercise = id => exerciseCatalog.find(item => item.id === id);
const previewBanner = '<aside class="preview-banner"><b>Local preview</b><span>Changes stay on this device. Hosted apps will use secure member accounts.</span><button data-launcher>Switch app</button></aside>';

function launcher() {
  app.innerHTML = `<main class="shell preview-launcher">${logo}<section class="home-hero"><p class="eyebrow">FITNESS 7 V3 PREVIEW</p><h1>Choose an app to preview</h1><p>The live release will use two separate Vercel links.</p></section><section class="preview-choice-grid"><button class="preview-choice member-choice" data-preview="member"><span>01</span><h2>Member app</h2><p>Daily routines, illustrations, progress, profile and password.</p><b>Open member preview →</b></button><button class="preview-choice coach-choice" data-preview="coach"><span>02</span><h2>Coach app</h2><p>Members, memberships, exercise library and personal plans.</p><b>Open coach preview →</b></button></section></main>`;
}

function coachHeader() {
  return `${previewBanner}<header class="topbar coach-topbar">${logo}<div class="topbar-actions"><span class="role-badge">Coach preview</span></div></header><nav class="coach-nav"><button class="coach-nav-item ${view === 'coach' ? 'active' : ''}" data-coach-view="coach">Home</button><button class="coach-nav-item ${['members', 'member'].includes(view) ? 'active' : ''}" data-coach-view="members">Members</button><button class="coach-nav-item ${view === 'plan' ? 'active' : ''}" data-coach-view="plan">Workout plans</button><button class="coach-nav-item ${view === 'library' ? 'active' : ''}" data-coach-view="library">Exercises</button></nav>`;
}

function coachDashboard() {
  const active = store.members.filter(item => item.status === 'active').length;
  app.innerHTML = `<main class="shell coach-shell">${coachHeader()}<section class="coach-hero"><p class="eyebrow">TODAY’S OVERVIEW</p><h1>Simple tools for your members</h1><p>Choose the job you want to complete.</p></section><section class="coach-actions"><button class="action-card primary" data-coach-view="members" data-open-add><span>＋</span><b>Add a new member</b><small>Create their gym profile</small></button><button class="action-card" data-coach-view="plan"><span>▦</span><b>Build a workout plan</b><small>Assign exercises by weekday</small></button><button class="action-card" data-coach-view="library"><span>●</span><b>Exercise library</b><small>${exerciseCatalog.length} approved movements</small></button></section><section class="summary-grid"><article class="summary-card"><small>Total members</small><strong>${store.members.length}</strong></article><article class="summary-card"><small>Active memberships</small><strong>${active}</strong></article><article class="summary-card"><small>Personal plans</small><strong>${store.members.reduce((total, item) => total + Object.keys(item.plans || {}).length, 0)}</strong></article></section></main>`;
}

function membersView(openAdd = false) {
  app.innerHTML = `<main class="shell coach-shell">${coachHeader()}<section class="page-heading"><div><p class="eyebrow">MEMBERS</p><h1>Gym members</h1><p>Select a member to manage membership and workouts.</p></div><button class="button" data-toggle-preview-add>＋ Add member</button></section><section id="preview-add-member" class="card ${openAdd ? '' : 'hidden'}"><div class="section-title compact"><div><h2>Add member</h2><p>In the hosted app, this also sends a secure account invitation.</p></div></div><form id="preview-member-form" class="simple-form"><label class="field">Full name<input name="name" required></label><label class="field">Membership end<input name="endsOn" type="date"></label><button class="button">Save member</button></form></section><section class="member-cards">${store.members.map(item => `<button class="member-card" data-preview-member="${item.id}"><span class="member-avatar">${escapeHtml(item.name.slice(0, 1))}</span><span><b>${escapeHtml(item.name)}</b><small>Membership ends ${escapeHtml(item.endsOn || 'not set')}</small></span><span class="membership-badge ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span><i>›</i></button>`).join('')}</section></main>`;
}

function memberCoachView() {
  const item = member();
  app.innerHTML = `<main class="shell coach-shell">${coachHeader()}<button class="link-button" data-coach-view="members">‹ All members</button><section class="member-profile-head"><span class="member-avatar large">${escapeHtml(item.name.slice(0, 1))}</span><div><p class="eyebrow">MEMBER PROFILE</p><h1>${escapeHtml(item.name)}</h1><span class="membership-badge ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></div></section><section class="quick-actions"><button class="action-card" data-coach-view="plan"><span>▦</span><b>Edit workout</b><small>Personal weekly plan</small></button><button class="action-card" data-preview-reset><span>↻</span><b>Reset password</b><small>Hosted app sends an email</small></button></section><section class="card"><h2>Membership</h2><form id="preview-membership-form" class="simple-form"><label class="field">Name<input name="name" value="${escapeHtml(item.name)}" required></label><label class="field">Status<select name="status">${['active', 'paused', 'expired', 'cancelled'].map(status => `<option ${item.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label><label class="field">Start date<input name="startsOn" type="date" value="${escapeHtml(item.startsOn || '')}"></label><label class="field">End date<input name="endsOn" type="date" value="${escapeHtml(item.endsOn || '')}"></label><label class="field full">Coach notes<textarea name="notes">${escapeHtml(item.notes || '')}</textarea></label><button class="button">Save membership</button></form></section></main>`;
}

const exerciseOptions = selected => `<option value="">No alternative</option>${exerciseCatalog.map(item => `<option value="${item.id}" ${selected === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}`;
function previewPlanSlot(slot = {}, index) {
  return `<article class="plan-slot"><span class="slot-number">${index + 1}</span><label class="field">Main exercise<select name="primary" required><option value="">Choose exercise</option>${exerciseCatalog.map(item => `<option value="${item.id}" ${slot.primary === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select></label><label class="field">Alternative<select name="alternative">${exerciseOptions(slot.alternative)}</select></label><button type="button" class="icon-btn" data-preview-remove-slot>×</button></article>`;
}

function planView() {
  const item = member();
  if (!item) { view = 'members'; return membersView(true); }
  const plan = item.plans?.[selectedDay] || { focus: routine[selectedDay].focus, slots: [] };
  app.innerHTML = `<main class="shell coach-shell">${coachHeader()}<section class="page-heading"><div><p class="eyebrow">PERSONAL WORKOUT</p><h1>Build a weekly plan</h1><p>Member → weekday → exercises.</p></div></section><section class="coach-step card"><span class="step-label">1</span><label class="field">Choose member<select id="preview-plan-member">${store.members.map(candidate => `<option value="${candidate.id}" ${candidate.id === item.id ? 'selected' : ''}>${escapeHtml(candidate.name)}</option>`).join('')}</select></label></section><section class="coach-step card"><span class="step-label">2</span><div><b>Choose training day</b><div class="day-picker">${routine.map((day, index) => `<button class="day-chip ${index === selectedDay ? 'selected' : ''}" data-preview-plan-day="${index}">${day.day.slice(0, 3)}</button>`).join('')}</div></div></section><form id="preview-plan-form" class="card plan-builder"><div class="section-title compact"><div><span class="step-label">3</span><h2>${routine[selectedDay].day} workout</h2></div><button type="button" class="pill" data-preview-add-slot>＋ Add exercise</button></div><label class="field">Workout title<input name="focus" value="${escapeHtml(plan.focus)}" required></label><div id="preview-plan-slots">${(plan.slots.length ? plan.slots : Array.from({ length: 5 }, () => ({}))).map(previewPlanSlot).join('')}</div><div class="sticky-save"><span>${plan.slots.length || 5} exercise slots</span><button class="button">Save plan</button></div></form></main>`;
}

function libraryView() {
  app.innerHTML = `<main class="shell coach-shell">${coachHeader()}<section class="page-heading"><div><p class="eyebrow">EXERCISE LIBRARY</p><h1>Approved exercises</h1><p>Clear illustrations and coach-friendly cues.</p></div></section><section class="exercise-library-grid">${exerciseCatalog.map(item => `<article class="exercise-library-card"><div class="visual large-visual" style="background-image:url('${escapeHtml(item.image)}')"></div><div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.target)}</small><p>${escapeHtml(item.scheme)}</p></div><div class="row-actions"><button class="pill" data-preview-library-edit>Edit</button><button class="pill" data-preview-library-edit>Archive</button></div></article>`).join('')}</section></main>`;
}

function memberHome() {
  const item = member();
  app.innerHTML = `<main class="shell">${previewBanner}<header class="topbar">${logo}<div class="topbar-actions"><span class="name">${escapeHtml(item.name)}</span><span class="role-badge">Member preview</span></div></header><section class="home-hero"><p class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>Hello, ${escapeHtml(item.name.split(' ')[0])}</h1><p>Your coach’s latest plan appears automatically.</p></section><section class="day-grid">${routine.map((day, index) => { const plan = item.plans?.[index]; return `<button class="day-card" data-preview-workout="${index}"><b>${day.day}</b><span>${escapeHtml(plan?.focus || 'Plan not assigned')}</span><small>${plan ? `${plan.slots.length} exercises` : 'Ask your coach'}</small></button>`; }).join('')}<button class="day-card" data-preview-profile><b>My profile</b><span>${escapeHtml(item.status)} membership</span><small>Local preview</small></button></section></main>`;
}

function previewGuided(title, items, checks, prefix) {
  if (!items?.length) return '';
  return `<details class="guided-panel" open><summary><span><p class="eyebrow">RECOMMENDED · OPTIONAL</p><h2>${title}</h2></span><span class="guided-toggle">View</span></summary><section class="card workout-list">${items.map((item,index) => `<article class="exercise"><div class="visual" style="background-image:url('${escapeHtml(item.image || '')}')" role="img" aria-label="${escapeHtml(item.alt || item.title || item.name || '')}"></div><div><h3>${escapeHtml(item.title || item.name || '')}</h3><p>${escapeHtml(item.duration || '')}</p><p>${escapeHtml(item.cue || '')}</p></div><label class="check"><input type="checkbox" data-preview-check="${prefix}-${index}" ${checks[`${prefix}-${index}`] ? 'checked' : ''}><span>Done</span></label></article>`).join('')}</section></details>`;
}

function workoutView() {
  const item = member();
  const plan = item.plans?.[selectedDay];
  if (!plan) { view = 'member-preview'; return memberHome(); }
  const key = `${selectedDay}`;
  const checks = item.checks[key] || {};
  app.innerHTML = `<main class="shell">${previewBanner}<button class="link-button" data-preview-back-member>‹ All days</button><section class="detail-head"><div><p class="eyebrow">${routine[selectedDay].day}</p><h1>${escapeHtml(plan.focus)}</h1><p>${Object.keys(checks).filter(key => !key.startsWith('warmup-') && !key.startsWith('recovery-') && checks[key]).length}/${plan.slots.length} complete</p></div></section>${previewGuided('Pre-workout',plan.warmup,checks,'warmup')}<section class="section-title"><div><p class="eyebrow">MAIN WORKOUT</p><h2>Your exercises</h2></div></section><section class="workout-list">${plan.slots.map((slot, index) => { const movement = exercise(slot.primary); const alternative = exercise(slot.alternative); return `<article class="card exercise"><div class="visual" style="background-image:url('${escapeHtml(movement?.image || '')}')"></div><div><h3>${escapeHtml(movement?.name || 'Exercise')}</h3><p>${escapeHtml(movement?.scheme || '')}</p><p>${escapeHtml(movement?.cue || '')}</p>${alternative ? `<p class="muted">Alternative: ${escapeHtml(alternative.name)}</p>` : ''}</div><label class="check"><input type="checkbox" data-preview-check="${index}" ${checks[index] ? 'checked' : ''}><span>Done</span></label></article>`; }).join('')}</section>${previewGuided('Post-workout recovery',plan.recovery,checks,'recovery')}</main>`;
}

function render() {
  if (view === 'launcher') return launcher();
  if (view === 'coach') return coachDashboard();
  if (view === 'members') return membersView();
  if (view === 'member') return memberCoachView();
  if (view === 'plan') return planView();
  if (view === 'library') return libraryView();
  if (view === 'workout-preview') return workoutView();
  return memberHome();
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.launcher !== undefined) { view = 'launcher'; render(); return; }
  if (button.dataset.preview === 'coach') { view = 'coach'; render(); return; }
  if (button.dataset.preview === 'member') { view = 'member-preview'; render(); return; }
  if (button.dataset.coachView) { view = button.dataset.coachView; render(); if (button.dataset.openAdd !== undefined) document.querySelector('#preview-add-member')?.classList.remove('hidden'); return; }
  if (button.dataset.togglePreviewAdd !== undefined) { document.querySelector('#preview-add-member').classList.toggle('hidden'); return; }
  if (button.dataset.previewMember) { selectedMemberId = button.dataset.previewMember; view = 'member'; render(); return; }
  if (button.dataset.previewReset !== undefined) { alert('Preview: the hosted coach app sends a secure password-reset email.'); return; }
  if (button.dataset.previewPlanDay !== undefined) { selectedDay = Number(button.dataset.previewPlanDay); render(); return; }
  if (button.dataset.previewAddSlot !== undefined) { const list = document.querySelector('#preview-plan-slots'); list.insertAdjacentHTML('beforeend', previewPlanSlot({}, list.children.length)); return; }
  if (button.dataset.previewRemoveSlot !== undefined) { button.closest('.plan-slot').remove(); return; }
  if (button.dataset.previewLibraryEdit !== undefined) { alert('Preview: exercise updates are saved to Supabase in the hosted coach app.'); return; }
  if (button.dataset.previewWorkout !== undefined) { selectedDay = Number(button.dataset.previewWorkout); view = 'workout-preview'; render(); return; }
  if (button.dataset.previewBackMember !== undefined || button.dataset.previewProfile !== undefined) { view = 'member-preview'; render(); }
});

document.addEventListener('change', event => {
  if (event.target.id === 'preview-plan-member') { selectedMemberId = event.target.value; render(); }
  if (event.target.dataset.previewCheck !== undefined) {
    const item = member(); item.checks[selectedDay] ||= {}; item.checks[selectedDay][event.target.dataset.previewCheck] = event.target.checked; persist(); render();
  }
});

document.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target));
  if (event.target.id === 'preview-member-form') {
    const id = `preview-${Date.now()}`;
    store.members.push({ id, name: values.name, status: 'active', startsOn: new Date().toISOString().slice(0, 10), endsOn: values.endsOn, notes: '', plans: {}, checks: {} });
    selectedMemberId = id; persist(); view = 'member'; render(); return;
  }
  if (event.target.id === 'preview-membership-form') {
    Object.assign(member(), values); persist(); render(); return;
  }
  if (event.target.id === 'preview-plan-form') {
    const slots = [...event.target.querySelectorAll('.plan-slot')].map(row => ({ primary: row.querySelector('[name="primary"]').value, alternative: row.querySelector('[name="alternative"]').value })).filter(slot => slot.primary);
    member().plans[selectedDay] = { focus: values.focus, slots, warmup: routine[selectedDay].warmup.steps, recovery: routine[selectedDay].finish.steps, dayIndex: selectedDay };
    persist(); render();
  }
});

render();
