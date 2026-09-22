import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ErrorState from '../components/ErrorState';

const CATEGORIES = [
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
];

const BENEFITS = [
  { icon: '✓', title: 'Quality products', text: 'Every piece is checked for materials, fit and finish before it ships.' },
  { icon: '🔒', title: 'Secure checkout', text: 'Your details are handled carefully at every step of checkout.' },
  { icon: '🚚', title: 'Fast delivery', text: 'Orders are processed quickly and shipped across the country.' },
  { icon: '↺', title: 'Easy returns', text: '7-day hassle-free returns on unused items.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetchProducts({ limit: 8, sort: 'newest' })
      .then((data) => { if (active) { setProducts(data.products); setStatus('ready'); } })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="section grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-stone">New season</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Essentials, made to last.
          </h1>
          <p className="mt-4 max-w-md text-base text-stone">
            NOVA designs modern, everyday pieces with clean lines and honest materials —
            built for real life, not just the rack.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/shop" className="btn-primary">Shop Now</Link>
            <Link to="/about" className="btn-secondary">Our Story</Link>
          </div>
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5 sm:aspect-[16/11]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
            alt="NOVA seasonal collection"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="section py-10">
        <h2 className="font-display text-2xl font-semibold text-ink">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group overflow-hidden rounded-2xl"
            >
              <div className="aspect-square overflow-hidden bg-ink/5">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <p className="mt-2 text-sm font-medium text-ink">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="section py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Featured Products</h2>
          <Link to="/shop" className="text-sm font-medium text-stone hover:text-ink">View all →</Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {status === 'loading' && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          {status === 'ready' && products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
        {status === 'error' && <ErrorState message="Could not load featured products." />}
      </section>

      {/* Why NOVA */}
      <section className="bg-white py-16">
        <div className="section">
          <h2 className="font-display text-2xl font-semibold text-ink">Why NOVA</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream">{b.icon}</div>
                <p className="mt-4 font-medium text-ink">{b.title}</p>
                <p className="mt-1 text-sm text-stone">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section py-16">
        <div className="card flex flex-col items-center gap-4 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Stay in the loop</h2>
          <p className="max-w-sm text-sm text-stone">
            Get early access to new drops and the occasional discount. No spam.
          </p>
          <form
            className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" required placeholder="you@example.com" className="input-field" />
            <button type="submit" className="btn-primary shrink-0">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
