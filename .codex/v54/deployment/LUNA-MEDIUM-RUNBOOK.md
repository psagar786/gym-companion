# Fitness 7 V5.4 Luna Medium Deployment Runbook

Use one atomic unit per turn. Never reread the full conversation.

## Start and resume

1. Open `.codex/v54/deployment/STATE.json`.
2. Confirm the workspace is `/Users/exxxy/Documents/Daily AI Help/gym-companion-v53-lab`.
3. Confirm branch is `feature/member-accounts-v54`.
4. Confirm `origin` is `https://github.com/psagar786/gym-companion.git`.
5. Confirm Vercel team is `sagar-pm` and project is `fitness7-gym-companion-member`.
6. Run `git status --short --branch` and stop if unexpected changes exist.
7. Execute only `nextAtomicAction`.
8. Record the result, failure, changed files, and one next action in `STATE.json`.

## Safe identity checks

```text
git remote -v
git branch --show-current
git config --local --get user.name
git config --local --get user.email
```

Expected author:

```text
psagar786
22289507+psagar786@users.noreply.github.com
```

Never print, commit, or paste environment-variable values. Never use a service-role key in the member project.

## Atomic sequence

```text
V54-D01 verify workspace, branch and remote
V54-D02 configure repository-only Git author
V54-D03 verify V5.4 release marker and compatibility source versions
V54-D04 run member CI and security checks
V54-D05 resolve or explicitly gate incomplete selectable artwork
V54-D06 run local syntax, routine, asset, and browser checks
V54-D07 commit and push feature/member-accounts-v54
V54-D08 inventory and freeze legacy Vercel Git connections
V54-D09 verify the permanent member project and production branch main
V54-D10 configure member-safe Preview and Production variables
V54-D11 create and verify the feature preview
V54-D12 open the pull request and wait for required checks
V54-D13 merge only after the selectable-runtime gate is clear
V54-D14 verify production, tag v5.4.0, and record rollback evidence
```

## Local checks

```text
node --check member-app.js
node --check bootstrap.js
node --check api/config.js
node scripts/validate-member-release.mjs
node scripts/validate-periodized-abc.mjs
node scripts/validate-v5-guides.mjs
node scripts/validate-threeweek-ppl.mjs --audit
node scripts/validate-v51-artwork.mjs
git diff --check
```

The audit command may report missing or pending artwork. Do not call that a production pass. Fix the selectable records or keep the affected category disabled as `Coming soon`.

## Git and Vercel flow

```text
git push -u origin feature/member-accounts-v54
```

Review the Vercel preview URL. Verify `/api/config` without printing credentials:

```text
curl -fsSL <preview-url>/api/config
```

The safe response must identify member mode and demo mode. Do not expose the Supabase fields in logs.

Open the pull request only after the preview is usable. Merge to `main` only when required checks and the selectable-artwork gate pass. Let Git integration create production from `main`; do not deploy unreviewed feature code directly to production.

## Failure protocol

When a unit fails, append its ID to `failedUnits`, preserve the exact safe error, leave the unit incomplete, and set:

```text
nextAtomicAction: Repair <unit> failure
```

Stop if the repository, Vercel team, project, branch, or deployment target differs from this runbook. Never force-push, rewrite history, delete a deployment, or change Supabase data as part of a deployment repair.
