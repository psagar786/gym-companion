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

## V541-DEPLOY-06-ASSET-BUNDLE-REDUCED

- Release commit: `8df039b06960fe187988de1d8a17f046ccc0a4ec`
- Active image manifest: 390 WebP files / 195 pairs / 8.66 MiB.
- Estimated tracked upload after `.vercelignore`: 494 files / 14.43 MiB.
- Preview: `https://fitness7-gym-companion-member-ayi9gxru3-sagar-pm.vercel.app`
- Preview status: READY.
- Production deployment: `APkckYcC4sM7GY4Vy1H7nDGtkodt`.
- Production alias: `https://fitness7-gym-companion-member.vercel.app`.
- Production status: READY and serving commit `8df039b`.
- Vercel dashboard usage at audit time: Deployment Storage `8.7 GB / 10 GB`.
- Old deployment records were not deleted in this step; deletion remains a separate destructive cleanup action.

## V541-DEPLOY-06-VERSIONS-CLEANED

- Fitness 7 deployment list verified: only the current V5.4.1 production deployment remains (`APkckYcC4sM7GY4Vy1H7nDGtkodt`).
- Deleted old Fitness 7 records: `7WGBxjWczUhci7XSv51vpBViViA7`, `56vTjLnuQk4zC1Ds7nkGZFzkyPqW`, `E5YMzoPyUfmsVfCUaTEcRcj2NwhB`, `G3D2Ajj8KvDndHu43qpeSt1w72fH`, `DFHPpQ9iezbEnZStRbKwqxgc5pNA`, `AZ1YNnSXozGJZHk5xjZ2A7gmEapy`, `C5qqwyGAXmFsRWixgdjd5nsQ6ust`, `Bbde3vRbjcAqjAxvnHSq3nCGy71e`, and the `9eee380` preview deployment (`5cHWT64bNUnPPpzNzYcfhuJTUhNU`).
- V5 Basic and V5.2 were not changed; they remain separate case-study versions.
- Coach project was not changed.
- Lumen deployment list verified: only latest production `5s74oSD3xpbjWjwuXPwsp29xXjAD` remains.
- Deleted Lumen records: `BDcjW5pQsfx9N2PYH3REWkPVcmkG`, `6YFiGKVJYnSJUvuLsRi5Zo93WgFp`, `9gnCgiePZG6LNf3LftSjFwnkrmeX`, `EhNjtk3XWbTEizYZetWAU6sy4v2W`, `9KCwtsG15wZm53fPxBsTj6tQVFNt`, `DehYpyFaMdkSMGP5Pv93C8Gw59ZA`, `6UHScqzsBLH9guEmfNvmMq7R2a1N`.
- Production smoke check: `https://fitness7-gym-companion-member.vercel.app/` reloads successfully and shows the member sign-in screen.
- Vercel dashboard refreshed after cleanup: Deployment Storage `995.25 MB / 10 GB` (9.952% used; approximately 9.0 GB remaining). Functions Storage is `110.41 kB / 10 GB`; Blob Data Storage and Images Storage are `0 B`.
