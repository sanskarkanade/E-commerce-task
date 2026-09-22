import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../services/productService';
import { formatPrice } from '../../utils/format';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Bags', 'Lifestyle'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [pendingDelete, setPendingDelete] = useState(null);
  const { toasts, showToast } = useToast();

  const load = () => {
    setStatus('loading');
    fetchProducts({})
      .then((data) => { setProducts(data.products); setStatus('ready'); })
      .catch(() => setStatus('error'));
  };

  useEffect(load, []);

  const filtered = products.filter((p) => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const confirmDelete = async () => {
    try {
      await deleteProduct(pendingDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== pendingDelete._id));
      showToast('Product deleted');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setPendingDelete(null);
    }
  };

  if (status === 'loading') return <LoadingSpinner label="Loading products..." />;
  if (status === 'error') return <ErrorState message="Could not load products." onRetry={load} />;

  return (
    <div>
      <Toast toasts={toasts} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
          <p className="mt-1 text-sm text-stone">{products.length} products in catalog.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field sm:max-w-xs"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field sm:max-w-[180px]">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title="No products found" /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase text-stone">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-ink">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-stone">{p.category}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(p.price)}</td>
                  <td className={`px-4 py-3 ${p.stock <= 5 ? 'font-medium text-amber-600' : 'text-stone'}`}>{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/products/${p._id}/edit`} className="text-xs font-medium text-ink hover:underline">Edit</Link>
                      <button onClick={() => setPendingDelete(p)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="card w-full max-w-sm p-6">
            <p className="font-medium text-ink">Delete "{pendingDelete.name}"?</p>
            <p className="mt-1 text-sm text-stone">This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setPendingDelete(null)} className="btn-secondary !py-2 text-sm">Cancel</button>
              <button onClick={confirmDelete} className="btn-primary !bg-red-600 !py-2 text-sm hover:!bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
