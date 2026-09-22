import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { placeOrder } from '../services/orderService';

const EMPTY_FORM = { name: '', email: '', phone: '', address: '', city: '', pincode: '' };

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderId, setOrderId] = useState(null);

  if (items.length === 0 && !orderId) return <Navigate to="/shop" replace />;

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (form.address.trim().length < 5) next.address = 'Enter your address';
    if (form.city.trim().length < 2) next.city = 'Enter your city';
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = 'Enter a 6-digit pincode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await placeOrder({
        customer: form,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      setOrderId(order._id);
      clearCart();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="section flex flex-col items-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Order Confirmed!</h1>
        <p className="mt-2 max-w-md text-sm text-stone">
          Thank you — your order has been placed. This is a demo checkout, so no real payment was processed.
        </p>
        <p className="mt-4 rounded-full bg-ink/5 px-4 py-2 text-xs font-medium text-ink">
          Order ID: {orderId}
        </p>
        <button onClick={() => navigate('/shop')} className="btn-primary mt-8">Continue Shopping</button>
      </div>
    );
  }

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', span: 2 },
    { name: 'email', label: 'Email', type: 'email', span: 2 },
    { name: 'phone', label: 'Phone', type: 'tel', span: 2 },
    { name: 'address', label: 'Address', type: 'text', span: 2 },
    { name: 'city', label: 'City', type: 'text', span: 1 },
    { name: 'pincode', label: 'Pincode', type: 'text', span: 1 },
  ];

  return (
    <div className="section py-10">
      <h1 className="font-display text-3xl font-semibold text-ink">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card grid grid-cols-2 gap-4 p-6 lg:col-span-2">
          {fields.map((field) => (
            <div key={field.name} className={field.span === 2 ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
              <label className="mb-1 block text-xs font-medium text-stone">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="input-field"
              />
              {errors[field.name] && <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>}
            </div>
          ))}

          {submitError && (
            <p className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary col-span-2 mt-2">
            {submitting ? 'Placing order...' : `Place Order — ${formatPrice(total)}`}
          </button>
          <p className="col-span-2 text-center text-xs text-stone">
            This is a demo checkout. No real payment will be processed.
          </p>
        </form>

        <div className="card h-fit p-6">
          <p className="font-display text-lg font-semibold text-ink">Order Summary</p>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-stone">
                <span>{item.name} × {item.quantity}</span>
                <span className="text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-stone"><span>Subtotal</span><span className="text-ink">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-stone"><span>Shipping</span><span className="text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-base font-semibold text-ink"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
