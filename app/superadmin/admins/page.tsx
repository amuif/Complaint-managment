'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/use-auth';

const AdminTable = dynamic(() => import('@/components/superadmin/admins/adminsTable'), {
  ssr: false,
  loading: () => <p>Loading admins...</p>,
});

export default function AdminsPage() {
  const { getAdmins } = useAuth();

  return <AdminTable admins={getAdmins} />;
}
