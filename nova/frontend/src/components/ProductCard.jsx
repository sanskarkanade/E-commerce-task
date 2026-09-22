import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

export default function ProductCard({ product, onAdd }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addToCart(product, 1);
    onAdd?.(product);
  };

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:border-ink/25 hover:shadow-sm">
      <Link to={`/products/${product._id}`} className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-cream">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs uppercase tracking-wide text-stone">{product.category}</p>
        <Link to={`/products/${product._id}`} className="line-clamp-1 font-medium text-ink hover:underline">
          {product.name}
        </Link>
        {product.rating > 0 && <StarRating rating={product.rating} size="text-xs" />}
        <p className="mt-1 font-display text-lg font-semibold text-ink">{formatPrice(product.price)}</p>

        <div className="mt-3 flex gap-2">
          <Link to={`/products/${product._id}`} className="btn-secondary flex-1 !py-2 text-xs">
            View
          </Link>
          <button onClick={handleAdd} disabled={outOfStock} className="btn-primary flex-1 !py-2 text-xs">
            {outOfStock ? 'Sold out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
