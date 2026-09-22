export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center">
      <p className="text-2xl">🗂️</p>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone">{description}</p>}
      {action}
    </div>
  );
}
