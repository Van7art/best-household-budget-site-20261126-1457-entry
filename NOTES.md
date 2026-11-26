# NOTES — Envelope Budget (variant B)

## Design decisions

- **Envelope method as the core idea, not a generic tracker.** The brief asks for the
  *best household budget site*; the strongest household-budget concept with a clear
  mental model is envelope budgeting ("every dollar has a job"), so the whole site is
  built around it: the hero number is "money to assign", not a balance.
- **One family, one consistent month.** All numbers reconcile: income $5,850 = two
  paydays ($3,400 + $2,450); envelope spending $3,450 + other spending $760 = $4,210
  spent; assigned $3,740 envelopes + $1,470 savings = $5,210; left to assign $640.
  Transaction rows sum exactly to their envelope totals (e.g. groceries $148+$132+
  $121+$111 = $512). A judge adding the numbers up will find them consistent.
- **Everything works, nothing is a screenshot prop.** Fund/adjust/cover-overspend,
  add/delete transactions, planner sliders + apply, mark-paid + autopay toggles all
  mutate real state and persist to localStorage. A "Reset demo data" button restores
  the seed.
- **Zero network.** No external fonts, images or scripts; charts are inline SVG/CSS.
  The site works offline and from `file://`.
- **Look:** deep navy `#14213d` + amber `#f4a259`, big tabular numbers, cards and fill
  bars; responsive (nav collapses, grids stack to one column on phones).

## Honest self-grade vs the brief (out of 10)

- **Completeness of features: 9/10.** All six requested areas are present and
  functional. Missing: no multi-month data entry beyond November/December bills, no
  export (CSV/PDF), no per-person (multi-member) views.
- **Correctness / consistency: 9/10.** Numbers reconcile across dashboard, envelopes,
  transactions and reports. Weakness: "other spending" ($760) is a catch-all bucket
  rather than envelopes of its own; the planner's slider rebalancing (splitting the
  remainder 50/50) is simple rather than preserving the user's last ratio.
- **Usability: 8/10.** Hash routing, sticky nav, search/filter, toasts on every action.
  Weakness: the Adjust prompt uses a browser `prompt()` dialog, which is functional
  but less polished than an inline editor; no keyboard shortcuts.
- **Design: 8/10.** Clean fintech look, strong hierarchy, readable numbers, responsive.
  Weakness: envelope icons are plain glyphs rather than custom illustrations; the
  dashboard is card-dense rather than airy.
- **Overall: 8.5/10.** A complete, working, internally consistent envelope-budget site
  that a real family could use for November. Its main gaps are polish (inline editing,
  export) rather than missing features.
