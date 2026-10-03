# Problem 6 — mobile baseline

Baseline: `4f9b337`, branch `codex/v541-release`, clean tree before capture. User authorized Problem 6 while Problem 5's unresolved source decisions remain queued. Scope: existing member UI only; no deployment, artwork, programming or historical-data changes.

## Goal and evidence

Complete a workout with readable artwork, reachable controls and minimal unnecessary scrolling. Captured the running local app through the Codex in-app browser at 393×852; this is a viewport test, not a physical iPhone or Safari test. Apple lists iPhone 16's physical panel as 1179×2556 (https://support.apple.com/en-gb/121029); 393×852 is the chosen 3× logical reference. Browser chrome, keyboard and Display Zoom can reduce/change the usable area.

Current-run screenshots: `evidence/before-home-393.jpg`, `before-workout-393.jpg`, `before-main-393.jpg`, `before-detail-393.jpg`. All four were opened and visually inspected.

## Strengths

- Correct day labels, white focus/date text and orange weekdays.
- Artwork is contained, and required guided work is visible; optional work is collapsed.
- Detail return already restores the exercise position.
- No horizontal overflow in captured Home/workout/detail at 393px.

## Confirmed issues and scoped corrections

| Step | Evidence / measurement | Correction |
|---|---|---|
| Home / history | Profile target 42×44; month arrows 38×44. | Minimum 44×44 for standalone controls. Preserve seven-column calendar; its narrow date cells are an explicitly recorded exception at small widths. |
| Main workout | Saturday first card 349.44px, second 415.31px; 128px artwork, but Done reserves 62px down the whole text column. Variations stack vertically beside large unused space. | Reserve Done only beside the title; let dose, rest, details and variations use the full content-column width. Keep 128px artwork and contain framing. |
| Guide | Sets/Reps/Rest occupy three full rows (151px total). | Three compact, wrapping metrics at normal phone text size; retain readable values and uncropped full-width phase images. |
| Guided scroll | Scroll nudge is visible, but nested region has no keyboard focus/label. | Label each guided scroll region, make it keyboard focusable, add clear focus ring and visible scrollbar styling without trapping touch/page scrolling. |
| iPhone safeguards | Safe-area padding is split across old narrow-only overrides; viewport lacks viewport-fit. | Explicit member-only safe-area padding including landscape, small-viewport height, 16px form fields, visible keyboard focus; retain browser zoom. |

No new visual language, new controls, hidden required content or tighter fixed card heights are proposed. No qualification of gym mechanics is implied. Full WCAG compliance and VoiceOver, real Safari keyboard, notch and touch behavior remain manual checks.

## Next unit

Implement these focused layout and accessibility repairs, validate source invariants, then measure Home, six workouts, guides, optional/tendon disclosures and plan/profile across the requested widths. Preserve prior screenshot artifacts.
