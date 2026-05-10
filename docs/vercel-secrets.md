# Vercel Deployment Secrets

## GitHub Actions Secret

Only one secret needed in GitHub:

### VERCEL_TOKEN

Get it from: `vercel.com` → Account Settings → Tokens → Create Token

Add to: `github.com/cuman14/HERO/settings/secrets/actions`

---

## Vercel Environment Variables (per project)

Add these in each Vercel project → Settings → Environment Variables:

### judge

- `NX_PUBLIC_SUPABASE_URL`
- `NX_PUBLIC_SUPABASE_ANON_KEY`

### admin

- `NX_PUBLIC_SUPABASE_URL`
- `NX_PUBLIC_SUPABASE_ANON_KEY`

### leaderboard

- `NX_PUBLIC_SUPABASE_URL`
- `NX_PUBLIC_SUPABASE_ANON_KEY`

Target: Production + Preview

---

## Project IDs (already configured in workflow)

- **judge**: `prj_fdR9nYPXdOMWgeCoWXkZWkYvNPDv`
- **admin**: `prj_OhTXf4PmY8OjryOsqEN04KLwi1KW`
- **leaderboard**: `prj_cG7qB4nOaKnCo7PfUBKWJkRXfcSC`
- **orgId**: `team_sMmJmobd92vIBFKdJ2KxbtcE`

These are already in `.github/workflows/deploy.yml`.
