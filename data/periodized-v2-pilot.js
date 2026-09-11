window.GYM_COMPANION_PERIODIZED_V2_PILOT = {
  key: 'periodized-v2-pilot',
  label: 'A–B–A–C Visual Pilot',
  planVersion: 'periodized-abc-v2-pilot',
  targetSets: 43,
  targetFiles: 86,
  completedSets: 1,
  movements: {
    'periodized-single-arm-cable-pulldown': {
      stableMovementId: 'periodized-single-arm-cable-pulldown',
      name: 'Single-Arm Cable Pulldown',
      sourceRow: 44,
      role: ['main', 'alternative'],
      equipment: 'High cable station with single handle',
      targetGroups: ['back', 'lats', 'biceps'],
      startInstruction: 'Stand or kneel tall with one hand on the high cable handle. Brace the ribs and let the arm reach overhead without shrugging.',
      movementInstruction: 'Drive the elbow down toward the side until the hand reaches the upper ribs. Pause, then release under control.',
      directionCue: 'Elbow travels down and slightly back.',
      imageSet: {
        start: 'assets/exercises/periodized-v2/periodized-single-arm-cable-pulldown-v2-start.png',
        movement: 'assets/exercises/periodized-v2/periodized-single-arm-cable-pulldown-v2-movement.png'
      },
      altStart: 'Fitness 7 illustration: Single-Arm Cable Pulldown starting position',
      altMovement: 'Fitness 7 illustration: Single-Arm Cable Pulldown working position',
      artworkStatus: 'complete',
      visualReviewStatus: 'pending',
      semanticReviewStatus: 'pending',
      assetVersion: 'periodized-abc-art-v2'
    }
  }
};
