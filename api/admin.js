global.window = global.window || {};
require('../data/routine.js');
const approvedAssets = new Set((window.GYM_COMPANION_ROUTINE || []).flatMap(day => [
  ...day.slots.flatMap(slot => [slot.primary, slot.alternative, slot.third].filter(Boolean).map(item => item.image)),
  ...day.warmup.steps.flatMap(step => [step.image, ...(step.choices || []).map(item => item.image)]),
  ...day.finish.steps.flatMap(step => [step.image, ...(step.choices || []).map(item => item.image)])
]));
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const json = (res, status, body) => res.status(status).json(body);
const clean = value => typeof value === 'string' ? value.trim() : '';
const safeAsset = value => approvedAssets.has(value);

async function supabase(path, { method = 'GET', token, service = false, body } = {}) {
  const base = process.env.SUPABASE_URL;
  const key = service ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY;
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { apikey: key, authorization: `Bearer ${token || key}`, 'content-type': 'application/json', prefer: 'return=representation' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(data?.message || data?.msg || text || 'Supabase request failed');
  return data;
}

async function staff(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sign in is required.');
  const user = await supabase('/auth/v1/user', { token });
  const profiles = await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,role,active`, { service: true });
  const profile = profiles[0];
  if (!profile?.active || !['owner', 'admin'].includes(profile.role)) throw new Error('Admin access is required.');
  return { token, user, profile };
}

module.exports = async (req, res) => {
  if (!required.every(key => process.env[key])) return json(res, 503, { error: 'Server authentication is not configured.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const actor = await staff(req);
    const { action } = req.body || {};
    if (action === 'members') {
      const members = await supabase('/rest/v1/profiles?select=id,full_name,role,active,created_at,memberships(status,starts_on,ends_on,notes)&order=full_name.asc', { service: true });
      return json(res, 200, { members });
    }
    if (action === 'invite') {
      const email = clean(req.body.email).toLowerCase(), full_name = clean(req.body.full_name);
      if (!/^\S+@\S+\.\S+$/.test(email) || !full_name) return json(res, 400, { error: 'A name and valid email are required.' });
      const created = await supabase('/auth/v1/invite', { method: 'POST', service: true, body: { email, data: { full_name }, redirectTo: `${process.env.APP_URL}/` } });
      return json(res, 201, { member: created.user || created });
    }
    if (action === 'update-member') {
      const id = clean(req.body.id), full_name = clean(req.body.full_name), status = clean(req.body.status), starts_on = req.body.starts_on || null, ends_on = req.body.ends_on || null, notes = clean(req.body.notes);
      if (!id || !full_name || !['active', 'paused', 'expired', 'cancelled'].includes(status)) return json(res, 400, { error: 'Invalid member details.' });
      await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', service: true, body: { full_name, active: status !== 'cancelled' } });
      const membership = await supabase(`/rest/v1/memberships?member_id=eq.${encodeURIComponent(id)}&select=id`, { service: true });
      if (membership[0]) await supabase(`/rest/v1/memberships?id=eq.${membership[0].id}`, { method: 'PATCH', service: true, body: { status, starts_on, ends_on, notes } });
      else await supabase('/rest/v1/memberships', { method: 'POST', service: true, body: { member_id: id, status, starts_on, ends_on, notes } });
      return json(res, 200, { ok: true });
    }
    if (action === 'reset-password') {
      const memberId = clean(req.body.member_id);
      if (!memberId) return json(res, 400, { error: 'Select a member first.' });
      const account = await supabase(`/auth/v1/admin/users/${encodeURIComponent(memberId)}`, { service: true });
      const email = clean(account.user?.email || account.email).toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { error: 'This member has no valid email address.' });
      await supabase('/auth/v1/recover', { method: 'POST', service: true, body: { email, redirect_to: `${process.env.APP_URL}/` } });
      return json(res, 200, { ok: true });
    }
    if (action === 'set-role') {
      if (actor.profile.role !== 'owner') return json(res, 403, { error: 'Only the owner can change admin roles.' });
      const role = clean(req.body.role), id = clean(req.body.id);
      if (!id || !['admin', 'member'].includes(role)) return json(res, 400, { error: 'Invalid role.' });
      await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', service: true, body: { role } });
      return json(res, 200, { ok: true });
    }
    if (action === 'save-exercise') {
      const x = req.body.exercise || {}, slug = clean(x.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-'), name = clean(x.name);
      if (!slug || !name || !clean(x.target_muscles) || !clean(x.scheme) || !clean(x.cue) || !safeAsset(x.image_path) || !clean(x.alt_text)) return json(res, 400, { error: 'Complete every exercise field and choose an approved Fitness 7 asset.' });
      const body = { slug, name, target_muscles: clean(x.target_muscles), scheme: clean(x.scheme), cue: clean(x.cue), image_path: x.image_path, alt_text: clean(x.alt_text), active: x.active !== false, metadata: x.metadata || {} };
      const existing = x.id ? [{ id: x.id }] : await supabase(`/rest/v1/exercise_library?slug=eq.${encodeURIComponent(slug)}&select=id`, { service: true });
      if (existing[0]) await supabase(`/rest/v1/exercise_library?id=eq.${existing[0].id}`, { method: 'PATCH', service: true, body });
      else await supabase('/rest/v1/exercise_library', { method: 'POST', service: true, body });
      return json(res, 200, { ok: true });
    }
    if (action === 'archive-exercise') {
      await supabase(`/rest/v1/exercise_library?id=eq.${encodeURIComponent(clean(req.body.id))}`, { method: 'PATCH', service: true, body: { active: !!req.body.active } });
      return json(res, 200, { ok: true });
    }
    if (action === 'save-plan') {
      const { member_id, day_index, focus, warmup = [], recovery = [], slots = [] } = req.body.plan || {};
      if (!member_id || !Number.isInteger(day_index) || day_index < 0 || day_index > 5 || !clean(focus) || !Array.isArray(slots) || !slots.length) return json(res, 400, { error: 'A member, training day, focus, and at least one exercise are required.' });
      const requestedIds = [...new Set(slots.flatMap(slot => [slot.exercise_id, slot.alternative_exercise_id].filter(Boolean)))];
      const activeExercises = await supabase(`/rest/v1/exercise_library?id=in.(${requestedIds.join(',')})&active=is.true&select=id`, { service: true });
      if (activeExercises.length !== requestedIds.length) return json(res, 400, { error: 'Plans can use active exercises only.' });
      const existing = await supabase(`/rest/v1/member_weekly_plans?member_id=eq.${encodeURIComponent(member_id)}&day_index=eq.${day_index}&select=id`, { service: true });
      const plan = existing[0]
        ? (await supabase(`/rest/v1/member_weekly_plans?id=eq.${existing[0].id}`, { method: 'PATCH', service: true, body: { focus: clean(focus), warmup, recovery } }))[0]
        : (await supabase('/rest/v1/member_weekly_plans', { method: 'POST', service: true, body: { member_id, day_index, focus: clean(focus), warmup, recovery } }))[0];
      await supabase(`/rest/v1/member_plan_slots?plan_id=eq.${plan.id}`, { method: 'DELETE', service: true });
      await supabase('/rest/v1/member_plan_slots', { method: 'POST', service: true, body: slots.map((slot, position) => ({ plan_id: plan.id, position, exercise_id: slot.exercise_id, alternative_exercise_id: slot.alternative_exercise_id || null })) });
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { error: 'Unsupported admin action.' });
  } catch (error) {
    const safe = error.message === 'Admin access is required.' || error.message === 'Sign in is required.' ? error.message : 'The request could not be completed.';
    return json(res, safe.includes('required') ? 403 : 500, { error: safe });
  }
};
