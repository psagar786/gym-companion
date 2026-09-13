# Fitness 7 scientific artwork master prompt

## Asset contract

- One canonical physical movement per registry entry.
- Two separate files: Start and Movement.
- 512 x 512 PNG masters; no split views or contact sheets.
- Charcoal background, black clothing, off-white figure/equipment, orange primary emphasis, muted blue secondary emphasis, grey-green stabilizers.
- Minimum 10 percent clear margin.
- Same athlete, clothing, equipment, camera, lighting, and background within a pair.
- Listing cards use Movement; detail pages use Start and Movement.

## Shared prompt

```text
Use case: scientific educational fitness guidance.
Brand system: Fitness 7.

Create one square instructional illustration for {EXERCISE_NAME}, showing only the {PHASE_NAME} position.

Subject: One adult athlete with realistic athletic proportions wearing consistent black training clothes. Show the exact equipment, grip, stance, joint position, and range defined in the movement specification.

Environment: Minimal charcoal Fitness 7 gym environment with subtle floor contact and restrained depth.

Equipment: {EXACT_EQUIPMENT_AND_ADJUSTMENT}

Body position: {PHASE_POSITION}

Grip and stance: {GRIP_AND_STANCE}

Movement mechanics: {JOINT_PATH_AND_SAFE_RANGE}

Anatomy: Highlight {PRIMARY_MUSCLES} with restrained Fitness 7 orange; {SECONDARY_MUSCLES} with muted blue; {STABILIZERS} subtly in desaturated grey-green. Anatomy emphasis must not hide posture, joints, or equipment.

Composition: Square 1:1. Full athlete and equipment visible. At least 10 percent clear margin on every side. Camera angle: {CAMERA_ANGLE}. One athlete, one pose, one exercise, one phase only.

Style: Premium realistic 3D scientific fitness illustration with controlled high-contrast studio lighting and clear separation from charcoal.

Do not include: text, labels, logos, watermarks, split views, collages, neighboring poses, white backgrounds, decorative gym clutter, unrelated equipment, distorted anatomy, mirrored machines, or cropped hands, feet, cables, bars, benches, weights, or machine frames.

Movement-specific exclusions: {NEGATIVE_CONSTRAINTS}
```

## Start suffix

```text
Phase: Start.
Show the stable position immediately before the repetition begins. Make equipment adjustment, grip, stance, posture, joint stacking, and initial resistance direction clear. Do not show peak contraction or movement arrows. The athlete must look ready to begin.
```

## Movement suffix

```text
Phase: Movement.
Use the approved Start image as the identity reference. Keep the same athlete, clothing, equipment, camera, lighting, and background. Show the clearest working or contracted position. The joint and equipment position must be meaningfully different from Start. Use one restrained orange direction cue only when it improves understanding. Do not repeat the Start pose.
```

## Future exercise-name workflow

1. Normalize the submitted name and search exact canonical IDs and aliases.
2. Reuse an existing pair only when equipment, grip, stance, joint path, and range are mechanically identical.
3. If no exact match exists, create a draft movement specification with equipment, camera, Start, Movement, direction, muscles, and negative constraints.
4. Mark inferred fields as `needs-review`.
5. Refuse prompt approval while equipment or mechanics are ambiguous.
6. Generate separate Start and Movement prompts only after the specification is locked.
7. Validate both files before updating the runtime registry.

## Review gate

Technical validation is not gym-coach approval. A pair remains pending until file integrity, phase difference, mechanics, equipment, margins, and human review are recorded.
