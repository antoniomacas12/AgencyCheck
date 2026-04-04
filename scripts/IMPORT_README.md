# Data Import — Old Supabase → New Project

Run these commands **from inside the `ProjektX/` directory** on your Mac (where `node_modules` lives).

---

## Files already placed for you

The JSON exports are already in place:
```
scripts/data/agencije.json   ← 19 agencies
scripts/data/revju.json      ← 27 reviews
```

---

## Step 1 — Import agencies

```bash
node scripts/import-agencies.js scripts/data/agencije.json
```

- Preserves original `id` and `slug` values from the old project
- Skips any agency that already exists (matched by `id` OR `slug`)
- Safe to re-run — nothing is deleted or overwritten

---

## Step 2 — Import reviews

```bash
node scripts/import-reviews.js scripts/data/revju.json
```

- Skips any review whose `agencyId` is not present in the new DB (logged as `🚫 Skip (no agency)`)
  → If you see many of these, make sure Step 1 ran first
- Skips duplicates by `id`
- Safe to re-run

---

## Expected output (agencies)

```
📂  Loaded 19 agencies from scripts/data/agencije.json
✅  Created:  interim-job  (cmnel7cf40000pds6hlm82tox)
✅  Created:  covebo  (...)
...
─────────────────────────────
  Agencies import complete
  Created : 19
  Skipped : 0
  Errors  : 0
─────────────────────────────
```

## Expected output (reviews)

```
📂  Loaded 27 reviews from scripts/data/revju.json
🏢  Found 19 agencies in current DB
✅  Created review ...  (agency: ...)
...
─────────────────────────────────────
  Reviews import complete
  Created        : 27
  Skipped        : 0  (already existed)
  No agency      : 0  (agencyId missing from DB)
  Errors         : 0
─────────────────────────────────────
```

---

## Troubleshooting

| Message | Cause | Fix |
|---|---|---|
| `🚫 Skip (no agency)` on all reviews | Agencies not imported yet | Run Step 1 first |
| `P1001 Can't reach database` | `.env` / `.env.local` wrong | Check `DATABASE_URL` in both files |
| `Authentication failed` | Wrong password | Update `.env` with correct Supabase password |
| `Prisma Client could not locate Query Engine` | Running in wrong environment | Run on your Mac, not a remote server |
