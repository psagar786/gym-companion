# Gym Companion Agent Guide

Use the smallest focused workstream that can safely complete a change. Preserve the device-only privacy model unless a product decision explicitly changes it.

## Routine and content agent

Owns `data/routine.js`: training splits, equipment compatibility, sets/reps, cues, alternatives, and progression. Keep one selected option per slot and preserve the 60–75 minute target.

## Visual-quality agent

Owns exercise visuals and alt text. Each active asset must be a standalone 512×512 PNG, match the Fitness 7 charcoal/black/off-white/orange system, preserve a clear margin, and accurately show the named movement.

## Product and UI agent

Owns mobile usability, scheduling, completion flow, motivation, accessibility, and print behavior. Keep day cards fully clickable and exercise visuals square and uncropped.

## Platform agent

Owns GitHub, Vercel, release checks, headers, and deployment health. Publish preview deployments for pull requests and production only from `main`.

## Documentation agent

Owns this guide, `README.md`, `PRD.md`, release notes, and roadmap accuracy. Update documentation whenever product scope or privacy behavior changes.

## Before merging

Run the data/image validation, render all six days, test a 320px phone layout, verify local-storage persistence/reset, and confirm no personal data is sent off-device.
