import type { Filters, Priority, Status, Task } from "../types";
import { PRIORITY_ORDER } from "../data/constants";

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export interface DueDateInfo {
  label: string;
  variant: "normal" | "today" | "overdue";
}

export function getDueDateInfo(dateStr: string): DueDateInfo {
  const t = today();
  if (dateStr === t) return { label: "Due Today", variant: "today" };
  const diff = Math.floor(
    (new Date(dateStr).getTime() - new Date(t).getTime()) / 86_400_000,
  );
  if (diff >= 0) return { label: dateStr, variant: "normal" };
  if (diff < -7)
    return { label: `${Math.abs(diff)}d overdue`, variant: "overdue" };
  return { label: dateStr, variant: "overdue" };
}

export function applyFilters(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status as Status))
      return false;
    if (
      filters.priority.length &&
      !filters.priority.includes(t.priority as Priority)
    )
      return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assigneeId))
      return false;
    if (filters.dateFrom && t.dueDate < filters.dateFrom) return false;
    if (filters.dateTo && t.dueDate > filters.dateTo) return false;
    return true;
  });
}

export function hasActiveFilters(f: Filters): boolean {
  return !!(
    f.status.length ||
    f.priority.length ||
    f.assignee.length ||
    f.dateFrom ||
    f.dateTo
  );
}

export function sortTasks(
  tasks: Task[],
  key: "title" | "priority" | "dueDate",
  dir: 1 | -1,
): Task[] {
  return [...tasks].sort((a, b) => {
    if (key === "title") return dir * a.title.localeCompare(b.title);
    if (key === "priority")
      return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (key === "dueDate") return dir * (a.dueDate > b.dueDate ? 1 : -1);
    return 0;
  });
}

export function serializeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.status.length) p.set("status", f.status.join(","));
  if (f.priority.length) p.set("priority", f.priority.join(","));
  if (f.assignee.length) p.set("assignee", f.assignee.join(","));
  if (f.dateFrom) p.set("dateFrom", f.dateFrom);
  if (f.dateTo) p.set("dateTo", f.dateTo);
  return p.toString();
}

export function parseFiltersFromURL(): Filters {
  const p = new URLSearchParams(window.location.search);
  return {
    status: p.get("status") ? (p.get("status")!.split(",") as Status[]) : [],
    priority: p.get("priority")
      ? (p.get("priority")!.split(",") as Priority[])
      : [],
    assignee: p.get("assignee") ? p.get("assignee")!.split(",") : [],
    dateFrom: p.get("dateFrom") || "",
    dateTo: p.get("dateTo") || "",
  };
}

export const EMPTY_FILTERS: Filters = {
  status: [],
  priority: [],
  assignee: [],
  dateFrom: "",
  dateTo: "",
};
