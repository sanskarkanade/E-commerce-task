import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOverview } from '../../services/analyticsService';
import { formatPrice, formatDate } from '../../utils/format';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    fetchOverview()
      .then((res) => { setData(res); setStatus('ready'); })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  if (status === 'loading') return <LoadingSpinner label="Loading dashboard..." />;
  if (status === 'error') return <ErrorState message="Could not load dashboard data." onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-stone">A quick look at how the store is performing.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Total Products" value={data.totalProducts} />
        <DashboardCard label="Total Orders" value={data.totalOrders} />
        <DashboardCard label="Total Revenue" value={formatPrice(data.totalRevenue)} />
        <DashboardCard
          label="Low Stock Products"
          value={data.lowStockCount}
          tone={data.lowStockCount > 0 ? 'warning' : 'default'}
          hint={data.lowStockCount > 0 ? 'At or below 5 units' : 'All good'}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">Recent Orders</p>
            <Link to="/admin/orders" className="text-xs font-medium text-stone hover:text-ink">View all →</Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-stone">No orders yet.</p>
          ) : (
            <div className="mt-3 divide-y divide-ink/10">
              {data.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-ink">{order.customer.name}</p>
                    <p className="text-xs text-stone">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-ink">{formatPrice(order.total)}</p>
                    <p className="text-xs text-stone">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <p className="font-medium text-ink">Low Stock Items</p>
          {data.lowStockItems.length === 0 ? (
            <p className="mt-4 text-sm text-stone">Nothing is running low.</p>
          ) : (
            <div className="mt-3 divide-y divide-ink/10">
              {data.lowStockItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-2.5">
                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                  <p className="flex-1 truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-sm font-medium text-amber-600">{item.stock} left</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
