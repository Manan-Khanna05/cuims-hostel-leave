# CUIMS Hostel Leave Apply

A standalone, mobile-first recreation of the Chandigarh University (CUIMS) hostel
leave page. No backend, no database, no auth — every record lives in the
browser's `localStorage`.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 — `/` redirects to `/leave`.

## Routes

| Route                | Page                                          |
| -------------------- | --------------------------------------------- |
| `/leave`             | Leave Apply — form + Previous Leave           |
| `/leave/details/:id` | Read-only details for one record              |
| `/leave/edit/:id`    | Edit an existing record (updates in place)    |

## Stack

React 18 · Vite 6 · TypeScript · Tailwind CSS 3 · React Router 6 · Framer Motion

## Responsive behaviour

Mobile is the primary target; the desktop layout is a separate arrangement, not
a stretched phone layout.

|                | `< 768px`                            | `>= 768px`                     |
| -------------- | ------------------------------------ | ------------------------------ |
| Header         | `MobileHeader` — hamburger, logo, action icons, avatar | `DesktopHeader` — logo bar + five quick-link cards |
| Form           | One column                           | Two columns                    |
| Field order    | From Date → Time From → To Date → Time To | Dates on one row, times beneath |
| Previous Leave | Stacked `LABEL:-value` record cards  | Real table                     |

The phone field order is the DOM order; the desktop two-column arrangement is
produced with explicit grid placement, so both match the portal without
duplicating the markup. Verified with no horizontal page overflow at 360, 375,
390, 412 and 430px, and at 1024/1280/1440px.

## Behaviour

- **Leave type** — `Day Out` or `NightOut/Leave`; the form swaps without a
  reload. Night Out adds Parents No. / Contact No., pre-filled from the student
  profile and editable, plus the red room-208 warning.
- **Validation** — type, both dates, both times, purpose and the confirmation
  checkbox are required; Night Out also needs two 10-digit numbers. To-date
  cannot precede from-date, and Day Out times must fall inside the configured
  window. Messages appear in red under the field, never via `alert()`.
- **Total days** — derived from the dates, inclusive (same date = 1).
- **Submit** — plays the success popup, then writes the record when **OK** is
  pressed, resets the form and refreshes the list. Newest first.
- **Remarks** — tap a blue remark to open the editor (a sheet on phones, a
  dialog on desktop): pick a status, choose a preset, or type a custom remark.
- **Actions** — View / Edit / Delete on every record; delete confirms first.
- **Edit** — saving updates the existing record and routes to its details page.
  No duplicate row is created. Cancel restores the last saved values.

### Fidelity notes

The success popup reproduces the SweetAlert dialog the live portal uses. Sizes
and colours were taken from the `sweet-alert.css` the site serves: 478px wide,
5px radius, heading `#575757` at 30px/600, body `#797979` at 16px/300, button
`#AEDEF4` at 17px/500, and an 80px icon ring with a 4px `#A5DC86` border.
The header logo is the portal's own `/imgs/logo.png`, and CUIMS uses Roboto.

## Configuration

Everything tunable lives in [`src/constants/app.ts`](src/constants/app.ts) —
the Day Out window (`DAY_OUT_START` / `DAY_OUT_END`), the storage key, the
student profile and the on-page copy. None of it is duplicated elsewhere.

## Storage

Key `cuims_hostel_leaves`, typed by the `Leave` interface in
[`src/types/leave.ts`](src/types/leave.ts).
[`src/services/storage.ts`](src/services/storage.ts) exposes `getLeaves`,
`getLeaveById`, `addLeave`, `updateLeave`, `deleteLeave` and `saveLeaves`.

Sample records seed on first run only — a separate `cuims_hostel_leaves_seeded`
flag means deleting every row will not bring them back. To start over, clear
both keys from DevTools → Application → Local Storage.

## PWA

`public/manifest.webmanifest` declares `display: standalone` with icons
generated from the real logo by `node scripts/make-icons.mjs`. The viewport uses
`viewport-fit=cover` and the header/footer respect `env(safe-area-inset-*)`, so
the page never sits under the OS status bar. The app does not draw a fake status
bar — that area belongs to the OS.

## Deploying

`vercel.json` rewrites all paths to `index.html` so deep links survive a
refresh. Build command `npm run build`, output directory `dist`.
