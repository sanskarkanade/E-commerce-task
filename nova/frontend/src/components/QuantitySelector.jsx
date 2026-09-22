export default function QuantitySelector({ value, max = 99, onChange }) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center rounded-full border border-ink/15">
      <button onClick={dec} disabled={value <= 1} className="h-9 w-9 text-lg text-ink disabled:opacity-30" aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <button onClick={inc} disabled={value >= max} className="h-9 w-9 text-lg text-ink disabled:opacity-30" aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
