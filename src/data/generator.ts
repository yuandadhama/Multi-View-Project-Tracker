import type { Task, Priority, Status } from "../types";
import { USERS, PRIORITIES, STATUSES } from "./constants";

const TASK_VERBS = [
  "Implement",
  "Refactor",
  "Design",
  "Fix",
  "Update",
  "Migrate",
  "Review",
  "Deploy",
  "Test",
  "Optimize",
  "Document",
  "Integrate",
  "Build",
  "Configure",
  "Audit",
  "Create",
  "Enhance",
  "Debug",
  "Validate",
  "Monitor",
];
const TASK_NOUNS = [
  "authentication flow",
  "dashboard components",
  "API endpoints",
  "database schema",
  "payment gateway",
  "user onboarding",
  "notification system",
  "caching layer",
  "search functionality",
  "CI/CD pipeline",
  "error handling",
  "data export",
  "mobile layout",
  "performance metrics",
  "accessibility audit",
  "rate limiting",
  "webhook integration",
  "admin panel",
  "dark mode",
  "SSO support",
  "analytics pipeline",
  "file upload system",
  "email templates",
  "localization support",
  "A/B testing",
  "batch processing",
  "audit logs",
  "two-factor auth",
  "content moderation",
  "real-time sync",
  "GraphQL schema",
  "REST documentation",
  "Kubernetes config",
  "Redis integration",
  "S3 storage layer",
  "OAuth2 flow",
  "billing module",
  "user permissions",
  "feature flags",
];

function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rndInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTasks(count = 500): Task[] {
  const now = new Date();
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const daysOffset = rndInt(-30, 45);
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + daysOffset);

    const hasStart = Math.random() > 0.15;
    let startDate: string | null = null;
    if (hasStart) {
      const sd = new Date(dueDate);
      sd.setDate(sd.getDate() - rndInt(1, 20));
      startDate = sd.toISOString().split("T")[0];
    }

    tasks.push({
      id: `t${i + 1}`,
      title: `${rnd(TASK_VERBS)} ${rnd(TASK_NOUNS)}`,
      assigneeId: rnd(USERS).id,
      priority: rnd(PRIORITIES) as Priority,
      status: rnd(STATUSES) as Status,
      dueDate: dueDate.toISOString().split("T")[0],
      startDate,
    });
  }

  return tasks;
}
