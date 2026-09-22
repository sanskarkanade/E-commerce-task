import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Bags', 'Lifestyle'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  // Debounce search typing so we don't fire a request on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchInput) next.set('search', searchInput); else next.delete('search');
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    const search = searchParams.get('search') || '';
    fetchProducts({ search, category, sort })
      .then((data) => { if (active) { setProducts(data.products); setStatus('ready'); } })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [searchParams, category, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'newest') next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="section py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">Shop All</h1>
        <p className="mt-1 text-sm text-stone">Browse the full NOVA collection.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="input-field sm:max-w-xs"
        />

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                category === cat ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink hover:border-ink/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="input-field sm:max-w-[190px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {status === 'loading' && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        {status === 'ready' && products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>

      {status === 'ready' && products.length === 0 && (
        <EmptyState title="No products found" description="Try a different search term or category." />
      )}
      {status === 'error' && (
        <ErrorState message="Could not load products. Please check your connection and try again." />
      )}
    </div>
  );
}
