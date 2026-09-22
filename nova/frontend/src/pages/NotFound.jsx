import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-ink">404</p>
      <p className="text-stone">This page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-4">Back to Home</Link>
    </div>
  );
}
