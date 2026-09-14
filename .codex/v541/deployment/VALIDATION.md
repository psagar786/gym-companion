# V5.4.1 local-first deployment validation

## V541-DEPLOY-00-BACKUP

- Source checkout: `gym-companion-v541-art-integration`
- Source branch preserved: `codex/v541-v2-art-integration`
- Release branch: `codex/v541-release`
- Source commit: `aa5039dc42a3042bd58aff6f6eb4700866eea6ea`
- Local backup: `/Users/exxxy/Documents/Daily AI Help/fitness7-backups/v5.4.1-pre-deploy-2026-09-14/`
- Backed-up source files: 1,704
- Backup hash verification: PASS
- Thursday artwork: 15/24 new pairs complete; 9 pairs remain pending
- Vercel inventory: pending authenticated CLI access

## V541-DEPLOY-01-ACTIVE-ASSETS

- Active runtime asset manifest: `.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json`
- Active files: 272 PNG files / 136 pairs
- Active bytes before optional WebP optimization: 91,382,384
- Deploy scope: `assets/exercises/periodized-v3/**` plus the Fitness 7 logo
- Excluded: `.codex`, batches, reports, outputs, backups, and historical exercise namespaces
- Wednesday/Thursday day registry: 58 + 62 records, with explicit pending records blocking unrelated fallback art
- Day artwork validator: PASS for all mapped Wednesday/Thursday runtime records
- Thursday pending artwork remains explicit: 9 generation pairs are not active

## V541-DEPLOY-02-SOURCE-READY

- Day-aware V3 artwork registry is loaded before the member app and is authoritative for Monday through Saturday.
- Explicit pending records no longer fall through to legacy, V2, or unrelated artwork.
- Internal artwork review banners are suppressed on normal member workouts and remain available only with an explicit `qa` query.
- `Coming soon` is shown for incomplete artwork instead of an unrelated image.

## V541-DEPLOY-03-LOCAL-VERIFIED

- Preview checked at `http://localhost:4178` from the release workspace (port 4175 was already occupied by another local process).
- Demo sign-in, clean Home, Monday, Tuesday, Wednesday, Thursday, and pending Friday card behavior passed.
- Monday, Wednesday, and completed Thursday V3 artwork paths resolved; Tuesday V3 paths resolved; pending day records showed no image requests.
- Syntax, day-artwork, periodized routine, member-release, and Tuesday-runtime validators passed.
- Periodized validator retained its existing 26 equipment-review warnings; no movement was silently approved.

Next action: commit the verified V5.4.1 source-ready release.

## V541-DEPLOY-04-PREVIEW-VERIFIED

- Preview: `https://fitness7-gym-companion-member-72mkdl6ab-sagar-pm.vercel.app`
- Deployment ID: `dpl_6SHFjtLuyqGs7K3Y5K8gAHvFJ2hu`
- Ready state: READY.
- `/api/config`: member mode with demo mode enabled; no privileged key surfaced.
- Browser smoke: demo sign-in, clean Home, Monday V3 artwork, and pending Friday behavior passed.
- Pending Friday cards made zero periodized artwork requests and displayed `Coming soon`.

Next action: open a pull request from `codex/v541-release` to `main`.

## V541-DEPLOY-05-PRODUCTION-VERIFIED

- Production alias: `https://fitness7-gym-companion-member.vercel.app`
- Deployment URL: `https://fitness7-gym-companion-member-c9nzjub8b-sagar-pm.vercel.app`
- Deployment ID: `dpl_AZ1YNnSXozGJZHk5xjZ2A7gmEapy`
- Main commit: `1eeda26337ec77bda2e9b89dd7b10511f5100b68`
- `/api/config`: member/demo response verified.
- Browser smoke: production sign-in, clean Home, Monday V3 artwork, and pending Friday behavior passed.
- Release tag: `v5.4.1`.

## V541-DEPLOY-06-VERSIONS-CONSOLIDATED

- Retained public versions: V5 (`gym-companion-member-v5.vercel.app`), V5.2 (`gym-companion-member-v52.vercel.app`), and V5.4.1 (`fitness7-gym-companion-member.vercel.app`).
- Legacy project inventory is recorded with project and deployment IDs.
- All five inventoried legacy projects reported no connected Git repository when checked; existing production deployments remain online.
- The release workspace is relinked to `sagar-pm/fitness7-gym-companion-member`.
- Local backup restore hash check remains PASS. No local source or historical asset was deleted.

Next action: run final release smoke checks and confirm the retained-version links.
