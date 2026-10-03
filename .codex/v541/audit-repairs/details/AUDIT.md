# Problem 3 — selected-exercise detail identity

Baseline: 2f8aac5, codex/v541-release, clean checkout. Local only.

## Confirmed gaps

1. Card detail links carry a slug, not the clicked occurrence. detailItem searches a newly resolved plan and returns the first matching slug. Same-name occurrences with different doses, saved snapshots or optional roles can therefore open another record.
2. Unmatched detail slugs fall through to the old artwork registry, generic catalogue and even a constructed image path. Those are not reliable active ABAC occurrence identities.
3. Alternatives are built by spreading the primary source record. Equipment, cue, safety and phase metadata can remain inherited even when the title/artwork/classification changes. Example: a dumbbell exercise can inherit a cable or machine setup.
4. Active card artwork is refreshed for old snapshots, but the detail lookup independently rebuilds the plan. Card and detail need the same display record.

## Repair boundaries

- Bind each detail action to an ephemeral rendered occurrence record, including selected tier dose and current exact artwork. Do not persist these tokens.
- Alternative descriptive metadata must come from its exact artwork record, not its parent's source metadata. Unresolved instructions are explicitly under review rather than borrowed.
- Preserve exercise names, selection, order, tier prescriptions, images and stored snapshots. No generation or deployment.
- Return-scroll remains the next repair. No mobile redesign or blanket rewriting of workout guidance.
- Unknown active ABAC detail keys must fail safely, not open a generic exercise.

## Checks

All phases/days/levels and available variations: card title, dose and phase paths agree with its detail. Check guided/optional and stale saved snapshots. Verify classification, artwork hashes, excluded equipment, completion and refresh persistence remain intact. Validate at 320/390/430px only for regressions.
