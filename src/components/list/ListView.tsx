import { useMemo, useState } from "react";
import type { Task, Presence, SortKey, SortDir } from "../../types";
import { USERS, STATUS_LABELS, STATUSES } from "../../data/constants";
import { sortTasks, getDueDateInfo } from "../../utils";
import { Avatar } from "../shared/Avatar";
import { PriorityBadge } from "../shared/PriorityBadge";
import { CollabStack } from "../shared/CollabStack";
import { EmptyState } from "../shared/EmptyState";
import { useVirtualScroll } from "./useVirtualScroll";

interface ListViewProps {
  tasks: Task[];
  presence: Presence;
  onStatusChange: (id: string, status: string) => void;
  onClearFilters: () => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-ink-3 text-[10px]">⇅</span>;
  return <span className="text-accent text-[10px]">{dir > 0 ? "↑" : "↓"}</span>;
}

export function ListView({
  tasks,
  presence,
  onStatusChange,
  onClearFilters,
}: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>(1);

  const sorted = useMemo(
    () => sortTasks(tasks, sortKey, sortDir),
    [tasks, sortKey, sortDir],
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  const {
    viewportRef,
    handleScroll,
    startIndex,
    endIndex,
    totalHeight,
    ROW_HEIGHT,
  } = useVirtualScroll(sorted.length);

  if (!tasks.length) {
    return (
      <div className="flex-1 flex items-center justify-center px-5">
        <EmptyState
          icon="🔍"
          title="No tasks match your filters"
          subtitle="Try clearing some filters to see more tasks"
          action={{ label: "Clear filters", onClick: onClearFilters }}
        />
      </div>
    );
  }

  const colClass = "grid grid-cols-[2fr_110px_100px_120px_180px]";

  return (
    <div className="flex-1 flex flex-col px-5 pb-5 min-h-0 gap-2">
      <div className="flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`${colClass} border-b border-border bg-surface-2 flex-shrink-0`}
        >
          {(
            [
              { key: "title" as SortKey, label: "Title" },
              { key: "priority" as SortKey, label: "Priority" },
              { key: null, label: "Status" },
              { key: "dueDate" as SortKey, label: "Due Date" },
              { key: null, label: "Assignee" },
            ] as { key: SortKey | null; label: string }[]
          ).map(({ key, label }) => (
            <div
              key={label}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 font-display font-bold text-[11px] tracking-widest uppercase select-none
                ${key ? "cursor-pointer hover:text-ink-2 transition-colors" : "cursor-default"}
                ${key && sortKey === key ? "text-accent" : "text-ink-3"}
              `}
              onClick={() => key && toggleSort(key)}
            >
              {label}
              {key && <SortIcon active={sortKey === key} dir={sortDir} />}
            </div>
          ))}
        </div>

        {/* Virtual scroll viewport */}
        <div
          ref={viewportRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="relative" style={{ height: totalHeight }}>
            {sorted.slice(startIndex, endIndex + 1).map((task, i) => {
              const idx = startIndex + i;
              const assignee = USERS.find((u) => u.id === task.assigneeId);
              const { label, variant } = getDueDateInfo(task.dueDate);
              const collabUsers = USERS.filter(
                (u) => presence[u.id] === task.id,
              );
              const dueCls =
                variant === "today"
                  ? "text-yellow-400"
                  : variant === "overdue"
                    ? "text-red-400"
                    : "text-ink-3";

              return (
                <div
                  key={task.id}
                  className={`${colClass} absolute w-full border-b border-border hover:bg-surface-2 transition-colors`}
                  style={{ top: idx * ROW_HEIGHT, height: ROW_HEIGHT }}
                >
                  {/* Title */}
                  <div className="px-3.5 flex items-center gap-2 overflow-hidden">
                    {collabUsers.length > 0 && (
                      <CollabStack
                        users={collabUsers}
                        borderColor="#141618"
                        size={16}
                      />
                    )}
                    <span className="text-[13px] font-medium text-ink truncate">
                      {task.title}
                    </span>
                  </div>
                  {/* Priority */}
                  <div className="px-3.5 flex items-center">
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {/* Status */}
                  <div className="px-3.5 flex items-center">
                    <select
                      className="bg-surface-3 border border-border text-ink rounded-md px-2 py-1 text-[12px] font-body cursor-pointer outline-none hover:border-border-2 transition-colors"
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Due date */}
                  <div className="px-3.5 flex items-center">
                    <span className={`text-[12px] font-mono ${dueCls}`}>
                      {label}
                    </span>
                  </div>
                  {/* Assignee */}
                  <div className="px-3.5 flex items-center gap-2">
                    {assignee && (
                      <Avatar user={assignee} size={22} borderColor="#141618" />
                    )}
                    <span className="text-[12px] text-ink-2 truncate">
                      {assignee?.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-[11px] font-mono text-ink-3 flex-shrink-0">
        {sorted.length} tasks · virtual scroll active · rendering{" "}
        {Math.min(endIndex - startIndex + 1, sorted.length)} rows
      </div>
    </div>
  );
}
