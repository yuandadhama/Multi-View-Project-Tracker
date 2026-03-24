export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';
export type ViewType = 'kanban' | 'list' | 'timeline';
export type SortKey = 'title' | 'priority' | 'dueDate';
export type SortDir = 1 | -1;

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  dueDate: string;   // ISO yyyy-mm-dd
  startDate: string | null;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateFrom: string;
  dateTo: string;
}

// presence: userId -> taskId
export type Presence = Record<string, string>;
