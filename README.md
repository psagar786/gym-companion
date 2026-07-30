# Gym Companion

A visual, device-first workout companion created for Fitness 7 members when the original gym app is unavailable. It shows the day’s routine, clear exercise illustrations, equipment-compatible variations, and local completion tracking.

## Use it

Open `index.html`, choose today’s card, select one option per exercise, and tick the slots you complete. Choices and progress are saved only in that browser using local storage.

## Fast routine updates

Edit [data/routine.js](data/routine.js). It is the single source of truth for the six-day schedule, sets, cues, exercise variations, and image names. Exercise images live in `assets/exercises/` and must be 512×512 PNGs.

## Deployment

This is a static site with no build command. Import the GitHub repository into Vercel with the project root set to this folder. Production deploys from `main`; pull requests receive preview URLs.

**Live site:** https://gym-companion-blush.vercel.app

## Privacy and safety

No accounts, analytics, or server-side storage are included. This app is a workout reference, not medical advice. Stop for sharp pain, dizziness, chest symptoms, or unusual breathlessness.

See [PRD.md](PRD.md) for product direction and [AGENTS.md](AGENTS.md) for the contributor/agent guide.
