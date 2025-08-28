import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return <div className="px-2">{children}</div>;
};

export default layout;
