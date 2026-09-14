# ADAC artwork audit — Stage 1

Frozen deterministic audit for the active V5.3 runtime artwork queue. The selected output contract is two-frame Start/Movement artwork. No images were generated and no app code was modified.

## Runtime identity snapshot

| Metric | Count |
|---|---:|
| Active union | 256 |
| Main | 64 |
| Alternative | 60 |
| Option 2+ | 92 |
| Warmup | 19 |
| Tendon | 5 |
| Cardio | 4 |
| Recovery | 26 |
| Optional | 15 |

## Artwork snapshot

- Prior complete snapshot: 51
- Prior missing snapshot: 205
- Stick identities: 35
- Clean non-colliding candidates preserved: 15

## Frozen queue

- Records: 256
- Preserve: 15
- Generate: 241
- Batches: 10 (9 full batches of 25 and one batch of 16)
- Assignment: row-major 5×5, rows 1–5 and columns 1–5; each batch has at most 25 generated records.
- Output namespace: assets/exercises/periodized/
- Frames: start and movement

All 35 stick identities and all five tendon proxy identities are marked generate. The machine-readable manifest contains every stable movement identity, runtime role set, compact source spec, two-frame output paths, preservation/generation status, and exact batch/grid assignment.

## Guardrails

Stage 1 is audit and freeze only. Generation, visual review, collision review, registry writes, and app-code changes are deferred to later stages.


