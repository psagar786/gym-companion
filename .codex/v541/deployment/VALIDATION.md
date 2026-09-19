# V5.4.1 GitHub-first release validation

## V541-DEPLOY-00-BACKUP

- Backup: `/Users/exxxy/Documents/Daily AI Help/fitness7-backups/v5.4.1-release-2026-09-19/`
- SHA-256 restore verification: PASS
- Source commit: `3530da11e3db330c59df6edcc1307162e553d498`
- Branch: `codex/v541-release`
- Remote: `https://github.com/psagar786/gym-companion.git`
- No local source or historical artwork was deleted.

## V541-DEPLOY-01-ACTIVE-ASSETS

- Active runtime manifest: `.codex/v541/deployment/ACTIVE-ASSET-MANIFEST.json`
- Active files: 390 WebP files / 195 pairs
- Active bytes: 9,084,964 bytes / 8.66 MiB
- PNG masters remain locally and are excluded from the deployment bundle.
- All active WebP files decode as 512×512 and have unique hashes.

## V541-DEPLOY-02-ACTIVE-BUNDLE-READY

- Active bundle validator: PASS
- Bundle gate: below 95 MiB
- Service-role browser reference check: PASS
- `.vercelignore` excludes PNG masters, reports, backups, and generation workspaces.
- Runtime registries now reference optimized WebP copies.

## V541-DEPLOY-03-LOCAL-VERIFIED

- Local server: `http://localhost:4179`
- `/api/config`: member mode with demo mode enabled
- Root page: HTTP 200
- Sample active WebP asset: HTTP 200 with `image/webp`
- JavaScript syntax: PASS
- Member release validator: PASS
- Periodized ABAC validator: PASS with existing equipment-review warnings
- Day artwork validator: PASS
- Tuesday runtime mapping validator: PASS

## Remaining release gates

## V541-DEPLOY-03-PREVIEW-VERIFIED

- Preview: `https://fitness7-gym-companion-member-6e4s3huz3-sagar-pm.vercel.app`
- Deployment ID: `dpl_GAYK8TmA91WuRiaqLT9kJRhgXKbX`
- Status: READY
- `/api/config`: member/demo mode
- Active WebP artwork: HTTP 200
- V4 replacement artwork: HTTP 200
- Legacy PNG master request: not deployed (HTTP 404)
- GitHub CI and Vercel preview checks: PASS

## V541-DEPLOY-04-PRODUCTION-VERIFIED

- Production alias: `https://fitness7-gym-companion-member.vercel.app`
- Deployment: `https://fitness7-gym-companion-member-rguwz1xyj-sagar-pm.vercel.app`
- Deployment ID: `dpl_DFHPpQ9iezbEnZStRbKwqxgc5pNA`
- Production merge commit: `57a797ca739fdc8abe60eb529de17fe70dc1aea7`
- `/api/config`: member/demo mode
- Active WebP artwork: HTTP 200
- Release marker: `5.4.1`

## V541-DEPLOY-05-VERSIONS-CONSOLIDATED

- Vercel team: `sagar-pm` / Hobby plan
- Active bundle: 8.66 MiB, below the 95 MiB release gate and documented 100 MB Hobby source limit.
- Legacy automatic Git deployments: disabled for all five recorded legacy projects.
- Existing legacy deployments remain online and were not deleted.
- Existing `v5.4.1` tag was preserved; `v5.4.1-r1` identifies this artwork-bundle release without rewriting Git history.

## Final release state

- Pull request: `https://github.com/psagar786/gym-companion/pull/3`
- Retained versions: V5, V5.2, and V5.4.1
- Local backup restore: PASS
- No service-role key configured in the member release.
- Member environment names are limited to `MEMBER_APP_URL`, `DEMO_MODE`, and `APP_MODE` in Preview and Production; no service-role variable is present.
