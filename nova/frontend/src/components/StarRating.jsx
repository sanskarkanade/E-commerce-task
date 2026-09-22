export default function StarRating({ rating = 0, size = 'text-sm' }) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-1 ${size}`} aria-label={`Rated ${rating} out of 5`}>
      <span className="text-amber-500">{'★'.repeat(rounded)}</span>
      <span className="text-ink/15">{'★'.repeat(5 - rounded)}</span>
      <span className="ml-1 text-stone">{rating.toFixed(1)}</span>
    </div>
  );
}
