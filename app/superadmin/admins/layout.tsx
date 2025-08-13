import { ReactNode } from 'react';

const AdminsLayout = ({ children }: { children: ReactNode }) => {
  return <div className="px-2">{children}</div>;
};

export default AdminsLayout;
