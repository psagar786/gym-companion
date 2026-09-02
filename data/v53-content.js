/* V5.3 additive content layer. Keeps the complete V5.2 routine and adds the
   requested stick mobility and tendon-preparation guidance without replacing
   the approved workout UI or plan data. */
(() => {
  const stick = (name, stableId, target, cue, why, safety) => {
    const stem = `assets/exercises/biweekly/${stableId}`;
    return {
      id: `v53-guided-${stableId}`,
      title: name,
      name,
      duration: '6 controlled reps',
      cue,
      why,
      target_muscles: target,
      equipment: 'Light stick or broom handle',
      alt: `Fitness 7 illustration: ${name}`,
      image: `${stem}-phase-move.png`,
      imageSet: { setup: `${stem}-phase-setup.png`, move: `${stem}-phase-move.png`, return: `${stem}-phase-return.png` },
      phaseBriefs: {
        setup: { instruction: `Stand tall and hold the stick securely before ${name.toLowerCase()}.` },
        move: { instruction: `Move slowly through a comfortable range; keep the ribs stacked and breathe.` },
        return: { instruction: 'Return to the start with no bouncing or shoulder pinch.' }
      },
      safetyCue: safety,
      exerciseType: 'mobility',
      recommended: true
    };
  };
  const tendon = (name, target, cue, safety) => ({
    id: `v53-tendon-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: name,
    name,
    duration: '30 sec × 3 sets',
    cue,
    why: `Builds gentle isometric capacity in the ${target.toLowerCase()} before loading.` ,
    target_muscles: target,
    equipment: 'Bodyweight and the opposite hand',
    alt: `Fitness 7 illustration: ${name}`,
    image: 'assets/exercises/isometric-tendon-prep.png',
    imageSet: {
      setup: 'assets/exercises/isometric-tendon-prep.png',
      move: 'assets/exercises/isometric-tendon-prep.png',
      return: 'assets/exercises/isometric-tendon-prep.png'
    },
    phaseBriefs: {
      setup: { instruction: `Find a neutral, pain-free position for the ${target.toLowerCase()}.` },
      move: { instruction: 'Apply light steady pressure and hold for 30 seconds without gripping harder.' },
      return: { instruction: 'Release slowly, rest, and repeat for three comfortable sets.' }
    },
    safetyCue: safety,
    exerciseType: 'tendon-preparation',
    recommended: true
  });

  window.GYM_COMPANION_V53_CONTENT = {
    warmup: [
      [stick('Stick shoulder dislocates', 'biweekly-stick-shoulder-dislocates', 'Shoulder capsule and upper back', 'Use a wide grip; move the stick over the head without shrugging.', 'Opens a pain-free overhead path before pulling.', 'Widen the grip immediately if the front shoulder pinches.'), stick('Stick around-the-worlds', 'biweekly-stick-around-the-worlds', 'Shoulders and thoracic spine', 'Trace a slow circle while the pelvis stays still.', 'Rehearses shoulder control across multiple angles.', 'Stay within a comfortable range; never force the circle.')],
      [stick('Stick around-the-worlds', 'biweekly-stick-around-the-worlds', 'Shoulders and chest', 'Keep the stick moving smoothly while ribs stay down.', 'Prepares the shoulder path for pressing.', 'Use a shorter range if the shoulder feels compressed.')],
      [stick('Stick overhead thoracic extensions', 'biweekly-stick-overhead-thoracic-spine-extensions', 'Thoracic spine and shoulders', 'Extend through the upper back, not the lower back.', 'Helps the torso support a stable leg-day setup.', 'Avoid arching the lumbar spine or forcing overhead range.')],
      [stick('Stick standing trunk rotations', 'biweekly-stick-standing-torso-twists', 'Thoracic spine and obliques', 'Rotate from the breastbone while hips face forward.', 'Prepares trunk rotation without loading the spine.', 'Use a smaller range if the back feels irritated.')],
      [stick('Stick shoulder dislocates', 'biweekly-stick-shoulder-dislocates', 'Shoulders and upper back', 'Move slowly and keep the neck relaxed.', 'Prepares delts and upper back for shoulder and arm work.', 'Never force the stick behind the body.')],
      [stick('Stick standing trunk rotations', 'biweekly-stick-standing-torso-twists', 'Thoracic spine and obliques', 'Turn through the upper back, not the knees.', 'Warms the trunk before core and arm work.', 'Stop for sharp back pain or dizziness.')]
    ],
    tendon: [
      tendon('Wrist extensor isometric', 'Wrist extensors and forearm', 'Press lightly into the opposite palm while keeping the wrist neutral.', 'Use gentle effort only; stop for sharp pain, tingling, or numbness.'),
      tendon('Wrist flexor isometric', 'Wrist flexors and forearm', 'Resist the wrist flexion with the opposite hand without moving.', 'Keep the elbow relaxed and stop if symptoms spread.'),
      tendon('Patellar tendon isometric', 'Quadriceps and patellar tendon', 'Use a shallow wall-sit position and hold steady.', 'Keep discomfort mild and stop if knee pain becomes sharp.'),
      tendon('Calf isometric', 'Calf complex and Achilles', 'Rise to a comfortable calf raise and hold without rolling the ankle.', 'Use support and stop for sharp Achilles pain.'),
      tendon('Wrist extensor isometric', 'Wrist extensors and forearm', 'Hold a neutral wrist against gentle opposite-hand pressure.', 'Do not squeeze through pain or numbness.'),
      tendon('Core brace isometric', 'Abdominal wall and trunk stabilisers', 'Brace as if preparing for a light tap while breathing normally.', 'Never hold your breath; stop for pain or unusual breathlessness.')
    ]
  };
  window.GYM_COMPANION_V53_CONTENT.tendon[3] = {
    ...window.GYM_COMPANION_V53_CONTENT.tendon[3],
    description: 'Stand with one hand on a stable support, rise onto both forefeet, and hold a calm mid-range calf raise.',
    cardDescription: 'Optional calf isometric: 30 sec × 3 sets with 45 sec rest.',
    duration: '30 sec × 3 sets · 45 sec rest',
    why: 'Provides a small, controlled calf-loading practice before Thursday’s walking and pulling work; it is not treatment or guaranteed injury prevention.',
    cue: 'Keep pressure through the big-toe mound and breathe normally while the ankles stay straight.',
    commonMistake: 'Rolling onto the outer foot, bouncing, or holding the breath to tolerate more effort.',
    safetyCue: 'Use a wall or rail. Keep effort gentle to moderate and stop for sharp Achilles pain, swelling, or altered sensation.',
    progression: 'Complete three calm holds first; only then increase effort slightly, never effort and duration together.',
    prescriptions: { beginner: '3 × 30 sec · 45 sec rest', intermediate: '3 × 30 sec · 45 sec rest', advanced: '3 × 30 sec · 45 sec rest' },
    phaseBriefs: {
      setup: { instruction: 'Stand tall beside a wall or rail with feet hip-width and weight evenly spread.', directionCue: 'Rise only after the feet and ankles are aligned.' },
      move: { instruction: 'Lift to a comfortable calf-raise height and hold 30 seconds while breathing normally.', directionCue: 'Press straight down through the forefeet; do not let the ankles roll.' },
      return: { instruction: 'Lower slowly, rest 45 seconds, and repeat for three total holds.', directionCue: 'Return under control with no drop or bounce.' }
    }
  };
})();
