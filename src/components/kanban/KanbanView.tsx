import React from "react";
import type { Task, Presence } from "../../types";
import { KANBAN_COLUMNS } from "../../data/constants";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { useDragDrop } from "./useDragDrop";

interface KanbanViewProps {
  tasks: Task[];
  presence: Presence;
  onStatusChange: (id: string, status: string) => void;
}

export function KanbanView({
  tasks,
  presence,
  onStatusChange,
}: KanbanViewProps) {
  const {
    dragState,
    overColumn,
    dragTask,
    handleDragStart,
    handleDragOverColumn,
    handleDropOnColumn,
    handleDragEnd,
  } = useDragDrop({ onDrop: onStatusChange });

  const tasksByCol = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    KANBAN_COLUMNS.forEach((c) => {
      map[c.id] = [];
    });
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <>
      <div className="flex gap-3.5 px-5 pb-5 overflow-x-auto flex-1 min-h-0">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            tasks={tasksByCol[col.id] || []}
            presence={presence}
            isDragOver={
              overColumn === col.id && dragState?.fromStatus !== col.id
            }
            draggingTaskId={dragState?.taskId ?? null}
            onDragOverColumn={handleDragOverColumn}
            onDropOnColumn={handleDropOnColumn}
            // onDragLeave={() => {}}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Custom floating ghost card */}
      {dragTask && dragState?.ghost && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: dragState.ghost.x,
            top: dragState.ghost.y,
            width: dragState.ghost.width,
          }}
        >
          <TaskCard task={dragTask} presence={{}} isGhost />
        </div>
      )}
    </>
  );
}
