# FlowBoard — Multi-View Project Tracker

A fully featured project management frontend built with **React 18 + TypeScript + Tailwind CSS + Vite**.

---

## Setup Instructions

### Prerequisites

- Node.js **18+** (check with `node -v`)
- npm 9+ (comes with Node 18)

### Install & Run

```bash
# 1. Unzip and enter the project
unzip flowboard.zip
cd flowboard

# 2. Install dependencies (Vite-based — no peer dep conflicts)
npm install

# 3. Start the dev server
npm run dev
# → Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serves the production build locally
```

### Troubleshooting

| Problem                       | Fix                                               |
| ----------------------------- | ------------------------------------------------- |
| `npm install` peer dep errors | Use `npm install --legacy-peer-deps`              |
| Port 5173 in use              | `npm run dev -- --port 3000`                      |
| Fonts not loading             | Check your internet connection (Google Fonts CDN) |

---

## State Management — Why `useReducer` + Context

This project uses **React Context + `useReducer`** (`src/store/AppStore.tsx`) rather than Zustand or Redux.

### Decision rationale

The application state has exactly three concerns:

```
{ tasks: Task[], filters: Filters, view: ViewType }
```

That's it. No async data fetching, no optimistic updates, no middleware pipeline, no cross-slice selectors. For a shape this flat, `useReducer` wins on every axis:

- **Explicitness** — every mutation is a named, typed action (`SET_TASK_STATUS`, `SET_FILTERS`, `SET_VIEW`, `CLEAR_FILTERS`). You can read the reducer like a changelog.
- **Zero dependencies** — Zustand adds ~1.1 kB gzipped. Not catastrophic, but unnecessary when the built-in primitive does the same job cleanly.
- **Debuggability** — because all state flows through a single `dispatch`, you can log every action trivially. No devtools plugin required.
- **Testability** — the reducer is a pure function. Unit testing state transitions is a single `expect(reducer(state, action)).toEqual(nextState)` call.

### When I'd switch to Zustand

If the app grew to include: async API calls that need loading/error state per-resource, derived selectors that need memoization across many component subtrees, or cross-cutting concerns like persistence middleware — Zustand's slice pattern and built-in subscriptions would pull ahead. The threshold is roughly when `useMemo` starts appearing everywhere to compensate for Context re-renders.

---

## Virtual Scrolling — Implementation Explained

**File:** `src/components/list/useVirtualScroll.ts`

### The core problem

Rendering 500 DOM nodes at once is fine on a fast machine, but causes paint jank on mid-range hardware and breaks on mobile. The goal: keep the DOM small (20–30 rows) while the scrollbar behaves as if all 500 rows are present.

### How it works

```
┌──────────────────────────────┐  ← scroll viewport (overflow-y: auto)
│                              │
│  ┌────────────────────────┐  │  ← inner container (height = 500 × 44px = 22,000px)
│  │  [invisible padding]   │  │    This tall container is what makes the scrollbar correct.
│  │                        │  │
│  │  row 12  ← top buffer  │  │  ← absolute positioned, top = 12 × 44
│  │  row 13                │  │
│  │  row 14  ← visible     │  │
│  │  ...                   │  │
│  │  row 28  ← visible     │  │
│  │  row 29  ← btm buffer  │  │
│  │                        │  │
│  │  [invisible padding]   │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

**Step-by-step:**

1. **Track scroll position** — an `onScroll` handler records `scrollTop` into state.
2. **Track viewport height** — a `ResizeObserver` on the viewport element records its pixel height. This updates if the window resizes.
3. **Compute window** — `startIndex = floor(scrollTop / ROW_HEIGHT) - BUFFER` and `endIndex = ceil((scrollTop + viewHeight) / ROW_HEIGHT) + BUFFER`. Buffer is 5 rows, so fast scrolling never shows blank space.
4. **Render only the slice** — `tasks.slice(startIndex, endIndex + 1)` are rendered as `position: absolute` divs, each with `top: index × ROW_HEIGHT`.
5. **Preserve scroll math** — the inner container has `height: totalCount × ROW_HEIGHT`, making the browser's scrollbar represent the full dataset even though only ~20 nodes are in the DOM.

### Why not `position: sticky` headers or grouped rows?

They complicate the absolute-position math. For a flat list, absolute placement is the simplest correct solution. Grouped rows would require variable-height virtual scrolling (tracking cumulative offsets), which adds significant complexity for no user-visible benefit here.

---

## Drag & Drop — Implementation Explained

**Files:** `src/components/kanban/useDragDrop.ts`, `KanbanView.tsx`, `KanbanColumn.tsx`, `TaskCard.tsx`

### No libraries used

No `react-beautiful-dnd`, no `dnd-kit`, no SortableJS. Implementation uses the browser's native **HTML Drag and Drop API** supplemented by a `mousemove` listener for the custom ghost.

### Why the native API?

The native API fires reliably on both mouse and touch (with `draggable={true}`) and handles all the cross-browser edge cases around drag initiation. The only thing it can't do well is render a custom ghost image — so we suppress the default ghost and draw our own.

### Architecture

```
useDragDrop hook
  ├── dragState: { taskId, fromStatus, ghost: {x, y, w, h} } | null
  ├── overColumn: string | null
  ├── handleDragStart(e, task)     ← called from TaskCard
  ├── handleDragOverColumn(e, col) ← called from KanbanColumn
  ├── handleDropOnColumn(e, col)   ← called from KanbanColumn
  └── handleDragEnd()              ← called from TaskCard / window
```

### Sequence of events

1. **`dragstart`** (on the card) — records the dragged task + initial bounding rect. Suppresses the browser's default ghost via `e.dataTransfer.setDragImage(emptyImg, 0, 0)`.
2. **`mousemove`** (on `window`) — updates `ghost.x/y` so the custom floating card follows the cursor. The offset is calculated from where the user grabbed the card (not the card's top-left corner), so the card doesn't "jump" on pickup.
3. **`dragover`** (on each column) — calls `e.preventDefault()` to make the column a valid drop target, and sets `overColumn`.
4. **`drop`** (on a column) — calls `onDrop(taskId, colId)` which dispatches `SET_TASK_STATUS` to the store.
5. **`dragend`** (on the card) — clears all drag state. If the user drops outside any column, this fires without a preceding `drop`, so the card snaps back automatically.

### Placeholder without layout shift

The dragging card is **not removed from the DOM** — it stays in its column at 40% opacity. This means the column's height doesn't change during the drag, so no layout shift occurs. The column receiving the drag shows an **additional** placeholder div (dashed border, fixed 90px height) inserted at the top of the drop zone. This placeholder is a separate element — it doesn't replace anything. When the drop lands, the task's status updates and React reconciles the columns, which removes the placeholder and repositions the card naturally.

The custom ghost is rendered via a `position: fixed` div in `KanbanView` — it's outside the column DOM entirely, so it has zero effect on column layout.

---

## Explanation (Submission Field)

**Hardest UI problem:** The drag-and-drop ghost card was the most difficult piece. The browser's native drag ghost is a static screenshot that can't be styled — so I suppressed it entirely using `setDragImage(emptyImg, 0, 0)` and built a custom ghost: a `position: fixed` clone of the card rendered in `KanbanView`, positioned via a `mousemove` listener that tracks `clientX/Y` offset from the grab point. Getting the pickup offset right (so the card doesn't snap to the cursor's top-left corner) required capturing the grab coordinates relative to the card's bounding rect at `dragstart`.

**Placeholder without layout shift:** The dragging card stays in its original column with `opacity: 0.4` — it is never removed from the DOM mid-drag. This is what prevents layout shift: the column height is unchanged because the card still occupies its space. The target column shows an _additional_ fixed-height placeholder div that appears alongside the existing cards, not replacing anything. When the drop commits, React reconciles both columns in a single state update, so there is no intermediate empty-column flash.

**One refactor with more time:** The collab presence propagation (`Presence` as a prop drilled through `KanbanView → KanbanColumn → TaskCard`) works fine at this depth but would become brittle in a larger tree. I'd lift `presence` into the Context store so any component can subscribe to it directly via `useAppStore()`, eliminating the prop chain and making it easier to add presence indicators to future views like Timeline without touching intermediate components.

---
