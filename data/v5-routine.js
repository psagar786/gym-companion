/* Fitness 7 V5 — verified-equipment PPL source. This is the runtime source of truth for V5. */
(() => {
  const asset = name => `assets/exercises/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.png`;
  const option = name => ({ name, image: asset(name) });
  const slot = (primary, alternative, scheme, cue, third) => ({ primary: option(primary), alternative: option(alternative), third: third ? option(third) : null, scheme, cue, role: 'core' });
  const step = (title, duration, cue, imageName = title) => ({ title, duration, cue, image: asset(imageName), alt: `Fitness 7 illustration: ${title}`, recommended: true });
  const choose = (title, duration, cue, choices) => ({ ...step(title, duration, cue, choices[0]), choices: choices.map(name => ({ ...option(name), alt: `Fitness 7 illustration: ${name}` })) });
  const guided = (total, steps) => ({ total, steps });

  const pullWarmup = guided('6–8 min', [
    step('Shoulder circles', '10 each way', 'Make slow circles; keep your neck relaxed.'),
    step('Thoracic rotations', '6/side', 'Rotate through your upper back, not your lower back.'),
    step('Prone Y raise', '8 reps', 'Lift gently from the lower traps without shrugging.'),
    step('Pull-up pattern rehearsal', '6 slow reps', 'Reach tall, then drive elbows toward your ribs.')
  ]);
  const pushWarmup = guided('6–8 min', [
    step('Shoulder circles', '10 each way', 'Build range gradually with relaxed shoulders.'),
    step('Wall slides', '8 reps', 'Keep ribs down as arms glide upward.'),
    step('Scapular push-up', '8 reps', 'Keep elbows straight and move shoulder blades only.'),
    step('Chest opener', '6 slow reps', 'Open the chest gently; do not force the shoulder range.')
  ]);
  const legWarmup = guided('6–8 min', [
    step('Ankle rocks', '10/side', 'Keep the heel down as the knee tracks forward.'),
    step('Bodyweight squat', '10 reps', 'Use a smooth, comfortable depth.'),
    step('Hip hinge drill', '10 reps', 'Push hips back with a long neutral spine.'),
    step('Reverse-lunge pattern', '6/side', 'Step back softly and stay tall.', 'Reverse lunge')
  ]);
  const upperFinish = guided('18–22 min', [
    choose('Zone 2 cardio', '15–20 min', 'Stay at a conversational pace.', ['Incline treadmill walk', 'Exercise bike']),
    step('Doorway pec stretch', '30 sec/side', 'Use a gentle, pain-free stretch.'),
    step('Lat stretch', '30 sec/side', 'Reach long without shrugging.')
  ]);
  const legFinish = guided('8–10 min', [
    step('Easy cooldown walk', '3–5 min', 'Walk easily; no LISS cardio after leg training.', 'Incline treadmill walk'),
    step('Quad stretch', '30 sec/side', 'Keep knees close together.'),
    step('Hamstring stretch', '30 sec/side', 'Hinge from the hips; do not round aggressively.'),
    step('Calf stretch', '30 sec/side', 'Keep the back heel grounded.'),
    step('Hip mobility', '60 sec', 'Move slowly through a comfortable range.')
  ]);

  window.GYM_COMPANION_V5_ROUTINE = [
    { day: 'Monday', focus: 'Pull A · Back + Biceps', time: '75–90 min', targetGroups: ['back','biceps'], warmup: pullWarmup, finish: upperFinish, slots: [
      slot('Pull-up', 'Band-assisted pull-up', '3 × 8–10 · 120s', 'Use a full controlled range; keep ribs down.'),
      slot('Chest-supported row', 'Machine row', '3 × 8–10 · 120s', 'Keep chest connected to the support; pull elbows back.'),
      slot('Seated cable row', 'Barbell row', '3 × 10–12 · 90s', 'Keep torso still and squeeze through the mid-back.'),
      slot('Cable rear-delt fly', 'Incline dumbbell reverse fly', '3 × 12–15 · 60s', 'Lead with elbows and avoid shrugging.'),
      slot('Incline dumbbell curl', 'Cable curl', '3 × 10–12 · 75s', 'Keep elbows back and lower under control.'),
      slot('Hammer curl', 'Rope hammer curl', '3 × 10–12 · 75s', 'Keep wrists neutral and shoulders relaxed.')
    ], optional: ['Single-arm cable pulldown', 'Straight-arm pulldown', 'T-bar row', 'Preacher curl', 'Cable pullover'] },
    { day: 'Tuesday', focus: 'Push A · Chest + Shoulders + Triceps', time: '75–90 min', targetGroups: ['chest','shoulders','triceps'], warmup: pushWarmup, finish: upperFinish, slots: [
      slot('Incline dumbbell press', 'Incline machine press', '3 × 8–10 · 120s', 'Set shoulder blades and use a controlled 30-degree press.'),
      slot('Flat barbell press', 'Flat dumbbell press', '3 × 8–10 · 120s', 'Control the descent and keep upper-back tension.'),
      slot('Cable fly', 'Dumbbell fly', '3 × 10–12 · 75s', 'Use a pain-free arc and keep ribs down.'),
      slot('Seated dumbbell shoulder press', 'Seated shoulder press', '3 × 8–10 · 90s', 'Stay tall; do not lean ribs back.'),
      slot('Rope pressdown', 'Close-grip press', '3 × 10–12 · 75s', 'Keep upper arms still and finish the extension.'),
      slot('Overhead cable extension', 'Single-dumbbell extension', '3 × 10–12 · 75s', 'Keep elbows forward and ribs stacked.')
    ], optional: ['Push-up', 'Cable lateral raise', 'Dumbbell lateral raise', 'Close-grip press', 'Dumbbell fly'] },
    { day: 'Wednesday', focus: 'Legs A · Quads + Hamstrings + Calves', time: '75–90 min', targetGroups: ['legs'], warmup: legWarmup, finish: legFinish, slots: [
      slot('Back squat', 'Leg press', '3 × 6–8 · 150s', 'Brace first; use a controlled, comfortable depth.'),
      slot('Romanian deadlift', 'Dumbbell RDL', '3 × 8–10 · 120s', 'Push hips back and keep the weight close.'),
      slot('Bulgarian split squat', 'Walking lunge', '3 × 8–10/leg · 90s', 'Stay tall and control the bottom.'),
      slot('Leg extension', 'Hip-abductor machine', '3 × 12–15 · 75s', 'Pause briefly at the contracted position.'),
      slot('Lying leg curl', 'Seated leg curl', '3 × 10–12 · 75s', 'Keep hips pinned and control the lowering.'),
      slot('Standing calf raise', 'Seated calf raise', '4 × 12–15 · 60s', 'Use a full stretch and a controlled pause.')
    ], optional: ['Hip-abductor machine', 'Walking lunge', 'Glute bridge', 'Dumbbell RDL', 'Seated calf raise'] },
    { day: 'Thursday', focus: 'Pull B · Lats + Rear Delts + Biceps', time: '75–90 min', targetGroups: ['back','biceps'], warmup: pullWarmup, finish: upperFinish, slots: [
      slot('Neutral-grip pulldown', 'Lat pulldown', '3 × 8–10 · 120s', 'Drive elbows down while keeping the chest tall.'),
      slot('T-bar row', 'Barbell row', '3 × 8–10 · 120s', 'Brace hard and pull the elbows behind you.'),
      slot('Seated cable row', 'Machine row', '3 × 10–12 · 90s', 'Reach under control, then pull through the mid-back.'),
      slot('Cable rear-delt fly', 'Incline dumbbell reverse fly', '3 × 12–15 · 60s', 'Keep constant tension on the rear delts.'),
      slot('Preacher curl', 'Alternating dumbbell curl', '3 × 10–12 · 75s', 'Lower slowly without lifting the elbows.'),
      slot('Cable curl', 'Hammer curl', '3 × 10–12 · 75s', 'Keep elbows pinned at your sides.')
    ], optional: ['Cable pullover', 'Straight-arm pulldown', 'Chest-supported row', 'Rope hammer curl', 'Incline dumbbell curl'] },
    { day: 'Friday', focus: 'Push B · Chest + Delts + Triceps', time: '75–90 min', targetGroups: ['chest','shoulders','triceps'], warmup: pushWarmup, finish: upperFinish, slots: [
      slot('Incline machine press', 'Incline dumbbell press', '3 × 8–10 · 120s', 'Control the descent and keep shoulder blades stable.'),
      slot('Cable fly', 'Dumbbell fly', '3 × 10–12 · 75s', 'Squeeze the chest without forcing range.'),
      slot('Cable lateral raise', 'Dumbbell lateral raise', '3 × 12–15 · 60s', 'Lead with elbows; keep tension from the bottom.'),
      slot('Dumbbell lateral raise', 'Cable lateral raise', '3 × 12–15 · 60s', 'Use a slight forward lean and avoid shrugging.'),
      slot('Close-grip press', 'Rope pressdown', '3 × 8–10 · 90s', 'Use a comfortable elbow path and stable wrists.'),
      slot('Single-dumbbell extension', 'Overhead cable extension', '3 × 10–12 · 75s', 'Keep ribs stacked and elbows pointed forward.')
    ], optional: ['Push-up', 'Rope pressdown', 'Overhead cable extension', 'Seated dumbbell shoulder press', 'Dumbbell fly'] },
    { day: 'Saturday', focus: 'Legs B + Core · Glutes + Hamstrings + Abs', time: '75–90 min', targetGroups: ['legs','core'], warmup: legWarmup, finish: legFinish, slots: [
      slot('Leg press', 'Back squat', '3 × 8–10 · 120s', 'Use controlled depth without hips lifting.'),
      slot('Glute bridge', 'Hip-abductor machine', '3 × 10–12 · 90s', 'Pause at the top without arching the lower back.'),
      slot('Seated leg curl', 'Lying leg curl', '3 × 10–12 · 75s', 'Keep hips pinned and lower slowly.'),
      slot('Hanging knee raise', 'Reverse crunch', '3 × 12–15 · 60s', 'Avoid swinging; curl the pelvis upward.'),
      slot('Pallof press', 'Side plank', '3 × 10–12/side · 60s', 'Brace and resist rotation.'),
      slot('Plank', 'Dead bug', '3 × 30–45 sec · 60s', 'Breathe steadily while keeping ribs down.')
    ], optional: ['Walking lunge', 'Dumbbell RDL', 'Cable crunch', 'Reverse crunch', 'Standing calf raise'] }
  ];
})();
