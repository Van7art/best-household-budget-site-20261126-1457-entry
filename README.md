# Envelope Budget — Every Dollar Has a Job

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Van7art/best-household-budget-site-20261126-1457-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Van7art/best-household-budget-site-20261126-1457-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site for the make.fun bounty **best-household-budget-site-20261126-1457**
("Make the best household budget site").

The Alvarez family earns $5,850 a month. Envelope Budget splits that money into eight
envelopes — Rent, Groceries, Transport, Utilities, Dining Out, Fun Money, Clothing and
Household — plus a savings goal, and shows at a glance what is assigned, what is spent,
and what is still left to give a job.

## What it does

- **Dashboard** — "money to assign" hero, month overview cards (income $5,850, assigned
  $5,210, spent $4,210, left to assign $640), envelope fill overview, upcoming bills strip,
  recent activity.
- **Envelopes** — 8 envelopes with assigned / spent / remaining, fill bars, working
  Fund (+$25) and Adjust buttons, and a red over-spent state with a "cover overspend"
  action (Dining Out is over budget this month).
- **Transactions** — 31 real November 2026 rows, an add-transaction form that adds a row
  and deducts from the right envelope, envelope filter, search, and delete. Everything
  persists to localStorage; a "Reset demo data" button restores the seed.
- **50/30/20 Planner** — enter monthly income, slide Needs / Wants / Savings, see live
  bars and suggested amounts next to the actual envelope totals, and "Apply plan" scales
  the envelopes to match.
- **Bills** — November and December 2026 bill lists with due dates and amounts, working
  mark-paid buttons and autopay toggles.
- **Reports** — spending-by-envelope bar chart (inline SVG), month-over-month trend
  (Sep–Nov), and a rollover summary into December.

## How to run

No build step, no network requests, no external fonts or images.

```sh
node serve.ts          # serves app/ on http://localhost:8080
node serve.ts --port 8122
```

Or open `app/index.html` directly in a browser (hash routes work from `file://` too,
but the local server is the reliable path).

## How to build the submission dossier

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` into the output directory and writes
`dossier.json` with the vendored make.fun library.

## Tech

Plain HTML, CSS and JavaScript in `app/` (`index.html`, `style.css`, `app.js`,
`data.js`). All charts are inline SVG/CSS. Design: deep navy `#14213d` with amber
accent `#f4a259`, responsive down to phone width (nav collapses, cards stack).

<sub>Entered on [make.fun](https://make.fun/?ref=4e96xqxt&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
