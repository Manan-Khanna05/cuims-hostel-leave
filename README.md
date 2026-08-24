# Hostel Leave Apply

A standalone recreation of the Chandigarh University hostel leave portal. No backend — every
record lives in the browser's `localStorage`.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173 — it redirects to `/leave`.

## Routes

| Route                 | Page                                            |
| --------------------- | ----------------------------------------------- |
| `/leave`              | Leave Apply — form + Previous Leave table       |
| `/leave/details/:id`  | Read-only details for one record                |
| `/leave/edit/:id`     | Edit an existing record (updates in place)      |

## Stack

React 18 · Vite 6 · TypeScript · Tailwind CSS 3 · React Router 6 · Framer Motion · Lucide

## How it works

- **Leave type** — `Day Out` or `NightOut/Leave`. The form swaps fields without a reload;
  Night Out adds Parents No. / Contact No. (pre-filled from the student profile, editable).
- **Validation** — leave type, both dates, both times, purpose, and the confirmation
  checkbox are required. Night Out also requires two 10-digit phone numbers. The to-date
  cannot precede the from-date, and Day Out times must fall inside 4:30 PM – 7:00 PM.
  Messages appear in red under the offending field after the first submit attempt.
- **Total days** — derived from the two dates, inclusive (same date = 1, consecutive = 2).
- **Submit** — a Framer Motion success modal plays (overlay → circle → tick → heading →
  button). The record is written to storage when **OK** is pressed, then the form resets and
  the table refreshes.
- **Previous Leave** — click a blue remark to edit it inline: pick a preset, type custom
  text, and set the status. Row actions are View / Edit / Delete (delete asks first).
- **Edit** — saving updates the existing record and routes to its read-only details page.
  No duplicate row is created. Cancel restores the last saved values without navigating.

### Storage

Key `cu_hostel_leaves_v1`, typed by the `Leave` interface in `src/types/leave.ts`.
`src/services/storage.ts` exposes `getLeaves`, `saveLeaves`, `addLeave`, `updateLeave`,
`deleteLeave`, and `getLeaveById`. Ten sample rows are seeded on first run only — a separate
`cu_hostel_leaves_seeded_v1` flag means clearing every row will not resurrect them.

To start over, clear both keys from DevTools → Application → Local Storage.

## Deploying

`vercel.json` rewrites all paths to `index.html` so the deep routes work on refresh.

```bash
npx vercel --prod
```

Build command `npm run build`, output directory `dist`.
