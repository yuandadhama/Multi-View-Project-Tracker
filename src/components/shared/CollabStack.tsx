import type { User } from "../../types";
import { Avatar } from "./Avatar";

interface CollabStackProps {
  users: User[];
  borderColor?: string;
  size?: number;
}

export function CollabStack({
  users,
  borderColor = "#1c1e22",
  size = 20,
}: CollabStackProps) {
  if (!users.length) return null;
  const visible = users.slice(0, 2);
  const overflow = users.length - 2;

  return (
    <div className="flex items-center">
      {visible.map((u, i) => (
        <Avatar
          key={u.id}
          user={u}
          size={size}
          borderColor={borderColor}
          animated
          className={i > 0 ? "-ml-1.5" : ""}
        />
      ))}
      {overflow > 0 && (
        <div
          className="-ml-1.5 rounded-full flex items-center justify-center border-2 font-mono text-[8px] flex-shrink-0"
          style={{
            width: size,
            height: size,
            background: "#242729",
            borderColor,
            color: "#9aa0ad",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
