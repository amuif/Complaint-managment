'use client';

import AdminTable from '@/components/superadmin/admins/adminsTable';
import { useAuth } from '@/hooks/use-auth';

const page = () => {
  const { getAdmins } = useAuth();
  return (
    <div>
      <AdminTable admins={getAdmins} />
    </div>
  );
};

export default page;
