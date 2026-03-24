import { useState, useRef, useCallback, useEffect } from "react";
import type { Task } from "../../types";

export interface DragState {
  taskId: string;
  fromStatus: string;
  ghost: { x: number; y: number; width: number; height: number } | null;
  overColumn: string | null;
}

interface UseDragDropOptions {
  onDrop: (taskId: string, toStatus: string) => void;
}

export function useDragDrop({ onDrop }: UseDragDropOptions) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const dragTaskRef = useRef<Task | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // ── Drag start via native drag events ────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, task: Task) => {
      dragTaskRef.current = task;
      const rect = e.currentTarget.getBoundingClientRect();
      offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // hide default ghost
      const ghost = new Image();
      ghost.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      e.dataTransfer.setDragImage(ghost, 0, 0);
      e.dataTransfer.effectAllowed = "move";

      setDragState({
        taskId: task.id,
        fromStatus: task.status,
        overColumn: null,
        ghost: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    },
    [],
  );

  // ── Mouse move updates ghost position ────────────────────────────────────
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragState) return;
      setDragState((prev) =>
        prev
          ? {
              ...prev,
              ghost: prev.ghost
                ? {
                    ...prev.ghost,
                    x: e.clientX - offsetRef.current.x,
                    y: e.clientY - offsetRef.current.y,
                  }
                : prev.ghost,
            }
          : null,
      );
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [dragState]);

  // ── Drag over column ──────────────────────────────────────────────────────
  const handleDragOverColumn = useCallback(
    (e: React.DragEvent, colId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverColumn(colId);
    },
    [],
  );

  // ── Drop on column ────────────────────────────────────────────────────────
  const handleDropOnColumn = useCallback(
    (e: React.DragEvent, colId: string) => {
      e.preventDefault();
      if (dragTaskRef.current) {
        onDrop(dragTaskRef.current.id, colId);
      }
      dragTaskRef.current = null;
      setDragState(null);
      setOverColumn(null);
    },
    [onDrop],
  );

  // ── Drag end (snap back if no drop target) ────────────────────────────────
  const handleDragEnd = useCallback(() => {
    dragTaskRef.current = null;
    setDragState(null);
    setOverColumn(null);
  }, []);

  return {
    dragState,
    overColumn,
    dragTask: dragTaskRef.current,
    handleDragStart,
    handleDragOverColumn,
    handleDropOnColumn,
    handleDragEnd,
  };
}
