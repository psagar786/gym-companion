# Problem 4 — return to the tapped exercise

Baseline: 38ada25, codex/v541-release; clean checkout. Local only.

The detail transition destroys the workout DOM and Back renders a new workout. Browser scroll clamps during the screen replacement, native disclosures reset, and nested guided scroll positions disappear. Back is also hard-coded to Workout even when details were opened from My Plan.

Use a transient in-memory return context: originating screen/day, original DOM, initiating button, page scroll and nested scroll positions. Restore the original DOM rather than rebuilding it. Focus the originating control without scrolling. Open details at the top. A dedicated same-URL history entry supports the browser Back gesture while details are open; leaving via another screen discards the cached context so stale DOM cannot return.

No workout, prescription, artwork, CSS, stored preferences or historical session writes. Disclosure state stays presentation-only. Validate main variations, guided internal scrolling, tendon/optional disclosures, My Plan, repeated visits, browser Back, resize and refresh boundaries at 320/390/430px.
