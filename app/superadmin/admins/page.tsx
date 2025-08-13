'use client';

import AdminTable from '@/components/superadmin/admins/adminsTable';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

const page = () => {
  const { getAdmins } = useAuth();
  useEffect(() => {
    console.log(getAdmins);
  }, [getAdmins]);

  return (
    <div>
      <AdminTable admins={getAdmins} />
    </div>
  );
};

export default page;
