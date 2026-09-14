# Fitness 7 V5.4.1 deployment inventory

## Canonical source

- Repository: `psagar786/gym-companion`
- Source branch: `codex/v541-v2-art-integration`
- Release branch: `codex/v541-release`
- Release source commit: `aa5039dc42a3042bd58aff6f6eb4700866eea6ea`

## Retained public versions

| Purpose | URL/project | Retain | Notes |
|---|---|---:|---|
| Basic text baseline | `https://gym-companion-member-v5.vercel.app/` | Yes | Keep surfaced for the product story. |
| Intermediate image version | `https://gym-companion-member-v52.vercel.app/` | Yes | Keep surfaced for comparison. |
| Current release | `fitness7-gym-companion-member` | Yes | Permanent V5.4.1 member project; URL is confirmed after linking. |

## Legacy projects

Authenticated Vercel inventory is required before changing build settings. Record each project’s project ID, production URL, production deployment ID, production SHA, production branch, and last deployment timestamp. Freeze automatic Git builds first. Do not remove the coach project or any retained public version.

## Access status

- Authenticated Vercel CLI account: `psagar786`.
- Authorized team: `sagar-pm`.
- Permanent member project: `fitness7-gym-companion-member`.
- Permanent production URL: `https://fitness7-gym-companion-member.vercel.app`.
- Project ID: `prj_qbY8V7wbd6Ml53sBKmfwfBGI5buQ`.
- Existing member-project environment names: `APP_MODE`, `DEMO_MODE`, `MEMBER_APP_URL` (Preview and Production where configured). Values are intentionally not recorded.
- Service-role variable check: no `SUPABASE_SERVICE_ROLE_KEY` appears in the member-project environment inventory.

Legacy projects remain online for comparison and are not modified in this checkpoint. Their automatic-build settings will be addressed only after the permanent preview and production are verified.
