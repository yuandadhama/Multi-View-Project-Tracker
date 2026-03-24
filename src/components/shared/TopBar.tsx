import type { ViewType, Presence } from "../../types";
import { USERS } from "../../data/constants";
import { Avatar } from "../shared/Avatar";

interface TopBarProps {
  view: ViewType;
  onViewChange: (v: ViewType) => void;
  presence: Presence;
}

const VIEWS: { id: ViewType; label: string; icon: string }[] = [
  { id: "kanban", label: "Kanban", icon: "⊞" },
  { id: "list", label: "List", icon: "≡" },
  { id: "timeline", label: "Timeline", icon: "⎲" },
];

export function TopBar({ view, onViewChange, presence }: TopBarProps) {
  const activeUserIds = [...new Set(Object.values(presence))]
    .map((taskId) =>
      Object.entries(presence)
        .filter(([, tid]) => tid === taskId)
        .map(([uid]) => uid),
    )
    .flat();
  const uniqueActiveIds = [...new Set(activeUserIds)];
  const activeUsers = USERS.filter((u) => uniqueActiveIds.includes(u.id));

  return (
    <header className="flex items-center gap-4 px-5 py-3 border-b border-border bg-surface flex-shrink-0">
      {/* Logo */}
      <div className="font-display font-extrabold text-xl tracking-tight">
        <span className="text-accent">Flow</span>
        <span className="text-ink-3">Board</span>
      </div>

      {/* View switcher */}
      <nav className="flex gap-1 bg-surface-2 rounded-lg p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={`
              px-4 py-1.5 rounded-md text-[12px] font-display font-semibold transition-all
              ${
                view === v.id
                  ? "bg-surface-3 text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink-2"
              }
            `}
          >
            <span className="mr-1.5">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </nav>

      {/* Collab indicator */}
      <div className="ml-auto flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
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
        <span className="text-[12px] text-ink-3 font-mono">
          {activeUsers.length} viewing
        </span>
      </div>
    </header>
  );
}
