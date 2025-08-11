import { ReactNode } from 'react';

const OrganazationLayout = ({ children }: { children: ReactNode }) => {
  return <div className="px-2 py-5">{children}</div>;
};

export default OrganazationLayout;
