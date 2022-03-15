import { useSession } from 'next-auth/react';
import { FC } from 'react';

export const LoggedInLayout: FC = ({ children }) => {
  const { status } = useSession();

  if (status !== 'authenticated') return null;
  return <>{children}</>;
};
