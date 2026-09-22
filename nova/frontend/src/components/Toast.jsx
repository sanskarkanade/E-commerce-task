// Minimal toast list. Rendered once at the root; controlled via useToast().
export default function Toast({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-ink text-cream'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
