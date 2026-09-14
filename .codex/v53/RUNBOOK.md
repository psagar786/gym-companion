# V5.3 continuation runbook

The working branch is intentionally aligned to the complete V5.2 checkpoint before any new V5.3 work.

- Workspace: `/Users/exxxy/Documents/Daily AI Help/gym-companion-v53-lab`
- Branch: `feature/member-accounts-v53`
- Baseline: `510348d` (`checkpoint-v52-working-20260831`)
- Earlier V5.3 experiment: `backup/v53-pre-v52-realignment`
- Local preview: `http://localhost:4175/`

The V5.2 baseline includes the full member flow: workout cards, alternatives, optional add-ons, warm-up, tendon preparation, recovery, artwork review, calendar rings, history, and demo mode.

## Resume contract

1. Read `.codex/v53/STATE.json` and verify the working tree before starting.
2. Work only on `nextAtomicAction`.
3. Preserve all V5.2 behavior unless a change is explicitly required by the approved V5.3 plan.
4. Checkpoint after each bounded unit with changed files, validation evidence, and the next action.
5. Do not deploy or merge until local review is approved.
