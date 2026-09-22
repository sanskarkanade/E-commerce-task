import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProductById } from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import useToast from '../../hooks/useToast';
import Toast from '../../components/Toast';

const CATEGORIES = ['Apparel', 'Footwear', 'Accessories', 'Bags', 'Lifestyle'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Apparel', image: '', stock: '', rating: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    fetchProductById(id)
      .then((product) => {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          rating: product.rating,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: form.rating === '' ? 0 : Number(form.rating),
      };
      if (isEdit) {
        await updateProduct(id, payload);
        showToast('Product updated');
      } else {
        await createProduct(payload);
        showToast('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product..." />;

  return (
    <div>
      <Toast toasts={toasts} />
      <h1 className="font-display text-2xl font-semibold text-ink">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="card mt-6 grid grid-cols-2 gap-4 p-6">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-stone">Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-stone">Description</label>
          <textarea name="description" required rows={4} value={form.description} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone">Price (₹)</label>
          <input name="price" type="number" min="0" step="1" required value={form.price} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone">Stock</label>
          <input name="stock" type="number" min="0" step="1" required value={form.stock} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone">Rating (0-5)</label>
          <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className="input-field" />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-stone">Image URL</label>
          <input name="image" type="url" required value={form.image} onChange={handleChange} className="input-field" />
        </div>

        {form.image && (
          <div className="col-span-2 h-32 w-32 overflow-hidden rounded-xl bg-ink/5">
            <img src={form.image} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}

        {error && <p className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
