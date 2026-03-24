import type { User, Priority, Status } from "../types";

export const USERS: User[] = [
  { id: "u1", name: "Alice Kim", initials: "AK", color: "#6ee7b7" },
  { id: "u2", name: "Ben Torres", initials: "BT", color: "#60a5fa" },
  { id: "u3", name: "Clara Dahl", initials: "CD", color: "#f472b6" },
  { id: "u4", name: "Dev Patel", initials: "DP", color: "#a78bfa" },
  { id: "u5", name: "Elena Moura", initials: "EM", color: "#fb923c" },
  { id: "u6", name: "Finn Larsen", initials: "FL", color: "#fbbf24" },
];

export const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

export const STATUSES: Status[] = ["todo", "in-progress", "in-review", "done"];

export const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

export const KANBAN_COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "#6366f1" },
  { id: "in-progress", label: "In Progress", color: "#f59e0b" },
  { id: "in-review", label: "In Review", color: "#8b5cf6" },
  { id: "done", label: "Done", color: "#10b981" },
];

export const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export const PRIORITY_STYLES: Record<
  Priority,
  { bg: string; text: string; border: string }
> = {
  Critical: {
    bg: "rgba(239,68,68,0.15)",
    text: "#f87171",
    border: "rgba(239,68,68,0.3)",
  },
  High: {
    bg: "rgba(249,115,22,0.15)",
    text: "#fb923c",
    border: "rgba(249,115,22,0.3)",
  },
  Medium: {
    bg: "rgba(234,179,8,0.15)",
    text: "#fbbf24",
    border: "rgba(234,179,8,0.3)",
  },
  Low: {
    bg: "rgba(34,197,94,0.15)",
    text: "#4ade80",
    border: "rgba(34,197,94,0.3)",
  },
};

export const PRIORITY_BAR_COLORS: Record<Priority, string> = {
  Critical: "rgba(239,68,68,0.8)",
  High: "rgba(249,115,22,0.75)",
  Medium: "rgba(234,179,8,0.75)",
  Low: "rgba(34,197,94,0.75)",
};
