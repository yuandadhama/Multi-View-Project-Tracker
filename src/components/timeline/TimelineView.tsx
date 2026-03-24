import { useMemo } from "react";
import type { Task } from "../../types";

import { EmptyState } from "../shared/EmptyState";
import { PRIORITY_BAR_COLORS } from "../../data/constants";

const DAY_W = 34;

interface TimelineViewProps {
  tasks: Task[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDay = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthStart = new Date(year, month, 1).toISOString().split("T")[0];
  const monthEnd = new Date(year, month, daysInMonth)
    .toISOString()
    .split("T")[0];

  const monthName = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const visible = useMemo(
    () =>
      tasks.filter((t) => {
        const start = t.startDate || t.dueDate;
        return t.dueDate >= monthStart && start <= monthEnd;
      }),
    [tasks, monthStart, monthEnd],
  );

  const totalTrackWidth = daysInMonth * DAY_W;
  const todayLeft = (todayDay - 1) * DAY_W + DAY_W / 2;

  function clampDay(d: number) {
    return Math.max(1, Math.min(d, daysInMonth));
  }

  return (
    <div className="flex-1 flex flex-col px-5 pb-5 min-h-0 gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-display font-bold text-sm text-ink-2">
          {monthName}
        </span>
        <span className="text-[11px] font-mono text-ink-3">
          {visible.length} tasks
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono text-ink-3">
            Today: {monthName.split(" ")[0]} {todayDay}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-auto">
        <div style={{ minWidth: 200 + totalTrackWidth }}>
          {/* Column header */}
          <div className="flex border-b border-border sticky top-0 bg-surface z-10">
            <div className="w-[200px] flex-shrink-0 px-3.5 py-2 font-display font-bold text-[11px] tracking-widest uppercase text-ink-3 border-r border-border">
              Task
            </div>
            <div className="flex">
              {days.map((d) => (
                <div
                  key={d}
                  className={`flex-shrink-0 flex items-center justify-center font-mono text-[10px] py-2 border-r border-border
                    ${d === todayDay ? "text-accent font-bold" : "text-ink-3"}
                  `}
                  style={{ width: DAY_W }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {visible.length === 0 && (
            <EmptyState
              icon="📅"
              title="No tasks this month"
              subtitle="Tasks with due dates in the current month will appear here"
            />
          )}

          {/* Task rows */}
          {visible.map((task) => {
            const dueDay = new Date(task.dueDate).getDate();
            const startDay = task.startDate
              ? new Date(task.startDate).getDate()
              : dueDay;
            const cStart = clampDay(startDay);
            const cEnd = clampDay(dueDay);
            const barLeft = (cStart - 1) * DAY_W;
            const barWidth = Math.max(DAY_W, (cEnd - cStart + 1) * DAY_W);
            const isSingleDay = !task.startDate || cStart === cEnd;
            const barColor = PRIORITY_BAR_COLORS[task.priority];

            return (
              <div
                key={task.id}
                className="flex border-b border-border hover:bg-surface-2 transition-colors"
                style={{ height: 40 }}
              >
                {/* Label */}
                <div
                  className="w-[200px] flex-shrink-0 px-3.5 flex items-center border-r border-border"
                  title={task.title}
                >
                  <span className="text-[12px] text-ink-2 truncate">
                    {task.title}
                  </span>
                </div>
                {/* Track */}
                <div
                  className="flex-1 relative flex"
                  style={{ width: totalTrackWidth }}
                >
                  {/* Today vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                    style={{
                      left: todayLeft,
                      background: "#6ee7b7",
                      boxShadow: "0 0 8px rgba(110,231,183,0.5)",
                    }}
                  />
                  {/* Day grid */}
                  {days.map((d) => (
                    <div
                      key={d}
                      className="flex-shrink-0 h-full border-r border-border"
                      style={{
                        width: DAY_W,
                        background:
                          d === todayDay ? "rgba(110,231,183,0.04)" : undefined,
                      }}
                    />
                  ))}
                  {/* Bar or marker */}
                  {isSingleDay ? (
                    <div
                      className="absolute rounded-full z-20"
                      style={{
                        left: barLeft + DAY_W / 2 - 5,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 10,
                        height: 10,
                        background: barColor,
                      }}
                    />
                  ) : (
                    <div
                      className="absolute z-20 rounded flex items-center px-2 overflow-hidden"
                      style={{
                        left: barLeft,
                        width: barWidth,
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: 22,
                        background: barColor,
                      }}
                      title={task.title}
                    >
                      {barWidth > 64 && (
                        <span className="text-[10px] font-mono font-semibold text-white/90 truncate">
                          {task.title.slice(0, 22)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
