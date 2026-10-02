# Problem 5 — Exercise content

Baseline: clean `codex/v541-release` at `6fe29fe`. Local-only scope.

Confirmed gaps:

- 66 available alternative/Option 2 labels lack exact phase instructions in the artwork record. This is a content count, not an image-generation count.
- The prescription parser searches the full source string, allowing `Rest: 60 sec` to become a work duration. Short `s` units and per-side/direction qualifiers are lost.
- Generic word-based coaching assigns elbow-flexion advice to Leg Curl and load progression to bodyweight leg raises/vacuums. Rotation alone can wrongly imply mobility rather than loaded core work.
- Frozen generation specifications contain usable mechanics for many identities, but some Wednesday/Thursday prompts are generic and some older master records inherit incorrect equipment. They cannot be blindly approved.

Boundaries: restore concrete source-backed content through exact approved artwork identity; never change source prescriptions, tier execution, exercise order, artwork paths, history or CSS. Combined/ambiguous/excluded/deferred records remain under review. No new artwork, deployment or medical/coach approval.

Units: baseline → exact content → prescription display → local regression/review. Checkpoint and commit each validated source unit. Problem 6 remains dedicated iPhone optimization.
