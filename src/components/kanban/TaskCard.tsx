import React from "react";
import type { Task, Presence } from "../../types";
import { USERS } from "../../data/constants";
import { getDueDateInfo } from "../../utils";
import { Avatar } from "../shared/Avatar";
import { PriorityBadge } from "../shared/PriorityBadge";
import { CollabStack } from "../shared/CollabStack";

interface TaskCardProps {
  task: Task;
  presence: Presence;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd?: () => void;
  isGhost?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function TaskCard({
  task,
  presence,
  isDragging = false,
  onDragStart,
  onDragEnd,
  isGhost = false,
  style,
  className = "",
}: TaskCardProps) {
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const { label, variant } = getDueDateInfo(task.dueDate);
  const collabUsers = USERS.filter((u) => presence[u.id] === task.id);

  const dueCls =
    variant === "today"
      ? "text-yellow-400"
      : variant === "overdue"
        ? "text-red-400"
        : "text-ink-3";

  return (
    <div
      className={`
        rounded-xl border p-3 select-none
        transition-all duration-150
        bg-surface-2 border-border
        ${
          isGhost
            ? "cursor-grabbing rotate-[1.5deg] shadow-2xl scale-[1.01] !opacity-95"
            : isDragging
              ? "opacity-40 cursor-grabbing"
              : "cursor-grab hover:-translate-y-px hover:shadow-lg hover:border-border-2 animate-fadeUp"
        }
        ${className}
      `}
      draggable={!isGhost}
      onDragStart={onDragStart ? (e) => onDragStart(e, task) : undefined}
      onDragEnd={onDragEnd}
      style={style}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-[13px] font-medium text-ink leading-snug mb-3">
        {task.title}
      </p>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-mono ${dueCls}`}>{label}</span>
        <div className="flex items-center gap-1">
          {collabUsers.length > 0 && (
            <CollabStack users={collabUsers} borderColor="#1c1e22" size={18} />
          )}
          {assignee && (
            <Avatar user={assignee} size={22} borderColor="#1c1e22" />
          )}
        </div>
      </div>
    </div>
  );
}
