import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
