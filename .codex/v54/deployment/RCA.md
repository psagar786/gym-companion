# Fitness 7 V5.4 Deployment RCA

## Findings

- The local `.vercel/project.json` points to the former `gym-companion-member-v53` project in an inaccessible Vercel team.
- The canonical Git remote is now `https://github.com/psagar786/gym-companion.git`, but the latest release commit was authored as `eXXXy003`.
- Multiple legacy Vercel projects share the same repository without Git build filtering, so one push fans out into unrelated previews.
- The V5.4 branch currently shares its tip with the previous V5.3 work and the member UI still identified itself as `V5.3 LAB`.
- No repository CI workflow enforced member syntax, routine, artwork, or service-role boundary checks.
- Three-week validation reports review failures and missing/pending artwork. These records must be fixed or kept out of selectable production paths before promotion.

## Corrective policy

The permanent member project is the only routine deployment target. Legacy URLs remain available but their Git builds are frozen. Production is promoted from `main` only after preview verification and required checks pass. Historical session source versions are preserved.
