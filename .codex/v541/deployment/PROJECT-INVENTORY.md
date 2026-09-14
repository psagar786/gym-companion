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

| Project | Production URL | Latest deployment ID | Action |
|---|---|---|---|
| `gym-companion-guided-v2` | `https://gym-companion-guided-v2.vercel.app` | `prj_qyABfPbUWfpcunlrJ42xyQqHaPpO` / `dpl_7kpddVYyaNwBGRnV6AigeY9reaoN` | Freeze Git builds; retain online |
| `gym-companion` | `https://gym-companion-blush.vercel.app` | `prj_foraxqtwfLh2RfkFrLFoMutB61IY` / `dpl_D4idkVR2vmwoC6uiZgZxxr5vD7uU` | Freeze Git builds; retain online |
| `gym-companion-member-v3` | `https://gym-companion-member-v3.vercel.app` | `prj_IjblX0ZXpaCL9xgMgW2DAFEpdCCu` / `dpl_7yjB9LPdhLWpya37DJwv75yBnHbb` | Freeze Git builds; retain online |
| `gym-companion-coach-v3` | `https://gym-companion-coach-v3.vercel.app` | `prj_VXw0YwqJ2HWicXPu72czEpC2KFAt` / `dpl_DF53hCXT5dwpgHqKiWyUKtEHBSV8` | Freeze Git builds; never delete |
| `gym-companion-member-v4` | `https://gym-companion-member-v4.vercel.app` | `prj_BpEmrRMKtoHAHTzYPegR50HzeQ1t` / `dpl_4mCNxpAAjEQRWN3yo5CBAHzQna3B` | Freeze Git builds; retain online |

Deployment timestamps and project IDs are available from the authenticated Vercel project inventory; no legacy project has been deleted or overwritten. Automatic-build freezing is the next cleanup action and will not affect existing production deployments.

## Access status

- Authenticated Vercel CLI account: `psagar786`.
- Authorized team: `sagar-pm`.
- Permanent member project: `fitness7-gym-companion-member`.
- Permanent production URL: `https://fitness7-gym-companion-member.vercel.app`.
- Project ID: `prj_qbY8V7wbd6Ml53sBKmfwfBGI5buQ`.
- Existing member-project environment names: `APP_MODE`, `DEMO_MODE`, `MEMBER_APP_URL` (Preview and Production where configured). Values are intentionally not recorded.
- Service-role variable check: no `SUPABASE_SERVICE_ROLE_KEY` appears in the member-project environment inventory.

Legacy projects remain online for comparison and are not modified in this checkpoint. Their automatic-build settings will be addressed only after the permanent preview and production are verified.
