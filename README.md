# H.E.R.O — High Performance Event Result Organizer

Real-time results platform for CrossFit and Hyrox competitions.

> **Demo:** April 11, 2026 · BOX Madrid

## Overview

H.E.R.O eliminates latency between judges and the audience at CrossFit and Hyrox competitions. No own server — backend is 100% Supabase.

## Modules

| Module           | Tech                    | Accent        |
| ---------------- | ----------------------- | ------------- |
| Admin Panel      | Angular 21 · Desktop    | `blue-600`    |
| Judge Interface  | Angular 21 PWA · Mobile | `violet-600`  |
| Live Leaderboard | Astro · TV/Projector    | `emerald-600` |

## Stack

- **Backend:** Supabase (PostgreSQL + PostgREST + Auth + Realtime + RLS)
- **Hosting:** Vercel — 3 independent projects, 1 repo
- **Supabase Project:** `blgssvpsobfpfxghigca` · region `eu-west-3`

## Dev

```sh
npx nx serve admin      # Admin Panel
npx nx serve judge      # Judge Interface
npx nx serve leaderboard # Live Leaderboard
```
