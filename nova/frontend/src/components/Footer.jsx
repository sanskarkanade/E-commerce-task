import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="section grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-lg font-semibold text-ink">NOVA</p>
          <p className="mt-3 max-w-xs text-sm text-stone">
            Modern essentials for everyday life. Thoughtfully designed, built to last.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-stone">
            <li><Link to="/shop" className="hover:text-ink">All Products</Link></li>
            <li><Link to="/shop?category=Apparel" className="hover:text-ink">Apparel</Link></li>
            <li><Link to="/shop?category=Footwear" className="hover:text-ink">Footwear</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-stone">
            <li><Link to="/about" className="hover:text-ink">About</Link></li>
            <li><Link to="/admin" className="hover:text-ink">Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-stone">
            <li>hello@nova-store.com</li>
            <li>+91 98765 00000</li>
            <li className="flex gap-3 pt-1">
              <span>Instagram</span>
              <span>Twitter</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-stone sm:flex-row">
          <p>© {new Date().getFullYear()} NOVA. All rights reserved.</p>
          <p>Built for a technical assessment — demo project.</p>
        </div>
      </div>
    </footer>
  );
}
