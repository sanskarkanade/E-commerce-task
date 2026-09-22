import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="section py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={<Link to="/shop" className="btn-primary mt-2">Start Shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="section py-10">
      <h1 className="font-display text-3xl font-semibold text-ink">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="card flex gap-4 p-4">
              <Link to={`/products/${item.productId}`} className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ink/5">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/products/${item.productId}`} className="text-sm font-medium text-ink hover:underline">
                    {item.name}
                  </Link>
                  <button onClick={() => removeFromCart(item.productId)} className="text-xs text-stone hover:text-red-600">
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector value={item.quantity} max={item.stock ?? 99} onChange={(q) => updateQuantity(item.productId, q)} />
                  <p className="font-medium text-ink">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <p className="font-display text-lg font-semibold text-ink">Order Summary</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Shipping</span>
              <span className="text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
