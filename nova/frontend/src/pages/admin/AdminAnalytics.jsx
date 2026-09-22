import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchOverview, fetchSales } from '../../services/analyticsService';
import { formatPrice } from '../../utils/format';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';

const COLORS = ['#141414', '#8A8578', '#C9A876', '#5B6B5B', '#A65D57'];

export default function AdminAnalytics() {
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    Promise.all([fetchSales(30), fetchOverview()])
      .then(([salesRes, overviewRes]) => {
        setSales(salesRes.sales.map((d) => ({ ...d, label: d.date.slice(5) })));
        setCategories(overviewRes.categoryDistribution);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  if (status === 'loading') return <LoadingSpinner label="Loading analytics..." />;
  if (status === 'error') return <ErrorState message="Could not load analytics." onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>
      <p className="mt-1 text-sm text-stone">Last 30 days of activity.</p>

      <div className="mt-6 card p-5">
        <p className="font-medium text-ink">Revenue</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#14141410" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#141414" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="font-medium text-ink">Orders per Day</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14141410" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#8A8578" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <p className="font-medium text-ink">Products by Category</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="count" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {categories.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
