/* V53-02: additive, serializable three-week PPL data. It does not activate or
   replace an existing member plan. Renderers must resolve the saved snapshot
   before using this source for a future session. */
(() => {
  'use strict';
  const VERSION = 'threeweek-ppl-v1';
  const clone = value => JSON.parse(JSON.stringify(value));
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const list = value => Array.isArray(value) ? value : value ? [value] : [];
  const catalog = window.GYM_COMPANION_TRAINING?.catalog || [];
  const guides = window.GYM_COMPANION_V5_EXERCISE_GUIDES || {};
  const v5 = window.GYM_COMPANION_V5_ROUTINE || [];
  const excludedEquipment = [
    'Resistance bands', 'Captain’s chair / parallel knee-raise bars', 'Trap bar',
    'Hack squat machine', 'Swiss ball', 'Seated leg curl machine',
    'Cable ankle cuffs for hip abduction', 'Cable cuffs for rear-delt fly',
    'Pec deck / reverse pec deck', 'Dip machine', 'Flat machine chest press',
    'Barbell hip thrust station', 'Ab wheel'
  ];
  const excludedNames = /band(?:ed|s|-assisted)?\b|captain|trap[- ]bar|hack squat|swiss ball|seated leg curl|cable (?:standing )?hip abduction|cuffed cable|pec[- ]deck|pec deck|dip machine|machine chest press|barbell hip thrust|ab wheel/i;
  const tiers = {
    beginner: { label: 'Beginner', sets: 2, compoundSets: 3, reps: '12–15', rir: '3', compoundRestSeconds: 90, accessoryRestSeconds: 60, tempo: '2 sec lower · smooth lift', maxExtras: 1 },
    intermediate: { label: 'Intermediate', sets: 3, compoundSets: 3, reps: '10–15', rir: '2', compoundRestSeconds: 120, accessoryRestSeconds: 75, tempo: '2 sec lower · smooth lift', maxExtras: 2 },
    expert: { label: 'Expert', sets: 3, compoundSets: 4, reps: '10–15', rir: '1–2', compoundRestSeconds: 150, accessoryRestSeconds: 90, tempo: '2–3 sec lower · smooth lift', maxExtras: 2 }
  };
  function tierPrescriptions(kind = 'accessory', perSide = false) {
    return Object.fromEntries(Object.entries(tiers).map(([key, value]) => [key, {
      sets: kind === 'compound' ? value.compoundSets : value.sets,
      reps: kind === 'hold' ? null : value.reps,
      durationSeconds: kind === 'hold' ? 30 : null,
      perSide,
      restSeconds: kind === 'compound' ? value.compoundRestSeconds : value.accessoryRestSeconds,
      rest: `${kind === 'compound' ? value.compoundRestSeconds : value.accessoryRestSeconds} sec`,
      rir: kind === 'hold' ? null : value.rir,
      tempo: kind === 'hold' ? 'Steady hold with normal breathing' : value.tempo,
      progression: kind === 'hold'
        ? 'Keep the hold comfortable for every set before choosing a slightly harder position; do not add time and difficulty together.'
        : 'When every set reaches the top of the rep range with the listed reps in reserve on two matching sessions, use the smallest available load increase and return to the lower end.',
      intensity: 'End every prescribed set with the planned reps in reserve; do not use forced repetitions.',
      intensityNotes: 'End every prescribed set with the planned reps in reserve; do not use forced repetitions.'
    }]));
  }

  // These are exact identities. Equipment and target groups never come from a
  // day-title regex, and similarly named catalog variants do not inherit art.
  const specifications = [
    ['Pull-up', ['back','biceps'], 'Pull-up bar', 'vertical pull', 'compound'],
    ['Lat pulldown', ['back','biceps'], 'Lat-pulldown station', 'vertical pull', 'compound'],
    ['Neutral-grip pulldown', ['back','biceps'], 'Lat-pulldown station with neutral handle', 'vertical pull', 'compound'],
    ['Single-arm cable pulldown', ['back','biceps'], 'High cable with hand handle', 'vertical pull', 'compound', true],
    ['Underhand lat pulldown', ['back','biceps'], 'Lat-pulldown station with straight bar', 'vertical pull', 'compound'],
    ['Chest-supported row', ['back','biceps'], 'Incline bench and dumbbells', 'horizontal pull', 'compound'],
    ['Chest-supported dumbbell row', ['back','biceps'], 'Incline bench and dumbbells', 'horizontal pull', 'compound'],
    ['Machine row', ['back','biceps'], 'Row machine', 'horizontal pull', 'compound'],
    ['Seated cable row', ['back','biceps'], 'Seated cable row station', 'horizontal pull', 'compound'],
    ['Barbell row', ['back','biceps'], 'Barbell', 'horizontal pull', 'compound'],
    ['T-bar row', ['back','biceps'], 'T-bar row station', 'horizontal pull', 'compound'],
    ['One-arm dumbbell row', ['back','biceps'], 'Bench and dumbbell', 'horizontal pull', 'compound', true],
    ['Straight-arm pulldown', ['back'], 'High cable and straight bar', 'shoulder extension'],
    ['Cable pullover', ['back'], 'High cable and rope', 'shoulder extension'],
    ['Cable rear-delt fly', ['back','shoulders'], 'Cable hand handles; no cuffs', 'rear-delt fly'],
    ['Incline dumbbell reverse fly', ['back','shoulders'], 'Incline bench and dumbbells', 'rear-delt fly'],
    ['Rear-delt cable row', ['back','shoulders'], 'Cable rope or hand handles', 'horizontal pull'],
    ['Incline dumbbell curl', ['biceps'], 'Incline bench and dumbbells', 'elbow flexion'],
    ['Cable curl', ['biceps'], 'Low cable and straight bar', 'elbow flexion'],
    ['Preacher curl', ['biceps'], 'Preacher bench and dumbbell', 'elbow flexion'],
    ['Hammer curl', ['biceps'], 'Dumbbells', 'neutral-grip elbow flexion'],
    ['Rope hammer curl', ['biceps'], 'Low cable and rope', 'neutral-grip elbow flexion'],
    ['Cross-body hammer curl', ['biceps'], 'Dumbbells', 'neutral-grip elbow flexion', 'accessory', true],
    ['Alternating dumbbell curl', ['biceps'], 'Dumbbells', 'elbow flexion', 'accessory', true],
    ['Barbell curl', ['biceps'], 'Barbell', 'elbow flexion'],
    ['Cable reverse curl', ['biceps'], 'Low cable and straight bar', 'pronated elbow flexion'],
    ['Incline dumbbell press', ['chest','triceps'], '30-degree incline bench and dumbbells', 'incline press', 'compound'],
    ['Paused incline dumbbell press', ['chest','triceps'], '30-degree incline bench and dumbbells', 'incline press', 'compound'],
    ['Incline machine press', ['chest','triceps'], 'Confirmed incline chest-press machine', 'incline press', 'compound'],
    ['Flat dumbbell press', ['chest','triceps'], 'Flat bench and dumbbells', 'horizontal press', 'compound'],
    ['Flat barbell press', ['chest','triceps'], 'Bench rack with safeties and barbell', 'horizontal press', 'compound'],
    ['Push-up', ['chest','triceps'], 'Floor', 'horizontal press', 'compound'],
    ['Cable fly', ['chest'], 'Dual cable hand handles', 'chest fly'],
    ['Dumbbell fly', ['chest'], 'Flat bench and dumbbells', 'chest fly'],
    ['High-to-low cable fly', ['chest'], 'Dual high cable hand handles', 'chest fly'],
    ['Seated dumbbell shoulder press', ['shoulders','triceps'], 'Back-supported bench and dumbbells', 'vertical press', 'compound'],
    ['Standing dumbbell shoulder press', ['shoulders','triceps'], 'Dumbbells', 'vertical press', 'compound'],
    ['Neutral-grip seated dumbbell press', ['shoulders','triceps'], 'Back-supported bench and dumbbells', 'vertical press', 'compound'],
    ['Dumbbell lateral raise', ['shoulders'], 'Dumbbells', 'shoulder abduction'],
    ['Cable lateral raise', ['shoulders'], 'Low cable hand handle; no cuff', 'shoulder abduction'],
    ['Single-arm cable lateral raise', ['shoulders'], 'Low cable hand handle; no cuff', 'shoulder abduction', 'accessory', true],
    ['Rope pressdown', ['triceps'], 'High cable and rope', 'elbow extension'],
    ['Single-arm rope pressdown', ['triceps'], 'High cable and rope', 'elbow extension', 'accessory', true],
    ['Reverse-grip cable pressdown', ['triceps'], 'High cable and straight bar', 'elbow extension'],
    ['Close-grip press', ['chest','triceps'], 'Bench rack with safeties and barbell', 'horizontal press', 'compound'],
    ['Overhead cable extension', ['triceps'], 'Cable and rope', 'overhead elbow extension'],
    ['Single-dumbbell extension', ['triceps'], 'Bench and one dumbbell', 'overhead elbow extension'],
    ['Bench-supported triceps extension', ['triceps'], 'Bench and dumbbell', 'elbow extension'],
    ['Leg press', ['legs'], 'Leg press machine', 'squat', 'compound'],
    ['Goblet squat', ['legs'], 'Dumbbell', 'squat', 'compound'],
    ['Back squat', ['legs'], 'Squat rack with safeties and barbell', 'squat', 'compound'],
    ['Bodyweight squat', ['legs'], 'Bodyweight', 'squat', 'compound'],
    ['Dumbbell RDL', ['legs'], 'Dumbbells', 'hip hinge', 'compound'],
    ['Romanian deadlift', ['legs'], 'Barbell', 'hip hinge', 'compound'],
    ['Single-leg RDL', ['legs'], 'Dumbbell and optional fixed hand support', 'hip hinge', 'compound', true],
    ['Walking lunge', ['legs'], 'Dumbbells or bodyweight', 'unilateral squat', 'compound', true],
    ['Reverse lunge', ['legs'], 'Dumbbells or bodyweight', 'unilateral squat', 'compound', true],
    ['Bulgarian split squat', ['legs'], 'Bench and dumbbells', 'unilateral squat', 'compound', true],
    ['Leg extension', ['legs'], 'Leg extension machine', 'knee extension'],
    ['Single-leg leg extension', ['legs'], 'Leg extension machine', 'knee extension', 'accessory', true],
    ['Lying leg curl', ['legs'], 'Lying leg curl machine', 'knee flexion'],
    ['Single-leg lying leg curl', ['legs'], 'Lying leg curl machine', 'knee flexion', 'accessory', true],
    ['Hamstring walkout', ['legs'], 'Floor', 'knee flexion and hip extension'],
    ['Standing calf raise', ['legs'], 'Calf raise machine', 'plantar flexion'],
    ['Seated calf raise', ['legs'], 'Seated calf raise machine', 'plantar flexion'],
    ['Single-leg calf raise', ['legs'], 'Fixed hand support and bodyweight', 'plantar flexion', 'accessory', true],
    ['Hip-abductor machine', ['legs'], 'Hip-abductor machine', 'hip abduction'],
    ['Glute bridge', ['legs'], 'Floor; optional dumbbell across padded hips', 'hip extension'],
    ['Cable pull-through', ['legs'], 'Low cable and rope', 'hip hinge', 'compound'],
    ['Hanging knee raise', ['core'], 'Pull-up bar', 'pelvic curl'],
    ['Reverse crunch', ['core'], 'Floor', 'pelvic curl'],
    ['Cable crunch', ['core'], 'High cable and rope', 'trunk flexion'],
    ['Pallof press', ['core'], 'Cable hand handle', 'anti-rotation', 'accessory', true],
    ['Side plank', ['core'], 'Floor', 'anti-lateral flexion', 'hold', true],
    ['Dead bug', ['core'], 'Floor', 'anti-extension', 'accessory', true],
    ['Pull-up pattern rehearsal', ['back','mobility'], 'Bodyweight', 'scapular pull'],
    ['Scapular push-up', ['chest','shoulders','mobility'], 'Floor', 'scapular glide'],
    ['Thoracic rotations', ['back','mobility'], 'Bodyweight', 'thoracic rotation', 'accessory', true],
    ['Wall slides', ['shoulders','mobility'], 'Wall', 'scapular upward rotation'],
    ['Hip hinge drill', ['legs','mobility'], 'Bodyweight', 'hip hinge'],
    ['Incline treadmill walk', ['cardio'], 'Treadmill', 'steady cardio'],
    ['Easy cooldown walk', ['recovery'], 'Treadmill set flat or gym floor', 'easy walking']
  ];
  const registry = {};
  const sourceOptions = v5.flatMap(day => day.slots.flatMap(slot => [slot.primary, slot.alternative, slot.third].filter(Boolean)));
  for (const [name, targetGroups, equipment, movementPattern, kind = 'accessory', perSide = false, equipmentStatus = 'confirmed'] of specifications) {
    if (excludedNames.test(name)) throw new Error(`V5.3 contains excluded movement: ${name}`);
    const source = catalog.find(item => item.name === name) || sourceOptions.find(item => item.name === name) || {};
    const guide = guides[name] || {};
    const ownBase = source.image_path || source.image || null;
    const baseIsExact = ownBase && ownBase.split('/').pop() === `${slug(name)}.png`;
    const explicit = guide.imageSet || null;
    // A variant copied from a catalog parent must not claim the parent's image.
    const sourceImageSet = explicit ? { start: explicit.setup, move: explicit.move } : baseIsExact ? {
      start: ownBase.replace(/\.png$/, '-phase-setup.png'), move: ownBase.replace(/\.png$/, '-phase-move.png')
    } : { start: null, move: null };
    const imageSet = {
      start: `assets/exercises/threeweek/${slug(name)}-start.webp`,
      move: `assets/exercises/threeweek/${slug(name)}-movement.webp`
    };
    const prescriptions = tierPrescriptions(kind, perSide);
    registry[slug(name)] = {
      id: `v53-${slug(name)}`, stableMovementId: slug(name), name, targetGroups, equipment,
      equipmentStatus, selectable: equipmentStatus === 'confirmed', movementPattern, kind,
      primaryTargets: list(guide.primaryTargets || source.target_muscles || targetGroups[0]), secondaryTargets: list(guide.secondaryTargets),
      cardDescription: `${name} is the ${movementPattern} selection for this slot. Match the setup to the listed equipment before loading it.`,
      cue: guide.formCue || source.cue || '', formCue: guide.formCue || source.cue || '', why: guide.why || '', whyItMatters: guide.why || '', commonMistake: guide.commonMistake || '', safetyCue: guide.safetyCue || '',
      progression: prescriptions.intermediate.progression,
      tendonNote: `Use gradual loading and a controlled ${movementPattern}; this workout entry is not treatment for tendon pain.`,
      phaseBriefs: {
        start: { instruction: guide.setupInstruction || '', alt: `Starting position for ${name} using ${equipment.toLowerCase()}.` },
        move: { instruction: guide.executionInstruction || '', alt: `Working position for ${name} showing the ${movementPattern} path.` }
      },
      tierPrescriptions: prescriptions, prescriptions, imageSet, image: imageSet.move,
      alt: `Fitness 7: ${name}; ${movementPattern} using ${equipment.toLowerCase()}.`,
      artworkStatus: 'requires-v53-review', contentStatus: guide.why && guide.commonMistake && guide.safetyCue ? 'inherited-exact-guide' : 'requires-authored-review',
      visualReviewStatus: 'pending', coachReviewStatus: 'pending',
      source: { version: 'v5.2', name, exactCatalogRecord: Boolean(source.name), guideRecord: Boolean(guides[name]), legacyImageSet: sourceImageSet }
    };
  }
  const movement = name => {
    const value = registry[slug(name)];
    if (!value) throw new Error(`Missing V5.3 movement specification: ${name}`);
    return clone(value);
  };
  const slot = (dayIndex, position, names) => ({
    id: `threeweek-${dayIndex}-${position}`, position, role: 'core',
    primary: movement(names[0]), alternative: movement(names[1]), third: movement(names[2])
  });
  const matrix = [
    { focus: 'Pull A', targetGroups: ['back','biceps','shoulders'], choices: [
      ['Pull-up','Lat pulldown','Neutral-grip pulldown'],
      ['Chest-supported row','Machine row','Seated cable row'],
      ['Straight-arm pulldown','Cable pullover','Single-arm cable pulldown'],
      ['Incline dumbbell reverse fly','Rear-delt cable row','Cable rear-delt fly'],
      ['Incline dumbbell curl','Cable curl','Preacher curl'],
      ['Hammer curl','Rope hammer curl','Cross-body hammer curl']
    ], optional: ['T-bar row','Alternating dumbbell curl'] },
    { focus: 'Push A', targetGroups: ['chest','shoulders','triceps'], choices: [
      ['Incline dumbbell press','Incline machine press','Paused incline dumbbell press'],
      ['Flat dumbbell press','Flat barbell press','Push-up'],
      ['Cable fly','Dumbbell fly','High-to-low cable fly'],
      ['Seated dumbbell shoulder press','Standing dumbbell shoulder press','Neutral-grip seated dumbbell press'],
      ['Rope pressdown','Single-arm rope pressdown','Reverse-grip cable pressdown'],
      ['Overhead cable extension','Single-dumbbell extension','Bench-supported triceps extension']
    ], optional: ['Dumbbell lateral raise','Close-grip press'] },
    { focus: 'Legs A', targetGroups: ['legs'], choices: [
      ['Leg press','Goblet squat','Back squat'],
      ['Dumbbell RDL','Romanian deadlift','Single-leg RDL'],
      ['Walking lunge','Reverse lunge','Bulgarian split squat'],
      ['Leg extension','Single-leg leg extension','Bodyweight squat'],
      ['Lying leg curl','Hamstring walkout','Single-leg lying leg curl'],
      ['Standing calf raise','Seated calf raise','Single-leg calf raise']
    ], optional: ['Hip-abductor machine','Glute bridge'] },
    { focus: 'Pull B', targetGroups: ['back','biceps','shoulders'], choices: [
      ['Neutral-grip pulldown','Underhand lat pulldown','Single-arm cable pulldown'],
      ['T-bar row','Barbell row','Chest-supported dumbbell row'],
      ['Seated cable row','One-arm dumbbell row','Machine row'],
      ['Incline dumbbell reverse fly','Cable rear-delt fly','Rear-delt cable row'],
      ['Preacher curl','Alternating dumbbell curl','Barbell curl'],
      ['Cable reverse curl','Cross-body hammer curl','Rope hammer curl']
    ], optional: ['Straight-arm pulldown','Hammer curl'] },
    { focus: 'Push B', targetGroups: ['chest','shoulders','triceps'], choices: [
      ['Flat barbell press','Flat dumbbell press','Push-up'],
      ['Incline dumbbell press','Incline machine press','Paused incline dumbbell press'],
      ['Dumbbell lateral raise','Cable lateral raise','Single-arm cable lateral raise'],
      ['High-to-low cable fly','Dumbbell fly','Cable fly'],
      ['Close-grip press','Rope pressdown','Single-arm rope pressdown'],
      ['Overhead cable extension','Single-dumbbell extension','Bench-supported triceps extension']
    ], optional: ['Seated dumbbell shoulder press','Dumbbell lateral raise'] },
    { focus: 'Legs B + Core', targetGroups: ['legs','core'], choices: [
      ['Glute bridge','Cable pull-through','Dumbbell RDL'],
      ['Reverse lunge','Walking lunge','Leg press'],
      ['Lying leg curl','Hamstring walkout','Single-leg lying leg curl'],
      ['Standing calf raise','Seated calf raise','Single-leg calf raise'],
      ['Hanging knee raise','Reverse crunch','Cable crunch'],
      ['Pallof press','Side plank','Dead bug']
    ], optional: ['Hip-abductor machine','Cable crunch'] }
  ];
  const tendonDefinitions = [
    ['Wrist extensor isometric','Wrist extensors and their tendon attachments','Opposite hand','Rest the forearm palm-down; press the back of the hand gently into the other palm without moving the wrist.'],
    ['Wrist flexor isometric','Wrist flexors and their tendon attachments','Opposite hand','Rest the forearm palm-up; gently press the palm into the other hand without bending the wrist.'],
    ['Supported calf-raise hold','Calf muscles and Achilles tendon','Wall or stable rail','Rise onto both forefeet on level ground; hold a comfortable height while using hand support.'],
    ['Wrist extensor isometric','Wrist extensors and their tendon attachments','Opposite hand','Rest the forearm palm-down; press the back of the hand gently into the other palm without moving the wrist.'],
    ['Wrist flexor isometric','Wrist flexors and their tendon attachments','Opposite hand','Rest the forearm palm-up; gently press the palm into the other hand without bending the wrist.'],
    ['Shallow wall-sit hold','Quadriceps and patellar tendon','Wall','Keep the back against a wall and feet forward; bend the knees only to a comfortable shallow angle and hold.']
  ];
  const dayTemplates = matrix.map((day, dayIndex) => ({
    id: `threeweek-day-${dayIndex}`, dayIndex,
    dayName: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayIndex],
    focus: day.focus, targetGroups: day.targetGroups, sessionTargetMinutes: [90,110],
    warmup: [{ ...movement(['Pull-up pattern rehearsal','Scapular push-up','Bodyweight squat','Thoracic rotations','Wall slides','Hip hinge drill'][dayIndex]), role: 'warmup' }],
    recovery: [{ ...movement(dayIndex === 2 || dayIndex === 5 ? 'Easy cooldown walk' : 'Incline treadmill walk'), role: 'recovery' }],
    cardioPolicy: dayIndex === 2 || dayIndex === 5 ? 'easy-cooldown-only' : 'optional-zone-2-15-to-20-minutes',
    coreSlots: day.choices.map((names, position) => slot(dayIndex, position, names)),
    optionalSlots: day.optional.map(name => ({ ...movement(name), role: 'optional', isOptional: true })),
    tendon: [{
      id: `threeweek-tendon-${dayIndex}`, stableMovementId: slug(tendonDefinitions[dayIndex][0]),
      name: tendonDefinitions[dayIndex][0], title: tendonDefinitions[dayIndex][0], role: 'tendon', isOptional: true,
      targetMuscles: tendonDefinitions[dayIndex][1], equipment: tendonDefinitions[dayIndex][2], equipmentStatus: 'confirmed',
      sets: 3, durationSeconds: 30, restSeconds: 45, duration: '30 sec × 3 sets',
      cue: tendonDefinitions[dayIndex][3],
      intensity: 'Gentle to moderate effort; finish without straining.',
      targetGroups: day.targetGroups, primaryTargets: [tendonDefinitions[dayIndex][1]], secondaryTargets: [],
      movementPattern: 'isometric hold', kind: 'hold',
      cardDescription: `${tendonDefinitions[dayIndex][0]} is an optional, low-load hold before the main workout.`,
      why: 'Provides a small, controlled loading practice for the muscles and tendon attachments used in the day’s session; this is not a tendon-treatment program.',
      whyItMatters: 'Provides a small, controlled loading practice before the main session; this is not a tendon-treatment program.',
      formCue: tendonDefinitions[dayIndex][3], commonMistake: 'Pressing as hard as possible or holding the breath turns a gentle preparation hold into unnecessary fatigue.',
      safetyCue: 'Breathe normally. Skip the hold if painful; stop for sharp pain, tingling, or numbness. Persistent tendon symptoms need individual assessment.',
      progression: 'First make all three holds calm and pain-free. Increase effort slightly only on a later session; never increase effort and duration together.',
      tendonNote: 'Optional preparation only. It does not diagnose, prevent, or treat tendinopathy.',
      phaseBriefs: {
        start: { instruction: `Set up ${tendonDefinitions[dayIndex][0].toLowerCase()} in a comfortable joint position before applying pressure.`, alt: `Fitness 7 start position for ${tendonDefinitions[dayIndex][0]}.` },
        move: { instruction: tendonDefinitions[dayIndex][3], alt: `Fitness 7 working hold for ${tendonDefinitions[dayIndex][0]}.` }
      },
      imageSet: {
        start: `assets/exercises/threeweek/${slug(tendonDefinitions[dayIndex][0])}-start.webp`,
        move: `assets/exercises/threeweek/${slug(tendonDefinitions[dayIndex][0])}-movement.webp`
      },
      alt: `Fitness 7 illustration for ${tendonDefinitions[dayIndex][0]}.`, artworkStatus: 'requires-v53-review', visualReviewStatus: 'pending', coachReviewStatus: 'pending',
      contributionToMainCompletion: false
    }]
  }));

  function localDayNumber(value) {
    const date = value instanceof Date ? value : new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) throw new TypeError('Use a valid Date or YYYY-MM-DD date.');
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }
  function rotationWeek(date, activationDate) {
    const day = localDayNumber(date), anchor = localDayNumber(activationDate);
    const anchorWeekday = (new Date(anchor * 86400000).getUTCDay() + 6) % 7;
    const elapsedWeeks = Math.floor((day - (anchor - anchorWeekday)) / 7);
    return elapsedWeeks < 0 ? 0 : (elapsedWeeks % 3) + 1;
  }
  function resolveDay(dayIndex, { weekIndex = 1, tier = 'intermediate', overrides = {} } = {}) {
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 5) throw new RangeError('Training dayIndex must be 0–5; Sunday remains rest.');
    if (![1,2,3].includes(weekIndex)) throw new RangeError('weekIndex must be 1, 2, or 3.');
    if (!tiers[tier]) throw new RangeError(`Unsupported training tier: ${tier}`);
    const result = clone(dayTemplates[dayIndex]);
    const defaultOption = ['primary','alternative','third'][weekIndex - 1];
    result.planVersion = VERSION; result.source_version = VERSION; result.weekIndex = weekIndex; result.tier = tier;
    result.coreSlots = result.coreSlots.map(item => {
      const requested = overrides[item.id] || defaultOption;
      if (!['primary','alternative','third'].includes(requested)) throw new RangeError(`Invalid option for ${item.id}`);
      const selected = item[requested];
      return { ...item, selectedOption: requested, exercise: { ...selected, prescription: clone(selected.tierPrescriptions[tier]) }, needsEquipmentReview: !selected.selectable };
    });
    result.optionalSlots = result.optionalSlots.map(item => ({ ...item, prescription: clone(item.tierPrescriptions[tier]) }));
    result.maxExtras = tiers[tier].maxExtras;
    return result;
  }
  const days = Object.fromEntries([1,2,3].map(weekIndex => [weekIndex, dayTemplates.map(day => ({ ...clone(day), weekIndex }))]));
  const plan = {
    planVersion: VERSION, source_version: VERSION, templateKey: 'threeweek-ppl', label: '3-Week PPL Rotation',
    status: 'data-preview', activeByDefault: false, phases: ['start','move'], rotationLength: 3,
    rotation: { length: 3, weeks: 3, advanceOn: 'Monday', startWeek: 1, options: ['primary','alternative','third'], extrasScope: 'rotation-week-and-weekday' },
    exclusions: { equipment: excludedEquipment, movementNamePattern: excludedNames.source },
    tiers, movements: Object.values(registry), days, rotationWeek, resolveDay,
    readinessNote: 'Data normalization only. Exact artwork, coaching content, equipment review, UI integration, and local verification are required before activation.'
  };
  window.GYM_COMPANION_V53_THREEWEEK = plan;
  window.GYM_COMPANION_V53_PLAN = plan;
})();
