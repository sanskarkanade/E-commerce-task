export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <p className="text-2xl">⚠️</p>
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary !border-red-300 !py-2 text-sm text-red-700">
          Try again
        </button>
      )}
    </div>
  );
}
