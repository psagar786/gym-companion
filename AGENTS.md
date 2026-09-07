# Gym Companion Agent Guide

Use the smallest focused workstream that can safely complete a change. V3 uses authenticated, cloud-stored member data; treat all member information as private and enforce the Supabase RLS model.

## Routine and content agent

Owns `data/routine.js`: training splits, equipment compatibility, sets/reps, cues, alternatives, and progression. Keep one selected option per slot and preserve the 60–75 minute target.

## Visual-quality agent

Owns exercise visuals and alt text. Each active asset must be a standalone 512×512 PNG, match the Fitness 7 charcoal/black/off-white/orange system, preserve a clear margin, and accurately show the named movement.

## Product and UI agent

Owns mobile usability, scheduling, completion flow, motivation, accessibility, and print behavior. Keep day cards fully clickable and exercise visuals square and uncropped.

## Platform agent

Owns GitHub, Vercel, Supabase migrations and environment configuration, release checks, headers, and deployment health. The Supabase service-role key belongs only in the coach Vercel project. V3 uses separate member and coach projects and must never repoint V1/V2 deployments.

## Documentation agent

Owns this guide, `README.md`, `PRD.md`, release notes, and roadmap accuracy. Update documentation whenever product scope or privacy behavior changes.

## Before merging

Run the data/image validation, render all six days, test a 320px phone layout, verify member session persistence, test invite/reset flows, and verify RLS blocks cross-member reads/writes.
