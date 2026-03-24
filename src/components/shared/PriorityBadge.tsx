import type { Priority } from "../../types";
import { PRIORITY_STYLES } from "../../data/constants";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const styles = PRIORITY_STYLES[priority];
  return (
    <span
      className={`font-mono font-medium rounded-full border ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[10px] px-2 py-0.5"
      }`}
      style={{
        background: styles.bg,
        color: styles.text,
        borderColor: styles.border,
        letterSpacing: "0.05em",
      }}
    >
      {priority}
    </span>
  );
}
