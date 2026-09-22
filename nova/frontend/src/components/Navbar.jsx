import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Apparel', label: 'Categories' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-ink ${isActive ? 'text-ink' : 'text-stone'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <nav className="section flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          NOVA
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/admin" className="text-sm font-medium text-stone transition hover:text-ink">
            Admin
          </Link>
          <Link to="/cart" className="btn-secondary !px-4 !py-2 text-sm">
            Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-cream">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-cream md:hidden">
          <div className="section flex flex-col gap-1 py-4">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-white"
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-white">
              Admin
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-white">
              Cart {itemCount > 0 ? `(${itemCount})` : ''}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
