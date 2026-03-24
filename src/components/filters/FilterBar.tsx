import type { Filters, Priority, Status } from "../../types";
import {
  STATUSES,
  STATUS_LABELS,
  PRIORITIES,
  USERS,
} from "../../data/constants";
import { hasActiveFilters } from "../../utils";

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
}

interface ChipProps {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}

function Chip({ label, active, color, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all duration-150 whitespace-nowrap
        ${
          active
            ? "bg-accent text-black border-accent font-semibold"
            : "bg-surface-2 text-ink-2 border-border hover:border-border-2 hover:text-ink"
        }
      `}
      style={
        active && color
          ? { background: color + "33", color, borderColor: color + "66" }
          : undefined
      }
    >
      {label}
    </button>
  );
}

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const active = hasActiveFilters(filters);

  function toggleStatus(s: Status) {
    onChange({ ...filters, status: toggleItem(filters.status, s) });
  }
  function togglePriority(p: Priority) {
    onChange({ ...filters, priority: toggleItem(filters.priority, p) });
  }
  function toggleAssignee(id: string) {
    onChange({ ...filters, assignee: toggleItem(filters.assignee, id) });
  }

  const PRIORITY_COLORS: Record<Priority, string> = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
  };

  return (
    <div className="flex items-start gap-5 px-5 py-2.5 border-b border-border bg-surface flex-shrink-0 flex-wrap">
      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <span className="font-display font-bold text-[10px] tracking-widest uppercase text-ink-3">
          Status
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              label={STATUS_LABELS[s]}
              active={filters.status.includes(s)}
              onClick={() => toggleStatus(s)}
            />
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <span className="font-display font-bold text-[10px] tracking-widest uppercase text-ink-3">
          Priority
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {PRIORITIES.map((p) => (
            <Chip
              key={p}
              label={p}
              active={filters.priority.includes(p)}
              color={PRIORITY_COLORS[p]}
              onClick={() => togglePriority(p)}
            />
          ))}
        </div>
      </div>

      {/* Assignee */}
      <div className="flex flex-col gap-1.5">
        <span className="font-display font-bold text-[10px] tracking-widest uppercase text-ink-3">
          Assignee
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {USERS.map((u) => (
            <Chip
              key={u.id}
              label={u.initials}
              active={filters.assignee.includes(u.id)}
              color={u.color}
              onClick={() => toggleAssignee(u.id)}
            />
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-col gap-1.5">
        <span className="font-display font-bold text-[10px] tracking-widest uppercase text-ink-3">
          Due From
        </span>
        <input
          type="date"
          className="bg-surface-2 border border-border text-ink rounded-md px-2 py-1 text-[11px] font-mono outline-none hover:border-border-2 focus:border-accent transition-colors"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-display font-bold text-[10px] tracking-widest uppercase text-ink-3">
          Due To
        </span>
        <input
          type="date"
          className="bg-surface-2 border border-border text-ink rounded-md px-2 py-1 text-[11px] font-mono outline-none hover:border-border-2 focus:border-accent transition-colors"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        />
      </div>

      {/* Clear */}
      {active && (
        <div className="flex flex-col gap-1.5">
          <span className="font-display font-bold text-[10px] tracking-widest uppercase text-transparent select-none">
            Clear
          </span>
          <button
            onClick={onClear}
            className="px-3.5 py-1 rounded-full border border-red-500/50 text-red-400 text-[11px] font-mono hover:bg-red-500/10 transition-colors whitespace-nowrap"
          >
            ✕ Clear all
          </button>
        </div>
      )}
    </div>
  );
}
