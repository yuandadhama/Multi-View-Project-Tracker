import React from "react";
import type { Task, Presence } from "../../types";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "../shared/EmptyState";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  tasks: Task[];
  presence: Presence;
  isDragOver: boolean;
  draggingTaskId: string | null;
  onDragOverColumn: (e: React.DragEvent, colId: string) => void;
  onDropOnColumn: (e: React.DragEvent, colId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: () => void;
}

export function KanbanColumn({
  id,
  label,
  color,
  tasks,
  presence,
  isDragOver,
  draggingTaskId,
  onDragOverColumn,
  onDropOnColumn,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  return (
    <div
      className={`
        flex-shrink-0 w-[272px] flex flex-col rounded-2xl border transition-all duration-150
        ${isDragOver ? "border-accent/60 bg-accent/[0.03]" : "border-border bg-surface"}
      `}
      onDragOver={(e) => onDragOverColumn(e, id)}
      onDrop={(e) => onDropOnColumn(e, id)}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border flex-shrink-0">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span
          className="font-display font-bold text-[11px] tracking-widest uppercase flex-1"
          style={{ color }}
        >
          {label}
        </span>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-ink-3">
          {tasks.length}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 min-h-[80px]">
        {isDragOver && (
          <div
            className="rounded-xl border-2 border-dashed bg-surface-3 flex-shrink-0"
            style={{ height: 90, borderColor: color + "66" }}
          />
        )}
        {tasks.length === 0 && !isDragOver ? (
          <EmptyState
            icon="⬜"
            title="No tasks here"
            subtitle="Drag cards in or adjust filters"
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              presence={presence}
              isDragging={draggingTaskId === task.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}
