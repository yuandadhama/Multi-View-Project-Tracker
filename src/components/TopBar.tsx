import type { ViewType, Presence } from "../types";
import { USERS } from "../data/constants";
import { Avatar } from "./shared/Avatar";

interface TopBarProps {
  view: ViewType;
  onViewChange: (v: ViewType) => void;
  presence: Presence;
  totalTasks: number;
  filteredCount: number;
}

const VIEWS: { id: ViewType; label: string; icon: string }[] = [
  { id: "kanban", label: "Kanban", icon: "⊞" },
  { id: "list", label: "List", icon: "≡" },
  { id: "timeline", label: "Timeline", icon: "⎲" },
];

export function TopBar({
  view,
  onViewChange,
  presence,
  totalTasks,
  filteredCount,
}: TopBarProps) {
  const activeUserIds = [...new Set(Object.values(presence))];
  const activeUsers = USERS.filter((u) => Object.keys(presence).includes(u.id));

  return (
    <header className="flex items-center gap-4 px-5 py-3 border-b border-border bg-surface flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-black font-display font-black text-sm leading-none">
            F
          </span>
        </div>
        <span className="font-display font-extrabold text-lg tracking-tight">
          Flow<span className="text-ink-3">Board</span>
        </span>
      </div>

      {/* View tabs */}
      <nav className="flex gap-1 bg-surface-2 rounded-lg p-1">
        {VIEWS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-display font-semibold
              transition-all duration-150
              ${
                view === id
                  ? "bg-surface-3 text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink-2"
              }
            `}
          >
            <span className="text-[13px]">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Task count badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-border">
        <span className="font-mono text-[11px] text-accent font-medium">
          {filteredCount}
        </span>
        {filteredCount !== totalTasks && (
          <>
            <span className="text-ink-3 text-[10px]">/</span>
            <span className="font-mono text-[11px] text-ink-3">
              {totalTasks}
            </span>
          </>
        )}
        <span className="font-mono text-[11px] text-ink-3 ml-0.5">tasks</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collab presence bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono text-ink-3">
            {activeUsers.length} viewing
          </span>
        </div>
        <div className="flex items-center">
          {activeUsers.map((u, i) => (
            <Avatar
              key={u.id}
              user={u}
              size={28}
              borderColor="#141618"
              className={i > 0 ? "-ml-2" : ""}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
