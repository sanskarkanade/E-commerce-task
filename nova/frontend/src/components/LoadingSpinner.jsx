export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-stone">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
