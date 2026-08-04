export const MEMBER_USERNAME = 'sagar.paperwala003.member';
export const COACH_USERNAME = 'sagar.paperwala003.admin';
export const DEMO_PASSWORD = '1234';

const clone = value => JSON.parse(JSON.stringify(value));
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const dataKey = role => `gym-companion-v3-demo-${role}-data`;
const sessionKey = role => `gym-companion-v3-demo-${role}-session`;

export function isDemoCredential(role, username, password) {
  const expected = role === 'admin' ? COACH_USERNAME : MEMBER_USERNAME;
  return String(username || '').trim().toLowerCase() === expected && password === DEMO_PASSWORD;
}

export function restoreDemoSession(role) {
  return localStorage.getItem(sessionKey(role)) === 'remembered' || sessionStorage.getItem(sessionKey(role)) === 'temporary';
}

export function saveDemoSession(role, remember) {
  clearDemoSession(role);
  (remember ? localStorage : sessionStorage).setItem(sessionKey(role), remember ? 'remembered' : 'temporary');
}

export function clearDemoSession(role) {
  localStorage.removeItem(sessionKey(role));
  sessionStorage.removeItem(sessionKey(role));
}

function exerciseFrom(option, focus) {
  const name = option.name;
  return {
    id: `demo-exercise-${slug(name)}`,
    name,
    target_muscles: focus,
    scheme: option.scheme || '3 × 8–12 · 75 sec',
    cue: option.cue || 'Use a controlled range of motion and stop with 1–2 good reps in reserve.',
    image_path: option.image,
    alt_text: option.alt || `Fitness 7 illustration: ${name}`,
    active: true
  };
}

function planFromDay(day, dayIndex, memberId) {
  return {
    id: `demo-plan-${memberId}-${dayIndex}`,
    member_id: memberId,
    day_index: dayIndex,
    focus: day.focus,
    warmup: day.warmup?.steps || [],
    recovery: day.finish?.steps || [],
    member_plan_slots: (day.slots || []).map((slot, position) => ({
      id: `demo-slot-${memberId}-${dayIndex}-${position}`,
      position,
      exercise_id: exerciseFrom(slot.primary, day.focus).id,
      alternative_exercise_id: slot.alternative ? exerciseFrom(slot.alternative, day.focus).id : null,
      exercise: exerciseFrom(slot.primary, day.focus),
      alternative: slot.alternative ? exerciseFrom(slot.alternative, day.focus) : null
    }))
  };
}

export function demoMemberSeed(routine) {
  const memberId = 'demo-member-sagar';
  return {
    profile: { id: memberId, full_name: 'Sagar Paperwala', role: 'member', active: true },
    membership: { member_id: memberId, status: 'active', starts_on: '2026-08-01', ends_on: '2026-11-01', notes: 'Sample Fitness 7 membership.' },
    plans: routine.map((day, index) => planFromDay(day, index, memberId)),
    sessions: []
  };
}

export function readDemoMember(routine) {
  try {
    const saved = JSON.parse(localStorage.getItem(dataKey('member')) || 'null');
    if (saved?.profile && Array.isArray(saved.plans)) return saved;
  } catch (_) { /* start a fresh sample */ }
  const seed = demoMemberSeed(routine);
  writeDemoMember(seed);
  return seed;
}

export function writeDemoMember(data) {
  localStorage.setItem(dataKey('member'), JSON.stringify(data));
}

export function demoCoachSeed(routine) {
  const member = demoMemberSeed(routine);
  const exerciseMap = new Map();
  member.plans.forEach(plan => plan.member_plan_slots.forEach(slot => {
    [slot.exercise, slot.alternative].filter(Boolean).forEach(exercise => exerciseMap.set(exercise.id, exercise));
  }));
  return {
    profile: { id: 'demo-coach-sagar', full_name: 'Sagar Paperwala', role: 'admin', active: true },
    members: [{ ...member.profile, created_at: '2026-08-01T00:00:00Z', memberships: [member.membership] }],
    exercises: [...exerciseMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    plans: member.plans.map(plan => ({
      ...plan,
      member_plan_slots: plan.member_plan_slots.map(({ exercise, alternative, ...slot }) => slot)
    }))
  };
}

export function readDemoCoach(routine) {
  try {
    const saved = JSON.parse(localStorage.getItem(dataKey('admin')) || 'null');
    if (saved?.profile && Array.isArray(saved.members) && Array.isArray(saved.exercises)) return saved;
  } catch (_) { /* start a fresh sample */ }
  const seed = demoCoachSeed(routine);
  writeDemoCoach(seed);
  return seed;
}

export function writeDemoCoach(data) {
  localStorage.setItem(dataKey('admin'), JSON.stringify(data));
}

export const demoAccountMessage = 'That account is unavailable here. Use the demo account for this app or sign in with your real email.';
