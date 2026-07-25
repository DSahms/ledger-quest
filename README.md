# Ledger Quest (Claims Ledger — Product A)

**Home:** `D:\dev\The Ledger Series\ledger-quest\`  
**Stack:** Next.js web app (adopted from recovered GLM workspace — artifacts only; continue in Cursor)  
**Role:** Claimant-side insurance interview (voice or type) → checklist → report → sign-off

## Suite (do not merge into one app)

| Product | Who | Job | Stack |
|---------|-----|-----|--------|
| **A — Ledger Quest** (this folder) | Customer whose stuff is damaged | Warm interview, fill human side of claim | Next.js web |
| **B — Claims Field** | Insurance agent / adjuster | Document damage, fill report fields, on-device vision | Flutter + SmolVLM |

**GitHub:** https://github.com/DSahms/ledger-quest  
**Sibling B:** https://github.com/DSahms/claims-field  

Shared later: claim packet / export schema. Separate codebases.

## Claim categories (in `src/lib/claim-data.ts`)

Homeowners, Auto, Health, Workers Comp, Disability, Life, Commercial — 48 chapters total.

## Run (when ready)

```powershell
cd "D:\dev\The Ledger Series\ledger-quest"
# copy .env.example → .env.local and set VENICE_API_KEY
bun install   # or npm install
bun dev       # or npm run dev
```

## Provenance

Recovered from tar `workspace-2f5db888…` (2026-07-23). Original build notes: `worklog.md`. Tar copy kept at `D:\Miscellaneous\`.
