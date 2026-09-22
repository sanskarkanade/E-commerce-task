import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '◧', end: true },
  { to: '/admin/products', label: 'Products', icon: '▤' },
  { to: '/admin/products/new', label: 'Add Product', icon: '＋' },
  { to: '/admin/orders', label: 'Orders', icon: '▥' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-ink/10 bg-white">
      <div className="border-b border-ink/10 px-5 py-5">
        <p className="font-display text-lg font-semibold text-ink">NOVA Admin</p>
        {admin && <p className="mt-0.5 truncate text-xs text-stone">{admin.email}</p>}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5'
              }`
            }
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 p-3">
        <button onClick={logout} className="btn-secondary w-full !py-2 text-sm">
          Log out
        </button>
      </div>
    </aside>
  );
}
