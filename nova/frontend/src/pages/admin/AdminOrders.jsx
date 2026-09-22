import { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/format';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const STATUS_STYLES = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Pending: 'bg-stone/20 text-ink',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    fetchOrders()
      .then((data) => { setOrders(data.orders); setStatus('ready'); })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  if (status === 'loading') return <LoadingSpinner label="Loading orders..." />;
  if (status === 'error') return <ErrorState message="Could not load orders." onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-stone">{orders.length} total orders (includes seed demo data).</p>

      {orders.length === 0 ? (
        <div className="mt-6"><EmptyState title="No orders yet" /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase text-stone">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{order.customer.name}</p>
                    <p className="text-xs text-stone">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-stone/20 text-ink'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
