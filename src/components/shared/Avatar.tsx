import type { User } from "../../types";

interface AvatarProps {
  user: User;
  size?: number;
  borderColor?: string;
  animated?: boolean;
  className?: string;
}

export function Avatar({
  user,
  size = 24,
  borderColor = "#1c1e22",
  animated = false,
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 border-2 font-display font-bold select-none ${
        animated ? "animate-avatarPop" : ""
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: user.color,
        borderColor,
        fontSize: size * 0.38,
        color: "#000",
      }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}
