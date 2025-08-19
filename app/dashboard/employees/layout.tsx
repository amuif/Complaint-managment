import { ReactNode } from 'react';

const EmployeesLayout = ({ children }: { children: ReactNode }) => {
  return <div className="px-2">{children}</div>;
};

export default EmployeesLayout;
