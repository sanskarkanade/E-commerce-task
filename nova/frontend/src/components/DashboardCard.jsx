export default function DashboardCard({ label, value, hint, tone = 'default' }) {
  const toneClass = tone === 'warning' ? 'text-amber-600' : 'text-ink';
  return (
    <div className="card p-5">
      <p className="text-sm text-stone">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-stone">{hint}</p>}
    </div>
  );
}
