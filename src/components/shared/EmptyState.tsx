interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="text-5xl opacity-40">{icon}</div>
      <div className="font-display font-bold text-base text-ink-2">{title}</div>
      {subtitle && <div className="text-sm text-ink-3">{subtitle}</div>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-5 py-2 rounded-lg bg-accent text-black text-sm font-display font-bold hover:opacity-85 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
