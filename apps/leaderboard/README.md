# Leaderboard — Astro 4

Live leaderboard app built with Astro 4.

## Setup (pending)

This app will be fully integrated with NX using the `@nxtensions/astro` plugin.

```bash
npm install -D @nxtensions/astro
```

## Architecture

- **Pages**: Server-rendered Astro pages
- **Components**: Astro + Angular islands for interactive parts
- **Data**: Consumes Supabase Realtime via `libs/infra`
