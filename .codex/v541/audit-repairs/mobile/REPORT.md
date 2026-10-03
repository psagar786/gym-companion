# Problem 6 — local mobile repair

Local review: http://localhost:4175/?v=5.4.1-mobile-optimization

Implementation `592f8ac`; baseline `4f9b337`. This is a verified local responsive repair, not a completed physical-iPhone/Safari sign-off. No deployment occurred.

## What changed

The screenshot-led audit identified that Done reserved space down the entire copy column. It now floats beside only the top title lines, freeing lower copy and variation controls without increasing the 128px phone artwork or cropping it. The same pattern applies to guided cards. Details retain full square phase images, with Sets/Reps/Rest in three compact wrapping cells. Month arrows and profile access have 44×44 targets. Calendar heading fits beside its controls at the reference width.

Guided scroll regions are named and keyboard-focusable, with clear focus rings and scrollbar styling. Member-only safe-area padding covers all four edges, including landscape; viewport-fit is enabled without a zoom lock. Form fields use 16px text. Sub-320px effective widths reflow instead of shrinking text. Coach/admin markup and code are unchanged; new selectors are member-scoped.

## Flow review

| Step | Health and evidence |
|---|---|
| Home / history | Pass viewport checks: six correct focus labels, orange weekdays/white dates and focus, today highlight, compact month controls. `final-home-393.jpg`. Date cells remain an explicitly documented small-target exception. |
| My Plan / profile | Pass 320/393 checks: readable, no overflow, 16px / 47px-high select fields. No level or preference was submitted during review. |
| Workout cards | Pass six days at six phone widths: no image/text or title/Done collision, six main slots, 44px standalone controls. `final-main-393.jpg`, `final-main-320.jpg`. |
| Required guided work | Open by default, keyboard PageDown scrolls the named warm-up region. Required recovery remains visible; no optional wrapper was added. |
| Optional / tendon | Expanded at 320/393/430 without overflow; closed initially and unchanged selection/check state. `final-extras-393.jpg`. |
| Guide / return | Pass 320/393/430: contained square Start/Movement, compact metrics; both phase samples decode at 512px. Button Back and native browser Back restore exact origin Y and presentation state. `final-guide-393.jpg`. |
| Landscape / desktop | Six workouts each at 852×393 and 1280×900: no horizontal overflow. Fully rendered desktop capture `final-desktop-home.jpg`. |
| Narrow reflow | Six workouts at actual 240px pass. Browser clamped requested 197px to 240px; this is not proof of 200% zoom. |

All `final-*` screenshots listed above were opened and visually inspected. Early `after-home-393.jpg` caught entry animation; `after-saturday-393.jpg` contains unloaded below-fold images. These are retained as capture diagnostics, not accepted visual evidence. A transient desktop resize capture was replaced after confirming the 1280px layout and fully opaque day cards. The early horizontal-only overlap probe misclassified vertically stacked reflow cards; corrected two-axis overlap measurements pass.

## Measurements and regression

At 393px the first two Saturday cards decreased from 349.44 → 305.69px and 415.31 → 336.19px (about 13% and 19%). Image width remains 128px. No fixed card height or clipped text was introduced. At 320px long titles and three variation buttons still produce taller cards: the largest measured is 449px. This is the trade-off of retaining readable content, reachable targets and the approved large left-image layout; no claim of a 190–230px universal height is made.

Scope guard: 1,690 protected source/data/asset files match baseline Git blob bytes. Application JS differs only by guided-region attributes; persistence, selected identity, artwork resolution, numeric programming and return-navigation logic remain identical. Runtime regression: 72 cases / 1,867 detail records; classification 840 name occurrences; 34 prescription and 10 video/metric fixtures; 302 unchanged active asset hashes. Member security and bundle checks pass. The routine validator retains 26 pre-existing equipment-review warnings. No console errors/warnings in the local browser.

No new completion, variation, optional-item or training-level mutations were made in the existing demo dataset. Current checkbox/variation/disclosure states matched before and after the three live return checks; immutable-input validation passed. This is not a new end-to-end persistence-write test.

## Remaining limits

- Physical iPhone 16 Safari, touch gestures, safe-area insets, keyboard, pinch zoom/Display Zoom, reduced-motion settings and VoiceOver require device review. Automated viewport dimensions do not establish these.
- Seven-column calendar date cells remain narrower than 44px on some phones. No blanket WCAG compliance is claimed.
- Problem 2's missing/held artwork and Problem 5's source decisions remain pending. The pre-existing “No Cardio” pending-art visual is unchanged and is a separate content/UI follow-up, not new missing exercise artwork.
- No Vercel/GitHub release is authorized by this mobile pass.

## Next action

Obtain the user's mobile-review feedback before deployment. For a physical-device test, arrange an explicitly authorized reachable local/preview URL; localhost:4175 is currently laptop-loopback only. Do not silently expose the server to the LAN or verify the new code against unchanged production.
