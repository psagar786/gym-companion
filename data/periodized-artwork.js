/* ADAC artwork registry. Batch B01 is staged locally; review status stays
 * explicit so the periodized plan can be inspected without borrowing art. */
(() => {
  const names = [
    ['biweekly-incline-dumbbell-bench-press-30','Incline Dumbbell Bench Press (30°)'],
    ['biweekly-wide-grip-lat-pulldown','Wide-Grip Lat Pulldown'],
    ['biweekly-chest-supported-incline-dumbbell-row','Chest-Supported Incline Dumbbell Row'],
    ['biweekly-flat-dumbbell-bench-press','Flat Dumbbell Bench Press'],
    ['biweekly-straight-arm-cable-pulldown','Straight-Arm Cable Pulldown'],
    ['biweekly-incline-dumbbell-hex-press','Incline Dumbbell Hex Press'],
    ['biweekly-stick-shoulder-dislocates','Stick Shoulder Dislocates'],
    ['biweekly-stick-around-the-worlds','Stick Around-the-Worlds'],
    ['biweekly-stick-overhead-thoracic-spine-extensions','Stick Overhead Thoracic Spine Extensions'],
    ['biweekly-cable-face-pull-with-external-rotation','Cable Face Pull with External Rotation'],
    ['biweekly-hanging-straight-leg-raise','Hanging Straight-Leg Raise'],
    ['biweekly-stick-behind-the-back-chest-opener','Stick Behind-the-Back Chest Opener'],
    ['biweekly-stick-overhead-lat-stretch','Stick Overhead Lat Stretch'],
    ['biweekly-doorway-pec-stretch','Doorway Pec Stretch'],
    ['biweekly-stick-seated-russian-twists','Stick Seated Russian Twists'],
    ['biweekly-lying-pelvic-tilt-leg-raise','Lying Pelvic-Tilt Leg Raise'],
    ['biweekly-cable-pallof-press-with-iso-hold','Cable Pallof Press with Iso-Hold'],
    ['biweekly-stick-standing-lateral-side-bends','Stick Standing Lateral Side Bends'],
    ['biweekly-transverse-abdominis-stomach-vacuum','Transverse Abdominis Stomach Vacuum'],
    ['biweekly-kneeling-cable-rope-crunch','Kneeling Cable Rope Crunch'],
    ['biweekly-stick-standing-torso-twists','Stick Standing Torso Twists'],
    ['biweekly-stick-overhead-side-bends','Stick Overhead Side Bends'],
    ['biweekly-stick-high-knee-marches','Stick High Knee Marches'],
    ['biweekly-incline-walk','Incline Walk'],
    ['biweekly-intervals','Intervals']
  ];
  const movements = Object.fromEntries(names.map(([stableMovementId, name]) => ({
    [stableMovementId]: {
      stableMovementId,
      name,
      artworkStatus: 'review',
      visualReviewStatus: 'pending',
      semanticReviewStatus: 'pending',
      assetVersion: 'periodized-abc-art-v1-b01',
      alt: `Fitness 7 illustration: ${name}`,
      imageSet: {
        start: `assets/exercises/periodized/${stableMovementId}-v1-start.png`,
        movement: `assets/exercises/periodized/${stableMovementId}-v1-movement.png`
      }
    }
  })));
  window.GYM_COMPANION_PERIODIZED_ARTWORK = { batch: 'B01', movements };
})();
