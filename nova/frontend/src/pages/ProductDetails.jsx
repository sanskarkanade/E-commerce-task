import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import StarRating from '../components/StarRating';
import QuantitySelector from '../components/QuantitySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import ProductCard from '../components/ProductCard';
import useToast from '../hooks/useToast';
import Toast from '../components/Toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toasts, showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setQuantity(1);
    fetchProductById(id)
      .then((data) => { if (active) { setProduct(data); setStatus('ready'); } })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    let active = true;
    fetchProducts({ category: product.category, limit: 5 })
      .then((data) => { if (active) setRelated(data.products.filter((p) => p._id !== product._id).slice(0, 4)); })
      .catch(() => {});
    return () => { active = false; };
  }, [product]);

  if (status === 'loading') return <LoadingSpinner label="Loading product..." />;
  if (status === 'error' || !product) {
    return (
      <div className="section py-16">
        <ErrorState message="We couldn't find this product." />
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="section py-10">
      <Toast toasts={toasts} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-ink/5">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-stone">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{product.name}</h1>
          {product.rating > 0 && <div className="mt-2"><StarRating rating={product.rating} /></div>}
          <p className="mt-4 font-display text-2xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-stone">{product.description}</p>

          <p className={`mt-4 text-sm font-medium ${outOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
            {outOfStock ? 'Out of stock' : `In stock — ${product.stock} available`}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <QuantitySelector value={quantity} max={product.stock} onChange={setQuantity} />
              <button
                className="btn-primary flex-1 sm:flex-none sm:px-10"
                onClick={() => { addToCart(product, quantity); showToast(`Added ${quantity} × ${product.name} to cart`); }}
              >
                Add to Cart
              </button>
            </div>
          )}

          {product.specifications?.length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="text-sm font-semibold text-ink">Specifications</p>
              <dl className="mt-3 space-y-2">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm">
                    <dt className="text-stone">{spec.label}</dt>
                    <dd className="font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link to="/shop" className="text-sm font-medium text-stone hover:text-ink">← Back to Shop</Link>
      </div>
    </div>
  );
}
